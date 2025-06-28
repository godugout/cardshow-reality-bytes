
import { Suspense } from 'react';
import Header from '@/components/Header';
import CardGrid from '@/components/cards/CardGrid';
import CardShowcase from '@/components/cards/CardShowcase';
import MobileCards from './MobileCards';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCards } from '@/hooks/useCards';
import PageErrorBoundary from '@/components/error-boundaries/PageErrorBoundary';
import { Sparkles, Zap } from 'lucide-react';

const Cards = () => {
  const isMobile = useIsMobile();
  const { cards, isLoading } = useCards();

  // Show mobile-optimized experience on mobile devices
  if (isMobile) {
    return (
      <PageErrorBoundary pageName="Mobile Cards">
        <MobileCards />
      </PageErrorBoundary>
    );
  }

  // Desktop experience with enhanced styling
  return (
    <PageErrorBoundary pageName="Cards">
      <div className="min-h-screen bg-background">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#00C851]/10 via-transparent to-[#00A543]/5" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />

        <Header />
        <div className="container mx-auto px-4 py-8 relative">
          <div className="text-center max-w-4xl mx-auto mb-12">
            {/* Announcement Badge */}
            <Badge className="mb-6 bg-[#00C851]/20 text-[#00C851] border-[#00C851]/30 hover:bg-[#00C851]/30">
              <Sparkles className="w-3 h-3 mr-1" />
              Premium Collection
            </Badge>

            {/* Enhanced Header */}
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight font-display">
              <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                Digital Trading
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#00C851] to-[#00A543] bg-clip-text text-transparent">
                Cards Collection
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Discover, collect, and trade digital cards from creators around the world. 
              Experience stunning 3D visualization and real-time trading.
            </p>
          </div>

          <PageErrorBoundary pageName="Card Showcase">
            <Suspense fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 justify-items-center mb-12">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 animate-pulse w-80 h-96">
                    <Skeleton className="h-56 w-full mb-4 rounded-xl" />
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                ))}
              </div>
            }>
              {!isLoading && cards.length > 0 && <CardShowcase cards={cards} />}
            </Suspense>
          </PageErrorBoundary>

          <PageErrorBoundary pageName="Card Grid">
            <Suspense fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 animate-pulse">
                    <Skeleton className="h-64 w-full mb-4 rounded-xl" />
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2" />
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
