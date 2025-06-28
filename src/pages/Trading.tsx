
import { Suspense } from 'react';
import Header from '@/components/Header';
import TradesList from '@/components/trading/TradesList';
import { Skeleton } from '@/components/ui/skeleton';

const Trading = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 font-display">Trading Hub</h1>
          <p className="text-muted-foreground">
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
