
import { useState } from 'react';
import { Suspense } from 'react';
import Header from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Sparkles, Target, Users, Clock, Flame } from 'lucide-react';
import CardRecommendations from '@/components/discovery/CardRecommendations';
import TrendingCards from '@/components/discovery/TrendingCards';
import PersonalizedFeed from '@/components/discovery/PersonalizedFeed';
import SmartFilters from '@/components/discovery/SmartFilters';
import DiscoveryStats from '@/components/discovery/DiscoveryStats';

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
        <Suspense fallback={<div className="animate-pulse bg-gray-800 rounded-lg h-32 mb-6" />}>
          <DiscoveryStats />
        </Suspense>

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
            <Suspense fallback={<div className="text-center py-8 text-gray-400">Loading recommendations...</div>}>
              <CardRecommendations />
            </Suspense>
          </TabsContent>

          <TabsContent value="trending" className="space-y-6">
            <Suspense fallback={<div className="text-center py-8 text-gray-400">Loading trending cards...</div>}>
              <TrendingCards />
            </Suspense>
          </TabsContent>

          <TabsContent value="new" className="space-y-6">
            <Suspense fallback={<div className="text-center py-8 text-gray-400">Loading new releases...</div>}>
              <PersonalizedFeed filter="new" />
            </Suspense>
          </TabsContent>

          <TabsContent value="hot" className="space-y-6">
            <Suspense fallback={<div className="text-center py-8 text-gray-400">Loading hot picks...</div>}>
              <PersonalizedFeed filter="hot" />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Discover;
