
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { CreatorDashboard } from "@/components/creator/CreatorDashboard";
import { CardDesigner } from "@/components/creator/CardDesigner";
import { TemplateMarketplace } from "@/components/creator/TemplateMarketplace";
import { RevenueAnalytics } from "@/components/creator/RevenueAnalytics";
import { CreatorProfile } from "@/components/creator/CreatorProfile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCreateStripeAccount } from "@/hooks/useStripePayments";
import { Loader2, Plus, DollarSign, Palette, Store, BarChart3, User } from "lucide-react";

const Creator = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const createStripeAccount = useCreateStripeAccount();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">Please sign in to access the Creator Studio.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSetupStripeAccount = () => {
    createStripeAccount.mutate({ 
      business_type: "individual",
      country: "US" 
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Creator Studio</h1>
          <p className="text-gray-400">
            Design, publish, and monetize your digital trading cards
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-6 bg-gray-800 border-gray-700">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 size={16} />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="designer" className="flex items-center gap-2">
              <Palette size={16} />
              Designer
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Store size={16} />
              Templates
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <DollarSign size={16} />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User size={16} />
              Profile
            </TabsTrigger>
            <TabsTrigger value="setup" className="flex items-center gap-2">
              <Plus size={16} />
              Setup
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <CreatorDashboard />
          </TabsContent>

          <TabsContent value="designer">
            <CardDesigner />
          </TabsContent>

          <TabsContent value="templates">
            <TemplateMarketplace />
          </TabsContent>

          <TabsContent value="analytics">
            <RevenueAnalytics />
          </TabsContent>

          <TabsContent value="profile">
            <CreatorProfile />
          </TabsContent>

          <TabsContent value="setup">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Creator Account Setup</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-400">
                  Set up your Stripe Connect account to receive payments for your creations.
                </p>
                <Button 
                  onClick={handleSetupStripeAccount}
                  disabled={createStripeAccount.isPending}
                  className="w-full"
                >
                  {createStripeAccount.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Setup Payment Account
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Creator;
