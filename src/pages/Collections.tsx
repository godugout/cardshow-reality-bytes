
import { Suspense } from 'react';
import Header from '@/components/Header';
import CollectionGrid from '@/components/collections/CollectionGrid';
import { Skeleton } from '@/components/ui/skeleton';

const Collections = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-10 w-32" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
