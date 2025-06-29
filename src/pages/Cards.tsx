
import { Suspense } from 'react';
import Header from '@/components/Header';
import CardGrid from '@/components/cards/CardGrid';
import CardShowcase from '@/components/cards/CardShowcase';
import { Skeleton } from '@/components/ui/skeleton';
import { ContextualBadge } from '@/components/ui/contextual-badge';
import { useCards } from '@/hooks/useCards';
import PageErrorBoundary from '@/components/error-boundaries/PageErrorBoundary';
import { Sparkles } from 'lucide-react';

const Cards = () => {
  const { cards, isLoading } = useCards();

  return (
    <PageErrorBoundary pageName="Cards">
      <div className="min-h-screen bg-background font-primary">
        {/* Background Effects with cards orange theme */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cards/5 rounded-full blur-3xl" />
          <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-cards/3 rounded-full blur-3xl" />
        </div>
        
        <Header />
        
        <div className="max-w-7xl mx-auto py-20 px-8 relative">
          <div className="text-center max-w-6xl mx-auto mb-16">
            {/* Cards-themed badge */}
            <ContextualBadge 
              context="cards" 
              variant="secondary" 
              className="mb-8 text-lg px-6 py-3"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Premium Collection
            </ContextualBadge>

            {/* Enhanced Header with cards orange theme */}
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold mb-8 leading-tight text-center">
              <span className="text-foreground">
                Digital Trading
              </span>
              <br />
              <span className="text-cards">
                Cards Collection
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Discover, collect, and trade digital cards from creators around the world. 
              Experience stunning visualization and real-time trading.
            </p>
          </div>

          <PageErrorBoundary pageName="Card Showcase">
            <Suspense fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-card rounded-lg animate-pulse aspect-[3/4] shadow-card">
                    <Skeleton className="h-full w-full rounded-lg" />
                  </div>
                ))}
              </div>
            }>
              {!isLoading && cards.length > 0 && <CardShowcase cards={cards} />}
            </Suspense>
          </PageErrorBoundary>

          <PageErrorBoundary pageName="Card Grid">
            <Suspense fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className="bg-card rounded-lg animate-pulse aspect-[3/4] shadow-card">
                    <Skeleton className="h-full w-full rounded-lg" />
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
