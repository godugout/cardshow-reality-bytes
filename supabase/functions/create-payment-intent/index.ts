
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

    const { listing_id, shipping_address, payment_method_id, save_payment_method } = await req.json();

    // Get listing details with enhanced data
    const { data: listing, error: listingError } = await supabaseClient
      .from("marketplace_listings")
      .select(`
        *,
        seller_profiles!seller_id(stripe_account_id, user_id),
        card:cards(id, title, image_url, rarity, creator_id)
      `)
      .eq("id", listing_id)
      .single();

    if (listingError || !listing) throw new Error("Listing not found");
    if (listing.status !== 'active') throw new Error("Listing is no longer available");

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    const totalAmount = listing.price + (listing.shipping_cost || 0);
    const platformFee = Math.round(totalAmount * 0.05); // 5% platform fee
    const sellerAmount = totalAmount - platformFee;

    // Get or create Stripe customer
    let customerId;
    const { data: existingCustomer } = await supabaseClient
      .from("user_profiles")
      .select("stripe_customer_id")
      .eq("id", userData.user.id)
      .single();

    if (existingCustomer?.stripe_customer_id) {
      customerId = existingCustomer.stripe_customer_id;
    } else {
      const customer = await stripe.customers.create({
        email: userData.user.email,
        metadata: {
          user_id: userData.user.id,
        },
      });
      customerId = customer.id;

      // Save customer ID to user profile
      await supabaseClient
        .from("user_profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", userData.user.id);
    }

    // Create payment intent with enhanced configuration
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Convert to cents
      currency: "usd",
      customer: customerId,
      payment_method: payment_method_id,
      confirmation_method: 'manual',
      confirm: true,
      setup_future_usage: save_payment_method ? 'on_session' : undefined,
      application_fee_amount: platformFee * 100,
      transfer_data: {
        destination: listing.seller_profiles.stripe_account_id,
      },
      metadata: {
        listing_id: listing_id,
        buyer_id: userData.user.id,
        seller_id: listing.seller_id,
        card_id: listing.card?.id || '',
        platform: 'cardshow'
      },
      shipping: shipping_address ? {
        name: shipping_address.name,
        address: {
          line1: shipping_address.address_line_1,
          line2: shipping_address.address_line_2,
          city: shipping_address.city,
          state: shipping_address.state,
          postal_code: shipping_address.postal_code,
          country: shipping_address.country,
        },
      } : undefined,
    });

    // Create transaction record with service role key for bypassing RLS
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    await supabaseService.from("transactions").insert({
      buyer_id: userData.user.id,
      seller_id: listing.seller_id,
      listing_id: listing_id,
      amount: totalAmount,
      platform_fee: platformFee,
      stripe_payment_intent_id: paymentIntent.id,
      shipping_info: shipping_address,
      status: paymentIntent.status === 'succeeded' ? 'completed' : 'pending',
      metadata: {
        card_title: listing.card?.title,
        card_rarity: listing.card?.rarity,
        payment_method_saved: save_payment_method
      }
    });

    // If payment succeeded immediately, update listing status
    if (paymentIntent.status === 'succeeded') {
      await supabaseService
        .from("marketplace_listings")
        .update({ 
          status: "sold",
          sold_at: new Date().toISOString()
        })
        .eq("id", listing_id);
    }

    return new Response(JSON.stringify({ 
      payment_intent: {
        id: paymentIntent.id,
        client_secret: paymentIntent.client_secret,
        status: paymentIntent.status,
        requires_action: paymentIntent.status === 'requires_action',
        next_action: paymentIntent.next_action
      },
      amount: totalAmount,
      platform_fee: platformFee,
      seller_amount: sellerAmount
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return new Response(JSON.stringify({ 
      error: error.message,
      code: error.code || 'payment_intent_failed'
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
