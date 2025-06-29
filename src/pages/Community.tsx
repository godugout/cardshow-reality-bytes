import { Suspense } from 'react';
import Header from '@/components/Header';
import IntegratedCommunityDashboard from '@/components/social/IntegratedCommunityDashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Users, MessageCircle } from 'lucide-react';

const Community = () => {
  return (
    <div className="min-h-screen">
      {/* Modern gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#111111] to-[#0F0F0F]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(0,200,81,0.08)_0%,transparent_50%)]" />
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,200,81,0.15) 1px, transparent 0)`,
        backgroundSize: '32px 32px'
      }} />

      <Header />
      
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto p-8">
          <div className="text-center max-w-4xl mx-auto mb-16">
            {/* Modern badge */}
            <Badge className="mb-8 bg-[#00C851]/20 text-[#00C851] border-0 backdrop-blur-sm px-6 py-2">
              <MessageCircle className="w-4 h-4 mr-2" />
              Active Community
            </Badge>

            {/* Enhanced header with modern typography */}
            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
              <span className="text-white">Creator</span>
              <br />
              <span className="gradient-text">Community</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Connect with creators and collectors worldwide. Share your work, 
              discover new talent, and build lasting relationships in our thriving community.
            </p>
          </div>
        </div>
        
        <Suspense fallback={<CommunitySkeleton />}>
          <IntegratedCommunityDashboard />
        </Suspense>
      </div>
    </div>
  );
};

const CommunitySkeleton = () => (
  <div className="max-w-7xl mx-auto p-8">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="glass-card rounded-3xl p-8 animate-pulse">
          <div className="h-16 w-full rounded-2xl bg-white/5" />
        </div>
      ))}
    </div>
    
    <div className="space-y-8">
      <div className="glass-card rounded-3xl p-6 animate-pulse">
        <div className="h-12 w-full rounded-2xl bg-white/5" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="glass-card rounded-3xl p-8 animate-pulse">
              <div className="h-32 w-full rounded-2xl bg-white/5" />
            </div>
          ))}
        </div>
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass-card rounded-3xl p-8 animate-pulse">
              <div className="h-24 w-full rounded-2xl bg-white/5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default Community;
