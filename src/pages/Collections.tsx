
import { Suspense } from 'react';
import Header from '@/components/Header';
import CollectionGrid from '@/components/collections/CollectionGrid';
import { Skeleton } from '@/components/ui/skeleton';

const Collections = () => {
  return (
    <div className="min-h-screen bg-primary">
      <Header />
      <main id="main-content" className="container section">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">Collections</h1>
          <p className="text-lg text-secondary">
            Discover and explore amazing card collections from creators around the world
          </p>
        </div>
        
        <Suspense fallback={
          <div className="space-y-6" aria-label="Loading collections">
            <div className="grid grid--4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-64 w-full" />
              ))}
            </div>
          </div>
        }>
          <CollectionGrid />
        </Suspense>
      </main>
    </div>
  );
};

export default Collections;
