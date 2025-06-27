
import { Suspense } from 'react';
import Header from '@/components/Header';
import MarketplaceGrid from '@/components/marketplace/MarketplaceGrid';
import { Skeleton } from '@/components/ui/skeleton';

const Marketplace = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 font-display">Marketplace</h1>
          <p className="text-muted-foreground">
            Buy, sell, and discover rare cards from the Cardshow community
          </p>
        </div>

        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-96 w-full" />
            ))}
          </div>
        }>
          <MarketplaceGrid />
        </Suspense>
      </div>
    </div>
  );
};

export default Marketplace;
