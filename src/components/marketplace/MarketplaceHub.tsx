
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
        <TabsList className="grid w-full grid-cols-4 bg-card border">
          <TabsTrigger 
            value="discover" 
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Discover</span>
          </TabsTrigger>
          <TabsTrigger 
            value="trending" 
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <TrendingUp className="w-4 h-4" />
            <span className="hidden sm:inline">Trending</span>
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
          <TabsTrigger 
            value="purchase" 
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">My Orders</span>
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
