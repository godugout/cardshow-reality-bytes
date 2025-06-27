
import { Suspense } from 'react';
import Header from '@/components/Header';
import Collection3DGallery from '@/components/gallery/Collection3DGallery';
import { Skeleton } from '@/components/ui/skeleton';

// Mock data for the gallery - in a real app this would come from props or API
const mockCollection = {
  id: '1',
  name: 'Featured Collection',
  description: 'A showcase of premium cards',
  owner_id: 'user1',
  is_public: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

const mockCards = [
  {
    id: '1',
    title: 'Sample Card 1',
    description: 'A premium trading card',
    imageUrl: '/placeholder.svg',
    creatorId: 'creator1',
    rarity: 'rare' as const,
    isPublic: true,
    metadata: {
      effects: { holographic: true, chrome: false, foil: true, intensity: 0.8 },
      rendering: { shaderType: 'holographic', animationPreset: 'hover', textureQuality: 'high' as const }
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Sample Card 2',
    description: 'Another premium trading card',
    imageUrl: '/placeholder.svg',
    creatorId: 'creator2',
    rarity: 'legendary' as const,
    isPublic: true,
    metadata: {
      effects: { holographic: false, chrome: true, foil: false, intensity: 0.6 },
      rendering: { shaderType: 'chrome', animationPreset: 'spin', textureQuality: 'high' as const }
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const Gallery = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 font-display">3D Gallery</h1>
          <p className="text-muted-foreground">
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
