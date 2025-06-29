
import { Suspense } from 'react';
import Header from '@/components/Header';
import CollectionGrid from '@/components/collections/CollectionGrid';
import { Skeleton } from '@/components/ui/skeleton';
import { ContextualBadge } from '@/components/ui/contextual-badge';
import { useCollections } from '@/hooks/useCollections';
import PageErrorBoundary from '@/components/error-boundaries/PageErrorBoundary';
import { FolderOpen } from 'lucide-react';

const Collections = () => {
  const { collections, isLoading } = useCollections();

  return (
    <PageErrorBoundary pageName="Collections">
      <div className="min-h-screen bg-background font-primary">
        {/* Background Effects with collections green theme */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-collections/5 rounded-full blur-3xl" />
          <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-collections/3 rounded-full blur-3xl" />
        </div>
        
        <Header />
        
        <div className="max-w-7xl mx-auto py-20 px-8 relative">
          <div className="text-center max-w-6xl mx-auto mb-16">
            {/* Collections-themed badge */}
            <ContextualBadge 
              context="collections" 
              variant="secondary" 
              className="mb-8 text-lg px-6 py-3"
            >
              <FolderOpen className="w-5 h-5 mr-2" />
              Curated Collections
            </ContextualBadge>

            {/* Enhanced Header with collections green theme */}
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
            <Suspense fallback={
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
            }>
              <CollectionGrid />
            </Suspense>
          </PageErrorBoundary>
        </div>
      </div>
    </PageErrorBoundary>
  );
};

export default Collections;
