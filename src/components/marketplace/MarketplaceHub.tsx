
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
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-card/50 backdrop-blur-xl border-0 rounded-3xl p-2">
          <TabsTrigger 
            value="discover" 
            className="flex items-center gap-2 rounded-2xl data-[state=active]:bg-primary/20 data-[state=active]:text-primary transition-all duration-200"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline font-semibold">Discover</span>
          </TabsTrigger>
          <TabsTrigger 
            value="trending" 
            className="flex items-center gap-2 rounded-2xl data-[state=active]:bg-primary/20 data-[state=active]:text-primary transition-all duration-200"
          >
            <TrendingUp className="w-4 h-4" />
            <span className="hidden sm:inline font-semibold">Trending</span>
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            className="flex items-center gap-2 rounded-2xl data-[state=active]:bg-primary/20 data-[state=active]:text-primary transition-all duration-200"
          >
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline font-semibold">Analytics</span>
          </TabsTrigger>
          <TabsTrigger 
            value="purchase" 
            className="flex items-center gap-2 rounded-2xl data-[state=active]:bg-primary/20 data-[state=active]:text-primary transition-all duration-200"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline font-semibold">My Orders</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="space-y-6">
          <DiscoverySection />
        </TabsContent>

        <TabsContent value="trending" className="space-y-6">
          <TrendingSection />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <AnalyticsSection />
        </TabsContent>

        <TabsContent value="purchase" className="space-y-6">
          <PurchaseSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketplaceHub;
