
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-STRIPE-STATUS] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) throw new Error("Authentication failed");

    logStep("User authenticated", { userId: user.id });

    // Get creator profile
    const { data: creatorProfile, error: profileError } = await supabase
      .from("creator_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (profileError || !creatorProfile?.stripe_account_id) {
      throw new Error("Creator profile or Stripe account not found");
    }

    logStep("Creator profile found", { accountId: creatorProfile.stripe_account_id });

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Get account details from Stripe
    const account = await stripe.accounts.retrieve(creatorProfile.stripe_account_id);
    
    logStep("Stripe account retrieved", { 
      id: account.id, 
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled 
    });

    // Determine verification status
    let verificationStatus = 'pending';
    if (account.charges_enabled && account.payouts_enabled) {
      verificationStatus = 'verified';
    } else if (account.requirements?.disabled_reason) {
      verificationStatus = 'suspended';
    }

    // Update creator profile with latest status
    const { error: updateError } = await supabase
      .from("creator_profiles")
      .update({
        verification_status: verificationStatus,
        payout_enabled: account.payouts_enabled,
        updated_at: new Date().toISOString(),
      })
      .eq("id", creatorProfile.id);

    if (updateError) throw updateError;

    logStep("Profile updated", { verificationStatus, payoutEnabled: account.payouts_enabled });

    return new Response(
      JSON.stringify({
        success: true,
        account_status: {
          id: account.id,
          verification_status: verificationStatus,
          charges_enabled: account.charges_enabled,
          payouts_enabled: account.payouts_enabled,
          requirements: account.requirements,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    logStep("ERROR", { message: error.message });
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
