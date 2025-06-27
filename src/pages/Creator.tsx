
import { Suspense } from 'react';
import Header from '@/components/Header';
import { CreatorDashboard } from '@/components/creator/CreatorDashboard';
import { Skeleton } from '@/components/ui/skeleton';

const Creator = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 font-display">Creator Studio</h1>
          <p className="text-muted-foreground">
            Design, create, and monetize your digital trading cards
          </p>
        </div>

        <Suspense fallback={
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
            <Skeleton className="h-96 w-full" />
          </div>
        }>
          <CreatorDashboard />
        </Suspense>
      </div>
    </div>
  );
};

export default Creator;
