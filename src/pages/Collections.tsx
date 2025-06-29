
import { Suspense } from 'react';
import Header from '@/components/Header';
import CollectionGrid from '@/components/collections/CollectionGrid';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { FolderOpen, Star, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Collections = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#00C851]/10 via-transparent to-[#00A543]/5" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      <Header />
      
      {/* Full width container for desktop */}
      <div className="w-full px-4 py-8 relative">
        <div className="text-center max-w-6xl mx-auto mb-16">
          {/* Announcement Badge */}
          <Badge className="mb-8 bg-[#00C851]/20 text-[#00C851] border-[#00C851]/30 hover:bg-[#00C851]/30 text-lg px-6 py-3">
            <Star className="w-5 h-5 mr-2" />
            Curated Collections
          </Badge>

          {/* Enhanced Header for desktop */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight font-display">
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              Card
            </span>
            <br />
            <span className="bg-gradient-to-r from-[#00C851] to-[#00A543] bg-clip-text text-transparent">
              Collections
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-secondary-bright max-w-4xl mx-auto leading-relaxed mb-8">
            Organize your cards into beautiful collections and showcase your favorites. 
            Create themed galleries and share your most prized digital assets.
          </p>
          
          {/* Desktop-specific action button */}
          <Button className="modern-button btn-text-bright">
            <Plus className="w-6 h-6 mr-2" />
            Create New Collection
          </Button>
        </div>

        <Suspense fallback={<CollectionsSkeleton />}>
          <div className="max-w-7xl mx-auto">
            <CollectionGrid />
          </div>
        </Suspense>
      </div>
    </div>
  );
};

const CollectionsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-8">
    {Array.from({ length: 12 }).map((_, i) => (
      <div key={i} className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-6 hover:border-[#00C851]/50 transition-all duration-300 animate-pulse">
        <Skeleton className="h-48 w-full mb-4 rounded-2xl" />
        <Skeleton className="h-6 w-3/4 mb-2 rounded-xl" />
        <Skeleton className="h-4 w-1/2 rounded-xl" />
      </div>
    ))}
  </div>
);

export default Collections;
