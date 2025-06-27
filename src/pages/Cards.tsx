
import { Suspense } from 'react';
import Header from '@/components/Header';
import CardGrid from '@/components/cards/CardGrid';
import MobileCards from './MobileCards';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';

const Cards = () => {
  const isMobile = useIsMobile();

  // Show mobile-optimized experience on mobile devices
  if (isMobile) {
    return <MobileCards />;
  }

  // Desktop experience
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 font-display">Trading Cards</h1>
          <p className="text-muted-foreground">
            Discover, collect, and trade digital cards from creators around the world
          </p>
        </div>

        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-80 w-full" />
            ))}
          </div>
        }>
          <CardGrid />
        </Suspense>
      </div>
    </div>
  );
};

export default Cards;
