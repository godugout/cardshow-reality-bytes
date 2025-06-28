
import { Suspense } from 'react';
import Navigation from '@/components/layout/Navigation';
import CardGrid from '@/components/cards/CardGrid';
import MobileCards from './MobileCards';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';
import PageErrorBoundary from '@/components/error-boundaries/PageErrorBoundary';

const Cards = () => {
  const isMobile = useIsMobile();

  // Show mobile-optimized experience on mobile devices
  if (isMobile) {
    return (
      <PageErrorBoundary pageName="Mobile Cards">
        <MobileCards />
      </PageErrorBoundary>
    );
  }

  // Desktop experience with new design system
  return (
    <PageErrorBoundary pageName="Cards">
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container-xl py-8">
          {/* Hero Section */}
          <div className="mb-12 text-center animate-fade-in">
            <h1 className="text-display-lg bg-gradient-to-r from-primary via-accent-purple-500 to-accent-pink-500 bg-clip-text text-transparent mb-4">
              Discover Amazing Cards
            </h1>
            <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
              Explore, collect, and trade digital cards from creators around the world. 
              Find rare gems and build your ultimate collection.
            </p>
          </div>

          <PageErrorBoundary pageName="Card Grid">
            <Suspense fallback={
              <div className="grid-cards stagger-children">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="trading-card">
                    <Skeleton className="w-full h-full rounded-2xl" />
                  </div>
                ))}
              </div>
            }>
              <CardGrid />
            </Suspense>
          </PageErrorBoundary>
        </main>
      </div>
    </PageErrorBoundary>
  );
};

export default Cards;
