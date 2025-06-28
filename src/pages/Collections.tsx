
import { Suspense } from 'react';
import Navigation from '@/components/layout/Navigation';
import CollectionGrid from '@/components/collections/CollectionGrid';
import { Skeleton } from '@/components/ui/skeleton';

const Collections = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container-xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-display-lg text-foreground mb-2">Collections</h1>
          <p className="text-body-lg text-muted-foreground">
            Organize your cards into beautiful collections and showcase your favorites
          </p>
        </div>

        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        }>
          <CollectionGrid />
        </Suspense>
      </div>
    </div>
  );
};

export default Collections;
