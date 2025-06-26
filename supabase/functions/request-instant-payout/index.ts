
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[INSTANT-PAYOUT] ${step}${detailsStr}`);
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

    const { creator_id } = await req.json();
    logStep("Request data", { creator_id, userId: user.id });

    // Verify the creator owns this profile
    const { data: creatorProfile, error: profileError } = await supabase
      .from("creator_profiles")
      .select("*")
      .eq("id", creator_id)
      .eq("user_id", user.id)
      .single();

    if (profileError || !creatorProfile) {
      throw new Error("Creator profile not found or access denied");
    }

    if (!creatorProfile.stripe_account_id || !creatorProfile.payout_enabled) {
      throw new Error("Stripe account not connected or payouts not enabled");
    }

    // Get pending earnings
    const { data: pendingEarnings, error: earningsError } = await supabase
      .from("creator_earnings")
      .select("*")
      .eq("creator_id", creator_id)
      .in("status", ["pending", "ready_for_payout"]);

    if (earningsError) throw earningsError;

    const totalAmount = pendingEarnings?.reduce(
      (sum, earning) => sum + Number(earning.net_amount),
      0
    ) || 0;

    if (totalAmount < 1) {
      throw new Error("Minimum payout amount is $1.00");
    }

    logStep("Pending earnings calculated", { totalAmount, count: pendingEarnings?.length });

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Create instant payout (transfer)
    const transfer = await stripe.transfers.create({
      amount: Math.round((totalAmount * 0.99) * 100), // 1% instant payout fee
      currency: "usd",
      destination: creatorProfile.stripe_account_id,
      description: "Instant creator payout",
      metadata: {
        creator_id: creator_id,
        payout_type: "instant",
        original_amount: totalAmount.toString(),
      },
    });

    logStep("Stripe transfer created", { 
      transferId: transfer.id,
      amount: transfer.amount / 100
    });

    // Update earning records
    if (pendingEarnings?.length) {
      const earningIds = pendingEarnings.map(e => e.id);
      const { error: updateError } = await supabase
        .from("creator_earnings")
        .update({
          status: "paid",
          payout_date: new Date().toISOString(),
          stripe_transfer_id: transfer.id,
        })
        .in("id", earningIds);

      if (updateError) throw updateError;
    }

    // Update creator profile balance
    const { error: balanceUpdateError } = await supabase
      .from("creator_profiles")
      .update({
        available_balance: 0, // Reset balance after payout
        updated_at: new Date().toISOString(),
      })
      .eq("id", creator_id);

    if (balanceUpdateError) console.warn("Could not update balance:", balanceUpdateError);

    logStep("Payout completed successfully");

    return new Response(
      JSON.stringify({
        success: true,
        transfer_id: transfer.id,
        amount_paid: transfer.amount / 100,
        fee_charged: totalAmount * 0.01,
        earnings_count: pendingEarnings?.length || 0,
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
