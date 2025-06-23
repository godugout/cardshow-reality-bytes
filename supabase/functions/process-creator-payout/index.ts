
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATOR-PAYOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Processing creator payouts");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Get creators ready for payout
    const { data: creators, error: creatorsError } = await supabase
      .from("creator_profiles")
      .select(`
        id,
        user_id,
        stripe_account_id,
        creator_earnings!inner(
          id,
          net_amount,
          status
        )
      `)
      .eq("verification_status", "verified")
      .eq("payout_enabled", true)
      .eq("creator_earnings.status", "ready_for_payout");

    if (creatorsError) throw creatorsError;

    logStep("Found creators for payout", { count: creators?.length || 0 });

    for (const creator of creators || []) {
      try {
        // Calculate total payout amount
        const totalAmount = creator.creator_earnings.reduce(
          (sum: number, earning: any) => sum + Number(earning.net_amount),
          0
        );

        if (totalAmount < 10) continue; // Skip small amounts

        // Create Stripe transfer
        const transfer = await stripe.transfers.create({
          amount: Math.round(totalAmount * 100), // Convert to cents
          currency: "usd",
          destination: creator.stripe_account_id,
          description: "Creator earnings payout",
        });

        logStep("Transfer created", { 
          creatorId: creator.id, 
          amount: totalAmount,
          transferId: transfer.id 
        });

        // Update earnings status
        const earningIds = creator.creator_earnings.map((e: any) => e.id);
        const { error: updateError } = await supabase
          .from("creator_earnings")
          .update({
            status: "paid",
            payout_date: new Date().toISOString(),
            stripe_transfer_id: transfer.id,
          })
          .in("id", earningIds);

        if (updateError) throw updateError;

      } catch (error) {
        logStep("ERROR processing creator payout", { 
          creatorId: creator.id, 
          error: error.message 
        });
      }
    }

    return new Response(
      JSON.stringify({ success: true, processed: creators?.length || 0 }),
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
