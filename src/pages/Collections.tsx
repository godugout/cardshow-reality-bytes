
import { Suspense } from 'react';
import Header from '@/components/Header';
import CollectionGrid from '@/components/collections/CollectionGrid';
import { Skeleton } from '@/components/ui/skeleton';

const Collections = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="cdg-container py-8">
        <div className="mb-8">
          <h1 className="cdg-headline-1 mb-4">Collections</h1>
          <p className="cdg-body-1 text-muted-foreground">
            Discover and explore amazing card collections from creators around the world
          </p>
        </div>
        
        <Suspense fallback={
          <div className="space-y-6">
            <div className="cdg-grid cdg-grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-64 w-full" />
              ))}
            </div>
          </div>
        }>
          <CollectionGrid />
        </Suspense>
      </div>
    </div>
  );
};

export default Collections;
