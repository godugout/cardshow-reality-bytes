import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[GENERATE-TAX-REPORT] ${step}${detailsStr}`);
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

    const { creator_id, year } = await req.json();
    logStep("Request data", { creator_id, year, userId: user.id });

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

    // Get earnings for the specified year
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59);

    const { data: earnings, error: earningsError } = await supabase
      .from("creator_earnings")
      .select("*")
      .eq("creator_id", creator_id)
      .gte("transaction_date", startDate.toISOString())
      .lte("transaction_date", endDate.toISOString())
      .eq("status", "paid");

    if (earningsError) throw earningsError;

    logStep("Earnings retrieved", { count: earnings?.length || 0 });

    // Calculate totals by source type
    const totals = earnings?.reduce((acc: any, earning: any) => {
      const sourceType = earning.source_type;
      if (!acc[sourceType]) {
        acc[sourceType] = {
          gross_amount: 0,
          platform_fees: 0,
          net_amount: 0,
          transaction_count: 0,
        };
      }
      
      acc[sourceType].gross_amount += Number(earning.amount);
      acc[sourceType].platform_fees += Number(earning.platform_fee);
      acc[sourceType].net_amount += Number(earning.net_amount);
      acc[sourceType].transaction_count += 1;
      
      return acc;
    }, {}) || {};

    // Calculate overall totals
    const overallTotals = Object.values(totals).reduce((acc: any, curr: any) => ({
      gross_amount: acc.gross_amount + curr.gross_amount,
      platform_fees: acc.platform_fees + curr.platform_fees,
      net_amount: acc.net_amount + curr.net_amount,
      transaction_count: acc.transaction_count + curr.transaction_count,
    }), { gross_amount: 0, platform_fees: 0, net_amount: 0, transaction_count: 0 });

    // Generate tax report data
    const taxReport = {
      creator_info: {
        name: user.email, // You might want to get this from user profile
        creator_id: creator_id,
        stripe_account_id: creatorProfile.stripe_account_id,
      },
      report_period: {
        year: year,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
      },
      earnings_summary: {
        total_gross_income: overallTotals.gross_amount,
        total_platform_fees: overallTotals.platform_fees,
        total_net_income: overallTotals.net_amount,
        total_transactions: overallTotals.transaction_count,
      },
      earnings_by_source: totals,
      tax_information: {
        requires_1099: overallTotals.net_amount >= 600, // IRS threshold
        estimated_tax_rate: 0.30, // Estimated self-employment tax rate
        estimated_tax_owed: overallTotals.net_amount * 0.30,
      },
      detailed_transactions: earnings,
      generated_at: new Date().toISOString(),
    };

    logStep("Tax report generated", { 
      totalIncome: overallTotals.net_amount,
      transactionCount: overallTotals.transaction_count 
    });

    // Store the tax report for record keeping
    const { error: insertError } = await supabase
      .from("creator_earnings")
      .update({
        tax_document_id: `tax_report_${year}_${Date.now()}`,
      })
      .eq("creator_id", creator_id)
      .gte("transaction_date", startDate.toISOString())
      .lte("transaction_date", endDate.toISOString())
      .eq("status", "paid");

    if (insertError) console.warn("Could not update tax document IDs:", insertError);

    return new Response(
      JSON.stringify({
        success: true,
        report: taxReport,
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
