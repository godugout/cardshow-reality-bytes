
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
    const { payment_intent_id, tracking_number } = await req.json();
    
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Get payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);
    
    if (paymentIntent.status !== "succeeded") {
      throw new Error("Payment not completed");
    }

    // Update transaction status
    const { data: transaction, error } = await supabaseClient
      .from("transactions")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
        tracking_number: tracking_number,
      })
      .eq("stripe_payment_intent_id", payment_intent_id)
      .select()
      .single();

    if (error) throw error;

    // Update listing status to sold
    await supabaseClient
      .from("marketplace_listings")
      .update({ status: "sold" })
      .eq("id", transaction.listing_id);

    // Update seller statistics
    await supabaseClient.rpc("increment", {
      table_name: "seller_profiles",
      column_name: "total_sales",
      id_column: "user_id",
      id_value: transaction.seller_id,
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error confirming payment:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
