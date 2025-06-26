
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

    const { action, payment_method_id, set_default } = await req.json();

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Get user's Stripe customer ID
    const { data: userProfile } = await supabaseClient
      .from("user_profiles")
      .select("stripe_customer_id")
      .eq("id", userData.user.id)
      .single();

    if (!userProfile?.stripe_customer_id) {
      throw new Error("No customer profile found");
    }

    const customerId = userProfile.stripe_customer_id;

    switch (action) {
      case 'list':
        // List all payment methods
        const paymentMethods = await stripe.paymentMethods.list({
          customer: customerId,
          type: 'card',
        });

        return new Response(JSON.stringify({
          payment_methods: paymentMethods.data.map(pm => ({
            id: pm.id,
            type: pm.type,
            card: pm.card ? {
              brand: pm.card.brand,
              last4: pm.card.last4,
              exp_month: pm.card.exp_month,
              exp_year: pm.card.exp_year,
            } : null,
            created: pm.created,
          }))
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });

      case 'delete':
        // Delete a payment method
        if (!payment_method_id) {
          throw new Error("Payment method ID required for deletion");
        }

        await stripe.paymentMethods.detach(payment_method_id);

        // Remove from our database
        const supabaseService = createClient(
          Deno.env.get("SUPABASE_URL") ?? "",
          Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
          { auth: { persistSession: false } }
        );

        await supabaseService
          .from("user_payment_methods")
          .delete()
          .eq("stripe_payment_method_id", payment_method_id)
          .eq("user_id", userData.user.id);

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });

      case 'set_default':
        // Set default payment method
        if (!payment_method_id) {
          throw new Error("Payment method ID required");
        }

        await stripe.customers.update(customerId, {
          invoice_settings: {
            default_payment_method: payment_method_id,
          },
        });

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });

      case 'create_setup_intent':
        // Create setup intent for adding new payment method
        const setupIntent = await stripe.setupIntents.create({
          customer: customerId,
          usage: 'on_session',
          payment_method_types: ['card'],
        });

        return new Response(JSON.stringify({
          client_secret: setupIntent.client_secret,
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });

      default:
        throw new Error("Invalid action");
    }
  } catch (error) {
    console.error("Payment method management error:", error);
    return new Response(JSON.stringify({ 
      error: error.message,
      code: error.code || 'payment_method_error'
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
