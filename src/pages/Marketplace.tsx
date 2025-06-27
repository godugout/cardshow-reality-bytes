
import { Suspense } from 'react';
import Header from '@/components/Header';
import MarketplaceHub from '@/components/marketplace/MarketplaceHub';
import { Skeleton } from '@/components/ui/skeleton';

const Marketplace = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 font-display">
            Digital Card Marketplace
          </h1>
          <p className="text-muted-foreground text-lg">
            Discover, analyze, and collect premium digital trading cards
          </p>
        </div>

        <Suspense fallback={<MarketplaceSkeleton />}>
          <MarketplaceHub />
        </Suspense>
      </div>
    </div>
  );
};

const MarketplaceSkeleton = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-96 w-full" />
      ))}
    </div>
  </div>
);

export default Marketplace;
