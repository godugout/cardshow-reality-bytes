
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
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user) throw new Error("Unauthorized");

    const { listing_id, shipping_address } = await req.json();

    // Get listing details
    const { data: listing, error: listingError } = await supabaseClient
      .from("marketplace_listings")
      .select(`
        *,
        seller_profiles!seller_id(stripe_account_id)
      `)
      .eq("id", listing_id)
      .single();

    if (listingError || !listing) throw new Error("Listing not found");

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    const totalAmount = listing.price + (listing.shipping_cost || 0);
    const platformFee = Math.round(totalAmount * 0.05); // 5% platform fee
    const sellerAmount = totalAmount - platformFee;

    // Create payment intent with marketplace fee split
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Convert to cents
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      application_fee_amount: platformFee * 100,
      transfer_data: {
        destination: listing.seller_profiles.stripe_account_id,
      },
      metadata: {
        listing_id: listing_id,
        buyer_id: userData.user.id,
        seller_id: listing.seller_id,
      },
    });

    // Create transaction record
    await supabaseClient.from("transactions").insert({
      buyer_id: userData.user.id,
      seller_id: listing.seller_id,
      listing_id: listing_id,
      amount: totalAmount,
      platform_fee: platformFee,
      stripe_payment_intent_id: paymentIntent.id,
      shipping_info: shipping_address,
      status: "pending",
    });

    return new Response(JSON.stringify({ 
      client_secret: paymentIntent.client_secret,
      amount: totalAmount,
      platform_fee: platformFee 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
