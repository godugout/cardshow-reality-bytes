
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Search, ShoppingCart, BarChart3 } from 'lucide-react';
import DiscoverySection from './discovery/DiscoverySection';
import AnalyticsSection from './analytics/AnalyticsSection';
import PurchaseSection from './purchase/PurchaseSection';
import TrendingSection from './trending/TrendingSection';

const MarketplaceHub = () => {
  const [activeTab, setActiveTab] = useState('discover');

  return (
    <div className="max-w-7xl mx-auto p-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-center mb-8">
          <TabsList className="grid w-full max-w-2xl grid-cols-4 bg-card/50 backdrop-blur-xl border-0 rounded-3xl p-2 shadow-card">
            <TabsTrigger 
              value="discover" 
              className="flex items-center gap-3 rounded-2xl data-[state=active]:bg-marketplace/20 data-[state=active]:text-marketplace transition-all duration-200"
            >
              <Search className="w-5 h-5" />
              <span className="hidden sm:inline font-semibold">Discover</span>
            </TabsTrigger>
            <TabsTrigger 
              value="trending" 
              className="flex items-center gap-3 rounded-2xl data-[state=active]:bg-marketplace/20 data-[state=active]:text-marketplace transition-all duration-200"
            >
              <TrendingUp className="w-5 h-5" />
              <span className="hidden sm:inline font-semibold">Trending</span>
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="flex items-center gap-3 rounded-2xl data-[state=active]:bg-marketplace/20 data-[state=active]:text-marketplace transition-all duration-200"
            >
              <BarChart3 className="w-5 h-5" />
              <span className="hidden sm:inline font-semibold">Analytics</span>
            </TabsTrigger>
            <TabsTrigger 
              value="purchase" 
              className="flex items-center gap-3 rounded-2xl data-[state=active]:bg-marketplace/20 data-[state=active]:text-marketplace transition-all duration-200"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:inline font-semibold">My Orders</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="discover" className="space-y-8">
          <DiscoverySection />
        </TabsContent>

        <TabsContent value="trending" className="space-y-8">
          <TrendingSection />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-8">
          <AnalyticsSection />
        </TabsContent>

        <TabsContent value="purchase" className="space-y-8">
          <PurchaseSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketplaceHub;
