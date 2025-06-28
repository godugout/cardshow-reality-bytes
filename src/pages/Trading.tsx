
import { Suspense } from 'react';
import Navigation from '@/components/layout/Navigation';
import TradesList from '@/components/trading/TradesList';
import { Skeleton } from '@/components/ui/skeleton';

const Trading = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container-xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-display-lg text-foreground mb-2">Trading Hub</h1>
          <p className="text-body-lg text-muted-foreground">
            Connect with other collectors and make trades to complete your collection
          </p>
        </div>

        <Suspense fallback={
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        }>
          <TradesList />
        </Suspense>
      </div>
    </div>
  );
};

export default Trading;
