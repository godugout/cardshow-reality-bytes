
import { Suspense } from 'react';
import Header from '@/components/Header';
import MarketplaceHub from '@/components/marketplace/MarketplaceHub';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Zap } from 'lucide-react';

const Marketplace = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95">
      {/* Modern gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#00C851]/5 via-transparent to-[#00A543]/3" />
      
      {/* Subtle dot pattern */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.02) 1px, transparent 0)`,
        backgroundSize: '32px 32px'
      }} />

      <Header />
      <div className="relative">
        <div className="max-w-7xl mx-auto p-8">
          <div className="text-center max-w-4xl mx-auto mb-16">
            {/* Modern badge */}
            <Badge className="mb-8 bg-gradient-to-r from-[#00C851]/20 to-[#00A543]/10 text-[#00C851] border-0 backdrop-blur-sm">
              <TrendingUp className="w-4 h-4 mr-2" />
              Live Trading
            </Badge>

            {/* Enhanced header with modern typography */}
            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight font-display">
              <span className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                Digital Card
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#00C851] via-[#00C851] to-[#00A543] bg-clip-text text-transparent">
                Marketplace
              </span>
            </h1>
            
            <p className="text-xl text-gray-300/90 max-w-3xl mx-auto leading-relaxed font-medium">
              Discover, analyze, and collect premium digital trading cards. 
              Experience real-time trading with secure transactions and instant settlements.
            </p>
          </div>
        </div>

        <Suspense fallback={<MarketplaceSkeleton />}>
          <MarketplaceHub />
        </Suspense>
      </div>
    </div>
  );
};

const MarketplaceSkeleton = () => (
  <div className="max-w-7xl mx-auto p-8">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-card/50 backdrop-blur-xl border-0 rounded-3xl p-8 animate-pulse">
          <Skeleton className="h-16 w-full rounded-2xl bg-muted/20" />
        </div>
      ))}
    </div>
    
    <div className="space-y-8">
      <div className="bg-card/50 backdrop-blur-xl border-0 rounded-3xl p-6 animate-pulse">
        <Skeleton className="h-12 w-full rounded-2xl bg-muted/20" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-card/50 backdrop-blur-xl border-0 rounded-3xl p-8 animate-pulse">
            <Skeleton className="h-64 w-full mb-6 rounded-2xl bg-muted/20" />
            <Skeleton className="h-6 w-3/4 mb-3 rounded-xl bg-muted/20" />
            <Skeleton className="h-8 w-1/2 rounded-xl bg-muted/20" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Marketplace;
