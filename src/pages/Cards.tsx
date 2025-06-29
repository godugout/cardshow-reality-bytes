
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
      <div className="min-h-screen bg-slate-900">
        {/* Reduced opacity background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#00C851]/5 via-transparent to-[#00A543]/3" />
        
        {/* Grid pattern overlay with reduced opacity */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />

        <Header />
        
        {/* Full width container for desktop */}
        <div className="w-full px-4 py-8 relative">
          <div className="text-center max-w-6xl mx-auto mb-16">
            {/* Announcement Badge */}
            <Badge className="mb-8 bg-[#00C851]/20 text-[#00C851] border-[#00C851]/30 hover:bg-[#00C851]/30 text-lg px-6 py-3">
              <Sparkles className="w-5 h-5 mr-2" />
              Premium Collection
            </Badge>

            {/* Enhanced Header for desktop */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight font-display">
              <span className="text-white">
                Digital Trading
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#00C851] to-[#00A543] bg-clip-text text-transparent">
                Cards Collection
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-200 max-w-4xl mx-auto leading-relaxed">
              Discover, collect, and trade digital cards from creators around the world. 
              Experience stunning visualization and real-time trading.
            </p>
          </div>

          <PageErrorBoundary pageName="Card Showcase">
            <Suspense fallback={
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-6 justify-items-center mb-16">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 animate-pulse w-full aspect-[3/4]">
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-6">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-2xl p-4 animate-pulse aspect-[3/4]">
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
