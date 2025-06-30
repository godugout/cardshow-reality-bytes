import { Suspense } from 'react';
import Header from '@/components/Header';
import Collection3DGallery from '@/components/gallery/Collection3DGallery';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Eye, Sparkles } from 'lucide-react';

// Mock data for the gallery - in a real app this would come from props or API
const mockCollection = {
  id: '1',
  title: 'Featured Collection',
  description: 'A showcase of premium cards',
  user_id: 'user1',
  visibility: 'public' as const,
  cover_image_url: '/placeholder.svg',
  template_id: null,
  is_featured: false,
  is_group: false,
  allow_member_card_sharing: false,
  group_code: null,
  metadata: {},
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

const mockCards = [
  {
    id: '1',
    title: 'Sample Card 1',
    description: 'A premium trading card',
    image_url: '/placeholder.svg',
    thumbnail_url: '/placeholder.svg',
    creator_id: 'creator1',
    rarity: 'rare' as const,
    card_type: 'character' as const,
    visibility: 'public' as const,
    is_public: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Sample Card 2', 
    description: 'Another premium trading card',
    image_url: '/placeholder.svg',
    thumbnail_url: '/placeholder.svg',
    creator_id: 'creator2',
    rarity: 'legendary' as const,
    card_type: 'character' as const,
    visibility: 'public' as const,
    is_public: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

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
      <div className="container mx-auto px-4 py-8 relative">
        <div className="text-center max-w-4xl mx-auto mb-12">
          {/* Announcement Badge */}
          <Badge className="mb-6 bg-[#00C851]/20 text-[#00C851] border-[#00C851]/30 hover:bg-[#00C851]/30">
            <Eye className="w-3 h-3 mr-1" />
            3D Experience
          </Badge>

          {/* Enhanced Header */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight font-display">
            <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              3D
            </span>
            <br />
            <span className="bg-gradient-to-r from-[#00C851] to-[#00A543] bg-clip-text text-transparent">
              Gallery
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Experience your card collection in immersive 3D environments. 
            Rotate, zoom, and explore every detail with stunning visual effects.
          </p>
        </div>

        <Suspense fallback={<GallerySkeleton />}>
          <Collection3DGallery 
            collection={mockCollection}
            cards={mockCards}
          />
        </Suspense>
      </div>
    </div>
  );
};

const GallerySkeleton = () => (
  <div className="space-y-6">
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 animate-pulse">
      <Skeleton className="h-96 w-full rounded-xl" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-4 animate-pulse">
          <Skeleton className="h-20 w-full rounded-xl" />
        </div>
      ))}
    </div>
  </div>
);

export default Gallery;
