
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
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Creator() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('designer'); // Default to designer for new users

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-4 text-white">Welcome to Creator Portal</h1>
            <p className="text-gray-400 mb-8">
              Join our community of creators and start designing amazing digital trading cards.
            </p>
            <div className="space-y-4">
              <Link to="/auth">
                <Button size="lg" className="bg-[#00C851] hover:bg-[#00A543] text-white px-8 py-3">
                  Sign Up to Start Creating
                </Button>
              </Link>
              <p className="text-sm text-gray-500">
                Already have an account? <Link to="/auth" className="text-[#00C851] hover:underline">Sign in here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">Creator Portal</h1>
          <p className="text-gray-400">Design, manage, and monetize your digital trading cards</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-10">
            <TabsTrigger value="designer">Designer</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="payouts">Payouts</TabsTrigger>
            <TabsTrigger value="automation">Automation</TabsTrigger>
            <TabsTrigger value="assets">Assets</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
            <TabsTrigger value="marketplace">Templates</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="designer">
            <CardDesigner />
          </TabsContent>

          <TabsContent value="dashboard">
            <CreatorDashboard />
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
