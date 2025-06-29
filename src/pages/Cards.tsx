
import { Suspense } from 'react';
import Header from '@/components/Header';
import CardGrid from '@/components/cards/CardGrid';
import CardShowcase from '@/components/cards/CardShowcase';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useCards } from '@/hooks/useCards';
import PageErrorBoundary from '@/components/error-boundaries/PageErrorBoundary';
import { Sparkles } from 'lucide-react';

const Cards = () => {
  const { cards, isLoading } = useCards();

  return (
    <PageErrorBoundary pageName="Cards">
      <div className="min-h-screen bg-background">
        {/* Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-primary/3 rounded-full blur-3xl" />
        </div>
        
        <Header />
        
        <div className="crd-container py-20 relative">
          <div className="text-center max-w-6xl mx-auto mb-16">
            {/* Announcement Badge */}
            <Badge className="mb-8 bg-primary/20 text-primary border-primary/30 hover:bg-primary/30 text-lg px-6 py-3">
              <Sparkles className="w-5 h-5 mr-2" />
              Premium Collection
            </Badge>

            {/* Enhanced Header */}
            <h1 className="crd-heading-1 mb-8 text-center">
              <span className="text-foreground">
                Digital Trading
              </span>
              <br />
              <span className="crd-text-gradient">
                Cards Collection
              </span>
            </h1>
            
            <p className="crd-body-large max-w-4xl mx-auto">
              Discover, collect, and trade digital cards from creators around the world. 
              Experience stunning visualization and real-time trading.
            </p>
          </div>

          <PageErrorBoundary pageName="Card Showcase">
            <Suspense fallback={
              <div className="crd-grid-cards mb-16">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="crd-card animate-pulse aspect-[3/4]">
                    <Skeleton className="h-full w-full rounded-xl" />
                  </div>
                ))}
              </div>
            }>
              {!isLoading && cards.length > 0 && <CardShowcase cards={cards} />}
            </Suspense>
          </PageErrorBoundary>

          <PageErrorBoundary pageName="Card Grid">
            <Suspense fallback={
              <div className="crd-grid-cards">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className="crd-card animate-pulse aspect-[3/4]">
                    <Skeleton className="h-full w-full rounded-xl" />
                  </div>
                ))}
              </div>
            }>
              <CardGrid />
            </Suspense>
          </PageErrorBoundary>
        </div>
      </div>
    </PageErrorBoundary>
  );
};

export default Cards;
