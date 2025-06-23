
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DollarSign, CreditCard, TrendingUp, Users, Eye, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const CreatorDashboard = () => {
  const { user } = useAuth();

  const { data: creatorProfile } = useQuery({
    queryKey: ["creator-profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("creator_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      
      if (error && error.code !== "PGRST116") throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: earnings } = useQuery({
    queryKey: ["creator-earnings", creatorProfile?.id],
    queryFn: async () => {
      if (!creatorProfile?.id) return null;
      const { data, error } = await supabase
        .from("creator_earnings")
        .select("*")
        .eq("creator_id", creatorProfile.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!creatorProfile?.id,
  });

  const { data: templates } = useQuery({
    queryKey: ["creator-templates", creatorProfile?.id],
    queryFn: async () => {
      if (!creatorProfile?.id) return null;
      const { data, error } = await supabase
        .from("card_templates_creator")
        .select("*")
        .eq("creator_id", creatorProfile.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!creatorProfile?.id,
  });

  if (!creatorProfile) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Welcome to Creator Studio</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 mb-4">
            Create your creator profile to start monetizing your designs.
          </p>
          <Badge variant="outline" className="border-yellow-500 text-yellow-500">
            Setup Required
          </Badge>
        </CardContent>
      </Card>
    );
  }

  const totalEarnings = earnings?.reduce((sum, earning) => sum + Number(earning.net_amount), 0) || 0;
  const pendingEarnings = earnings?.filter(e => e.status === "pending")
    .reduce((sum, earning) => sum + Number(earning.net_amount), 0) || 0;
  const totalSales = templates?.reduce((sum, template) => sum + template.sales_count, 0) || 0;
  const avgRating = templates?.length 
    ? templates.reduce((sum, template) => sum + Number(template.rating), 0) / templates.length 
    : 0;

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            Creator Status
            <Badge 
              variant={creatorProfile.verification_status === "verified" ? "default" : "secondary"}
              className={
                creatorProfile.verification_status === "verified" 
                  ? "bg-green-600 text-white" 
                  : "bg-yellow-600 text-white"
              }
            >
              {creatorProfile.verification_status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Stripe Account</p>
              <p className="text-white font-medium">
                {creatorProfile.stripe_account_id ? "Connected" : "Not Connected"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Payout Status</p>
              <p className="text-white font-medium">
                {creatorProfile.payout_enabled ? "Enabled" : "Disabled"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total Earnings
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              ${totalEarnings.toFixed(2)}
            </div>
            <p className="text-xs text-gray-400">
              ${pendingEarnings.toFixed(2)} pending
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Cards Created
            </CardTitle>
            <CreditCard className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {creatorProfile.cards_created}
            </div>
            <p className="text-xs text-gray-400">
              {templates?.length || 0} templates
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total Sales
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {totalSales}
            </div>
            <p className="text-xs text-gray-400">
              All time sales
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Avg Rating
            </CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {avgRating.toFixed(1)}
            </div>
            <div className="flex items-center mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3 w-3 ${
                    star <= avgRating ? "text-yellow-500 fill-yellow-500" : "text-gray-600"
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Recent Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {earnings?.slice(0, 5).map((earning) => (
                <div key={earning.id} className="flex justify-between items-center">
                  <div>
                    <p className="text-white font-medium">{earning.source_type}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(earning.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">
                      ${Number(earning.net_amount).toFixed(2)}
                    </p>
                    <Badge 
                      variant="outline" 
                      className={
                        earning.status === "paid" 
                          ? "border-green-500 text-green-500" 
                          : "border-yellow-500 text-yellow-500"
                      }
                    >
                      {earning.status}
                    </Badge>
                  </div>
                </div>
              ))}
              {!earnings?.length && (
                <p className="text-gray-400">No earnings yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Popular Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {templates?.slice(0, 5).map((template) => (
                <div key={template.id} className="flex justify-between items-center">
                  <div>
                    <p className="text-white font-medium">{template.name}</p>
                    <p className="text-sm text-gray-400">{template.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">
                      {template.sales_count} sales
                    </p>
                    <p className="text-sm text-gray-400">
                      ${template.price}
                    </p>
                  </div>
                </div>
              ))}
              {!templates?.length && (
                <p className="text-gray-400">No templates created yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
