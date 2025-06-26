
import { useState } from 'react';
import Header from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreatorDashboard } from '@/components/creator/CreatorDashboard';
import { CardDesigner } from '@/components/creator/CardDesigner';
import { CreatorProfile } from '@/components/creator/CreatorProfile';
import { RevenueAnalytics } from '@/components/creator/RevenueAnalytics';
import { TemplateMarketplace } from '@/components/creator/TemplateMarketplace';
import CreatorCommunityDashboard from '@/components/creator-community/CreatorCommunityDashboard';
import { AutomationDashboard } from '@/components/advanced-creator/AutomationDashboard';
import { DesignAssetsLibrary } from '@/components/advanced-creator/DesignAssetsLibrary';
import { AdvancedAnalytics } from '@/components/advanced-creator/AdvancedAnalytics';
import CreatorPayoutDashboard from '@/components/creator/CreatorPayoutDashboard';
import { useAuth } from '@/hooks/useAuth';

export default function Creator() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-white">Creator Portal</h1>
            <p className="text-gray-400">Please sign in to access creator features.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-10">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="designer">Designer</TabsTrigger>
            <TabsTrigger value="payouts">Payouts</TabsTrigger>
            <TabsTrigger value="automation">Automation</TabsTrigger>
            <TabsTrigger value="assets">Assets</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
            <TabsTrigger value="marketplace">Templates</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <CreatorDashboard />
          </TabsContent>

          <TabsContent value="designer">
            <CardDesigner />
          </TabsContent>

          <TabsContent value="payouts">
            <CreatorPayoutDashboard />
          </TabsContent>

          <TabsContent value="automation">
            <AutomationDashboard />
          </TabsContent>

          <TabsContent value="assets">
            <DesignAssetsLibrary />
          </TabsContent>

          <TabsContent value="analytics">
            <AdvancedAnalytics />
          </TabsContent>

          <TabsContent value="community">
            <CreatorCommunityDashboard />
          </TabsContent>

          <TabsContent value="marketplace">
            <TemplateMarketplace />
          </TabsContent>

          <TabsContent value="revenue">
            <RevenueAnalytics />
          </TabsContent>

          <TabsContent value="profile">
            <CreatorProfile />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
