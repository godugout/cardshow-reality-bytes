
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ContextualBadge } from '@/components/ui/contextual-badge';
import { useCollections } from '@/hooks/useCollections';
import PageErrorBoundary from '@/components/error-boundaries/PageErrorBoundary';
import PageLayout from '@/components/layout/PageLayout';
import CollectionGrid from '@/components/collections/CollectionGrid';
import { FolderOpen, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Collections = () => {
  return (
    <PageErrorBoundary pageName="Collections">
      <PageLayout context="collections" showBackgroundEffects={true}>
        <div className="max-w-7xl mx-auto py-20 px-8 relative">
          <div className="text-center max-w-6xl mx-auto mb-16">
            <ContextualBadge 
              context="collections" 
              variant="secondary" 
              className="mb-8 text-lg px-6 py-3"
            >
              <FolderOpen className="w-5 h-5 mr-2" />
              Curated Collections
            </ContextualBadge>

            <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold mb-8 leading-tight text-center">
              <span className="text-foreground">
                Digital Card
              </span>
              <br />
              <span className="text-collections">
                Collections
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Explore curated collections from top creators and collectors. 
              Discover themed sets, limited editions, and exclusive drops.
            </p>
          </div>

          <PageErrorBoundary pageName="Collection Grid">
            <Suspense fallback={<CollectionsLoadingSkeleton />}>
              <CollectionsContent />
            </Suspense>
          </PageErrorBoundary>
        </div>
      </PageLayout>
    </PageErrorBoundary>
  );
};

const CollectionsContent = () => {
  const { collections, isLoading, error } = useCollections();

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load collections. Please refresh the page or try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return <CollectionsLoadingSkeleton />;
  }

  return <CollectionGrid />;
};

const CollectionsLoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {Array.from({ length: 12 }).map((_, i) => (
      <div key={i} className="bg-card rounded-lg animate-pulse shadow-card">
        <Skeleton className="h-48 w-full rounded-t-lg" />
        <div className="p-6 space-y-3">
          <Skeleton className="h-6 w-3/4 rounded" />
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-2/3 rounded" />
        </div>
      </div>
    ))}
  </div>
);

export default Collections;
