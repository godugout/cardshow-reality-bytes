
import { Suspense } from 'react';
import Header from '@/components/Header';
import CardGrid from '@/components/cards/CardGrid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Cards = () => {
  return (
    <div className="min-h-screen bg-primary">
      <Header />
      <div className="container section">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Card Marketplace</h1>
          <p className="text-secondary">
            Discover, collect, and trade premium digital trading cards
          </p>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-secondary border border-primary">
            <TabsTrigger value="all" className="data-[state=active]:bg-brand data-[state=active]:text-inverse">
              All Cards
            </TabsTrigger>
            <TabsTrigger value="new" className="data-[state=active]:bg-brand data-[state=active]:text-inverse">
              New Releases
            </TabsTrigger>
            <TabsTrigger value="trending" className="data-[state=active]:bg-brand data-[state=active]:text-inverse">
              Trending
            </TabsTrigger>
            <TabsTrigger value="favorites" className="data-[state=active]:bg-brand data-[state=active]:text-inverse">
              My Favorites
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Suspense fallback={<div className="text-center py-8 text-secondary">Loading cards...</div>}>
              <CardGrid />
            </Suspense>
          </TabsContent>

          <TabsContent value="new">
            <div className="text-center py-8 text-secondary">
              New releases coming soon...
            </div>
          </TabsContent>

          <TabsContent value="trending">
            <div className="text-center py-8 text-secondary">
              Trending cards coming soon...
            </div>
          </TabsContent>

          <TabsContent value="favorites">
            <div className="text-center py-8 text-secondary">
              Your favorites will appear here...
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Cards;
