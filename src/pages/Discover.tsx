
import { useState, Suspense } from 'react';
import Header from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Target, TrendingUp, Clock, Flame } from 'lucide-react';
import CardRecommendations from '@/components/discovery/CardRecommendations';
import TrendingCards from '@/components/discovery/TrendingCards';
import PersonalizedFeed from '@/components/discovery/PersonalizedFeed';
import DiscoveryStats from '@/components/discovery/DiscoveryStats';
import { DiscoveryErrorBoundary } from '@/components/discovery/DiscoveryErrorBoundary';

const LoadingSpinner = ({ message }: { message: string }) => (
  <div className="flex items-center justify-center py-12">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00C851] mx-auto mb-4"></div>
      <p className="text-gray-400">{message}</p>
    </div>
  </div>
);

const Discover = () => {
  const [activeTab, setActiveTab] = useState('recommendations');

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-[#00C851]" />
            Discover Cards
          </h1>
          <p className="text-gray-400 text-lg">
            Find your next favorite cards with AI-powered recommendations
          </p>
        </div>

        {/* Discovery Stats */}
        <DiscoveryErrorBoundary componentName="Discovery Stats" fallback={
          <div className="bg-gray-800 rounded-lg h-32 mb-6 animate-pulse" />
        }>
          <Suspense fallback={<div className="bg-gray-800 rounded-lg h-32 mb-6 animate-pulse" />}>
            <DiscoveryStats />
          </Suspense>
        </DiscoveryErrorBoundary>

        {/* Main Discovery Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-900">
            <TabsTrigger value="recommendations" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              For You
            </TabsTrigger>
            <TabsTrigger value="trending" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Trending
            </TabsTrigger>
            <TabsTrigger value="new" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              New Releases
            </TabsTrigger>
            <TabsTrigger value="hot" className="flex items-center gap-2">
              <Flame className="w-4 h-4" />
              Hot Picks
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recommendations" className="space-y-6">
            <DiscoveryErrorBoundary componentName="Recommendations">
              <Suspense fallback={<LoadingSpinner message="Loading recommendations..." />}>
                <CardRecommendations />
              </Suspense>
            </DiscoveryErrorBoundary>
          </TabsContent>

          <TabsContent value="trending" className="space-y-6">
            <DiscoveryErrorBoundary componentName="Trending Cards">
              <Suspense fallback={<LoadingSpinner message="Loading trending cards..." />}>
                <TrendingCards />
              </Suspense>
            </DiscoveryErrorBoundary>
          </TabsContent>

          <TabsContent value="new" className="space-y-6">
            <DiscoveryErrorBoundary componentName="New Releases">
              <Suspense fallback={<LoadingSpinner message="Loading new releases..." />}>
                <PersonalizedFeed filter="new" />
              </Suspense>
            </DiscoveryErrorBoundary>
          </TabsContent>

          <TabsContent value="hot" className="space-y-6">
            <DiscoveryErrorBoundary componentName="Hot Picks">
              <Suspense fallback={<LoadingSpinner message="Loading hot picks..." />}>
                <PersonalizedFeed filter="hot" />
              </Suspense>
            </DiscoveryErrorBoundary>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Discover;
