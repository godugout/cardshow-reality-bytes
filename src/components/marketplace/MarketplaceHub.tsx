
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Marketplace</h1>
        <p className="text-xl text-muted-foreground">Discover, trade, and collect amazing digital cards</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-center mb-8">
          <TabsList className="grid w-full max-w-2xl grid-cols-4 bg-card/50 backdrop-blur-xl border-0 rounded-3xl p-2 shadow-soft">
            <TabsTrigger 
              value="discover" 
              className="flex items-center gap-3 rounded-2xl data-[state=active]:bg-primary/20 data-[state=active]:text-primary transition-all duration-200"
            >
              <Search className="w-5 h-5" />
              <span className="hidden sm:inline font-bold">Discover</span>
            </TabsTrigger>
            <TabsTrigger 
              value="trending" 
              className="flex items-center gap-3 rounded-2xl data-[state=active]:bg-primary/20 data-[state=active]:text-primary transition-all duration-200"
            >
              <TrendingUp className="w-5 h-5" />
              <span className="hidden sm:inline font-bold">Trending</span>
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="flex items-center gap-3 rounded-2xl data-[state=active]:bg-primary/20 data-[state=active]:text-primary transition-all duration-200"
            >
              <BarChart3 className="w-5 h-5" />
              <span className="hidden sm:inline font-bold">Analytics</span>
            </TabsTrigger>
            <TabsTrigger 
              value="purchase" 
              className="flex items-center gap-3 rounded-2xl data-[state=active]:bg-primary/20 data-[state=active]:text-primary transition-all duration-200"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:inline font-bold">My Orders</span>
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
