
import { Suspense } from 'react';
import Header from '@/components/Header';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Eye, Sparkles } from 'lucide-react';

// Simple 3D Gallery component that doesn't use problematic hooks outside Canvas
const Gallery3DDisplay = () => {
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-8 min-h-96 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-primary/20 rounded-2xl flex items-center justify-center">
          <Eye className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold">3D Gallery Experience</h3>
        <p className="text-muted-foreground">
          Interactive 3D card viewing coming soon
        </p>
      </div>
    </div>
  );
};

const Gallery = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#00C851]/10 via-transparent to-[#00A543]/5" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      <Header />
      
      {/* Full width container for desktop gallery */}
      <div className="w-full px-4 py-8 relative">
        <div className="text-center max-w-6xl mx-auto mb-16">
          {/* Announcement Badge */}
          <Badge className="mb-8 bg-[#00C851]/20 text-[#00C851] border-[#00C851]/30 hover:bg-[#00C851]/30 text-lg px-6 py-3">
            <Eye className="w-5 h-5 mr-2" />
            3D Experience
          </Badge>

          {/* Enhanced Header for desktop */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight font-display">
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              3D Card
            </span>
            <br />
            <span className="bg-gradient-to-r from-[#00C851] to-[#00A543] bg-clip-text text-transparent">
              Gallery
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Experience your card collection in immersive 3D environments. 
            Rotate, zoom, and explore every detail with stunning visual effects.
          </p>
        </div>

        <Suspense fallback={<GallerySkeleton />}>
          <div className="max-w-7xl mx-auto">
            <Gallery3DDisplay />
            
            {/* Enhanced desktop grid for featured cards */}
            <div className="mt-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Featured Cards</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-6">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-4 hover:border-[#00C851]/50 transition-all duration-300 aspect-[3/4] flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 mx-auto bg-primary/20 rounded-lg flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-primary" />
                      </div>
                      <p className="text-sm text-muted-foreground">Card {i + 1}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Suspense>
      </div>
    </div>
  );
};

const GallerySkeleton = () => (
  <div className="space-y-8">
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-8 animate-pulse min-h-96">
      <Skeleton className="h-full w-full rounded-2xl" />
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-6">
      {Array.from({ length: 16 }).map((_, i) => (
        <div key={i} className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-4 animate-pulse aspect-[3/4]">
          <Skeleton className="h-full w-full rounded-xl" />
        </div>
      ))}
    </div>
  </div>
);

export default Gallery;
