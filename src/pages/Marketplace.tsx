
import { Suspense } from 'react';
import Header from '@/components/Header';
import MarketplaceHub from '@/components/marketplace/MarketplaceHub';
import { Skeleton } from '@/components/ui/skeleton';
import { ContextualBadge } from '@/components/ui/contextual-badge';
import { TrendingUp } from 'lucide-react';

const Marketplace = () => {
  return (
    <div className="min-h-screen bg-background font-primary">
      {/* Marketplace-themed background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-marketplace/5 rounded-full blur-3xl" />
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-marketplace/3 rounded-full blur-3xl" />
      </div>

      <Header />
      
      <div className="relative">
        <div className="max-w-7xl mx-auto p-8">
          <div className="text-center max-w-4xl mx-auto mb-16">
            {/* Marketplace-themed badge */}
            <ContextualBadge 
              context="marketplace" 
              variant="secondary" 
              className="mb-8 text-lg px-6 py-3"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Live Trading
            </ContextualBadge>

            {/* Enhanced header with proper typography */}
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold mb-8 leading-tight text-foreground">
              Digital Card
              <br />
              <span className="text-marketplace">Marketplace</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium">
              Discover, analyze, and collect premium digital trading cards. 
              Experience real-time trading with secure transactions and instant settlements.
            </p>
          </div>
        </div>

        <Suspense fallback={<MarketplaceSkeleton />}>
          <MarketplaceHub />
        </Suspense>
      </div>
    </div>
  );
};

const MarketplaceSkeleton = () => (
  <div className="max-w-7xl mx-auto p-8">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-card rounded-3xl p-8 animate-pulse shadow-card">
          <Skeleton className="h-16 w-full rounded-2xl bg-muted" />
        </div>
      ))}
    </div>
    
    <div className="space-y-8">
      <div className="bg-card rounded-3xl p-6 animate-pulse shadow-card">
        <Skeleton className="h-12 w-full rounded-2xl bg-muted" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-card rounded-3xl p-8 animate-pulse shadow-card">
            <Skeleton className="h-64 w-full mb-6 rounded-2xl bg-muted" />
            <Skeleton className="h-6 w-3/4 mb-3 rounded-md bg-muted" />
            <Skeleton className="h-8 w-1/2 rounded-md bg-muted" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Marketplace;
