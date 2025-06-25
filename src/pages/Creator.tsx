
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
import CreatorOnboardingDashboard from '@/components/creator/onboarding/CreatorOnboardingDashboard';
import { useAuth } from '@/hooks/useAuth';

export default function Creator() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('onboarding');

  // Mock user progress - in real app, this would come from database
  const [userProgress] = useState({
    hasCreatedCards: false,
    hasEarnings: false,
    completedOnboarding: false,
    totalCards: 0,
    totalEarnings: 0
  });

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

  // Show onboarding for new creators
  const shouldShowOnboarding = !userProgress.completedOnboarding || 
    (!userProgress.hasCreatedCards && !userProgress.hasEarnings);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-9">
            <TabsTrigger value="onboarding">Get Started</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="designer">Designer</TabsTrigger>
            <TabsTrigger value="automation">Automation</TabsTrigger>
            <TabsTrigger value="assets">Assets</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
            <TabsTrigger value="marketplace">Templates</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="onboarding">
            <CreatorOnboardingDashboard />
          </TabsContent>

          <TabsContent value="dashboard">
            {shouldShowOnboarding ? (
              <div className="text-center py-12">
                <h2 className="text-xl font-bold text-white mb-4">
                  Complete your setup first! 🚀
                </h2>
                <p className="text-gray-400 mb-6">
                  Your dashboard will be more useful once you've created your first card and completed the onboarding process.
                </p>
                <button
                  onClick={() => setActiveTab('onboarding')}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
                >
                  Go to Get Started
                </button>
              </div>
            ) : (
              <CreatorDashboard />
            )}
          </TabsContent>

          <TabsContent value="designer">
            <CardDesigner />
          </TabsContent>

          <TabsContent value="automation">
            <AutomationDashboard />
          </TabsContent>

          <TabsContent value="assets">
            <DesignAssetsLibrary />
          </TabsContent>

          <TabsContent value="analytics">
            {shouldShowOnboarding ? (
              <div className="text-center py-12">
                <h2 className="text-xl font-bold text-white mb-4">
                  Analytics Coming Soon! 📊
                </h2>
                <p className="text-gray-400 mb-6">
                  Create some cards first, and we'll show you detailed analytics about their performance.
                </p>
                <button
                  onClick={() => setActiveTab('designer')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                >
                  Create Your First Card
                </button>
              </div>
            ) : (
              <AdvancedAnalytics />
            )}
          </TabsContent>

          <TabsContent value="community">
            <CreatorCommunityDashboard />
          </TabsContent>

          <TabsContent value="marketplace">
            <TemplateMarketplace />
          </TabsContent>

          <TabsContent value="profile">
            <CreatorProfile />
          </TabContent>
        </Tabs>
      </div>
    </div>
  );
}
