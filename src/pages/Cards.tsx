
import { Suspense } from 'react';
import Header from '@/components/Header';
import CardGrid from '@/components/cards/CardGrid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Cards = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Card Marketplace</h1>
          <p className="text-gray-400">
            Discover, collect, and trade premium digital trading cards
          </p>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-gray-900 border-gray-800">
            <TabsTrigger value="all" className="data-[state=active]:bg-[#00C851]">
              All Cards
            </TabsTrigger>
            <TabsTrigger value="new" className="data-[state=active]:bg-[#00C851]">
              New Releases
            </TabsTrigger>
            <TabsTrigger value="trending" className="data-[state=active]:bg-[#00C851]">
              Trending
            </TabsTrigger>
            <TabsTrigger value="favorites" className="data-[state=active]:bg-[#00C851]">
              My Favorites
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Suspense fallback={<div className="text-center py-8 text-gray-400">Loading cards...</div>}>
              <CardGrid />
            </Suspense>
          </TabsContent>

          <TabsContent value="new">
            <div className="text-center py-8 text-gray-400">
              New releases coming soon...
            </div>
          </TabsContent>

          <TabsContent value="trending">
            <div className="text-center py-8 text-gray-400">
              Trending cards coming soon...
            </div>
          </TabsContent>

          <TabsContent value="favorites">
            <div className="text-center py-8 text-gray-400">
              Your favorites will appear here...
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Cards;
