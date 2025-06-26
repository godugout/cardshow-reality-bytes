
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user) throw new Error("Unauthorized");

    const { payment_intent_id, tracking_number } = await req.json();

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Get payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);
    
    if (paymentIntent.status !== "succeeded") {
      throw new Error(`Payment not completed. Status: ${paymentIntent.status}`);
    }

    // Use service role key to bypass RLS
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Update transaction status
    const { data: transaction, error: transactionError } = await supabaseService
      .from("transactions")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
        tracking_number: tracking_number,
        stripe_payment_method_id: paymentIntent.payment_method
      })
      .eq("stripe_payment_intent_id", payment_intent_id)
      .select()
      .single();

    if (transactionError) throw transactionError;

    // Update listing status to sold
    await supabaseService
      .from("marketplace_listings")
      .update({ 
        status: "sold",
        sold_at: new Date().toISOString(),
        buyer_id: userData.user.id
      })
      .eq("id", transaction.listing_id);

    // Update seller statistics
    await supabaseService
      .from("seller_profiles")
      .update({
        total_sales: supabaseService.rpc('increment', { step: 1 }),
        total_revenue: supabaseService.rpc('increment', { step: transaction.amount - transaction.platform_fee })
      })
      .eq("user_id", transaction.seller_id);

    // Create notification for seller
    await supabaseService
      .from("notifications")
      .insert({
        user_id: transaction.seller_id,
        type: "sale_completed",
        title: "Card Sold Successfully",
        message: `Your card listing has been sold for $${transaction.amount}`,
        metadata: {
          transaction_id: transaction.id,
          listing_id: transaction.listing_id,
          buyer_id: transaction.buyer_id
        }
      });

    // Award XP to both buyer and seller if functions exist
    try {
      await supabaseService.rpc('award_user_xp', {
        user_uuid: transaction.seller_id,
        points: 50,
        source: 'card_sale',
        source_ref_id: transaction.id
      });

      await supabaseService.rpc('award_user_xp', {
        user_uuid: transaction.buyer_id,
        points: 25,
        source: 'card_purchase',
        source_ref_id: transaction.id
      });
    } catch (xpError) {
      console.log("XP award failed (non-critical):", xpError);
    }

    return new Response(JSON.stringify({ 
      success: true,
      transaction: {
        id: transaction.id,
        status: transaction.status,
        amount: transaction.amount,
        tracking_number: transaction.tracking_number
      }
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error confirming payment:", error);
    return new Response(JSON.stringify({ 
      error: error.message,
      code: error.code || 'payment_confirmation_failed'
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
