
import { Suspense } from 'react';
import Header from '@/components/Header';
import Collection3DGallery from '@/components/gallery/Collection3DGallery';
import { Skeleton } from '@/components/ui/skeleton';

const Gallery = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 font-display">3D Gallery</h1>
          <p className="text-muted-foreground">
            Experience your card collection in immersive 3D environments
          </p>
        </div>

        <Suspense fallback={
          <div className="space-y-6">
            <Skeleton className="h-96 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          </div>
        }>
          <Collection3DGallery />
        </Suspense>
      </div>
    </div>
  );
};

export default Gallery;
