
import { Suspense } from 'react';
import Navigation from '@/components/layout/Navigation';
import Collection3DGallery from '@/components/gallery/Collection3DGallery';
import { Skeleton } from '@/components/ui/skeleton';

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
      <Navigation />
      <div className="container-xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-display-lg text-foreground mb-2">3D Gallery</h1>
          <p className="text-body-lg text-muted-foreground">
            Experience your card collection in immersive 3D environments
          </p>
        </div>

        <Suspense fallback={
          <div className="space-y-6">
            <Skeleton className="h-96 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          </div>
        }>
          <Collection3DGallery 
            collection={mockCollection}
            cards={mockCards}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default Gallery;
