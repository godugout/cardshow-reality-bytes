
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
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    if (!signature || !webhookSecret) {
      throw new Error("Missing webhook signature or secret");
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return new Response(`Webhook signature verification failed: ${err.message}`, {
        status: 400,
      });
    }

    console.log(`Processing webhook event: ${event.type}`);

    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object, supabaseService);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object, supabaseService);
        break;
      
      case 'payment_method.attached':
        await handlePaymentMethodAttached(event.data.object, supabaseService);
        break;
      
      case 'customer.source.created':
        await handleCustomerSourceCreated(event.data.object, supabaseService);
        break;
      
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object, supabaseService);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(`Webhook error: ${error.message}`, {
      status: 400,
    });
  }
});

async function handlePaymentSucceeded(paymentIntent: any, supabase: any) {
  console.log("Payment succeeded:", paymentIntent.id);
  
  // Update transaction status
  const { error: updateError } = await supabase
    .from("transactions")
    .update({
      status: "completed",
      completed_at: new Date().toISOString(),
      stripe_payment_method_id: paymentIntent.payment_method
    })
    .eq("stripe_payment_intent_id", paymentIntent.id);

  if (updateError) {
    console.error("Error updating transaction:", updateError);
    return;
  }

  // Get transaction details for further processing
  const { data: transaction } = await supabase
    .from("transactions")
    .select("*")
    .eq("stripe_payment_intent_id", paymentIntent.id)
    .single();

  if (transaction) {
    // Update listing status
    await supabase
      .from("marketplace_listings")
      .update({ 
        status: "sold",
        sold_at: new Date().toISOString(),
        buyer_id: transaction.buyer_id
      })
      .eq("id", transaction.listing_id);

    // Send notification to seller
    await supabase
      .from("notifications")
      .insert({
        user_id: transaction.seller_id,
        type: "payment_received",
        title: "Payment Received",
        message: `Payment of $${transaction.amount} has been received for your card sale`,
        metadata: {
          transaction_id: transaction.id,
          payment_intent_id: paymentIntent.id
        }
      });
  }
}

async function handlePaymentFailed(paymentIntent: any, supabase: any) {
  console.log("Payment failed:", paymentIntent.id);
  
  // Update transaction status
  await supabase
    .from("transactions")
    .update({
      status: "failed",
      failure_reason: paymentIntent.last_payment_error?.message || "Payment failed"
    })
    .eq("stripe_payment_intent_id", paymentIntent.id);

  // Get transaction details
  const { data: transaction } = await supabase
    .from("transactions")
    .select("buyer_id, seller_id, listing_id")
    .eq("stripe_payment_intent_id", paymentIntent.id)
    .single();

  if (transaction) {
    // Send notification to buyer
    await supabase
      .from("notifications")
      .insert({
        user_id: transaction.buyer_id,
        type: "payment_failed",
        title: "Payment Failed",
        message: "Your payment could not be processed. Please try again with a different payment method.",
        metadata: {
          payment_intent_id: paymentIntent.id,
          listing_id: transaction.listing_id
        }
      });
  }
}

async function handlePaymentMethodAttached(paymentMethod: any, supabase: any) {
  console.log("Payment method attached:", paymentMethod.id);
  
  // Store payment method details for the customer
  const { data: userProfile } = await supabase
    .from("user_profiles")
    .select("id")
    .eq("stripe_customer_id", paymentMethod.customer)
    .single();

  if (userProfile) {
    await supabase
      .from("user_payment_methods")
      .insert({
        user_id: userProfile.id,
        stripe_payment_method_id: paymentMethod.id,
        payment_method_type: paymentMethod.type,
        card_brand: paymentMethod.card?.brand,
        card_last4: paymentMethod.card?.last4,
        card_exp_month: paymentMethod.card?.exp_month,
        card_exp_year: paymentMethod.card?.exp_year,
        is_default: false
      });
  }
}

async function handleCustomerSourceCreated(source: any, supabase: any) {
  console.log("Customer source created:", source.id);
  // Handle legacy payment source creation if needed
}

async function handleInvoicePaymentSucceeded(invoice: any, supabase: any) {
  console.log("Invoice payment succeeded:", invoice.id);
  // Handle subscription or recurring payment success
}
