
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { useCollections } from '@/hooks/useCollections';
import { useCards } from '@/hooks/useCards';
import { useViewingHistory } from '@/hooks/useViewingHistory';
import Collection3DGallery from '@/components/gallery/Collection3DGallery';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Settings, Share } from 'lucide-react';
import { toast } from 'sonner';

const Gallery = () => {
  const { collectionId } = useParams<{ collectionId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { collections, isLoading: collectionsLoading } = useCollections();
  const { cards, isLoading: cardsLoading } = useCards();
  const [selectedCard, setSelectedCard] = useState(null);

  const collection = collections?.find(c => c.id === collectionId);
  const collectionCards = cards?.filter(card => 
    // This would normally be filtered by collection_id in the cards table
    // For now, we'll show all cards as a demo
    true
  ) || [];

  useViewingHistory(collectionId || '', 'circular', selectedCard);

  useEffect(() => {
    if (!collectionsLoading && collections && !collection) {
      toast.error('Collection not found');
      navigate('/collections');
    }
  }, [collection, collections, collectionsLoading, navigate]);

  // Show loading state while data is being fetched
  if (collectionsLoading || cardsLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-white">
            <h1 className="text-2xl font-bold mb-4">Loading Gallery...</h1>
            <div className="animate-pulse bg-gray-800 h-32 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if collection not found
  if (!collection) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-white">
            <h1 className="text-2xl font-bold mb-4">Collection Not Found</h1>
            <Button onClick={() => navigate('/collections')}>
              Back to Collections
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Gallery Header */}
      <div className="absolute top-16 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/collections')}
              className="text-white hover:text-[#00C851]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Collections
            </Button>
            
            <div>
              <h1 className="text-2xl font-bold text-white">{collection.title}</h1>
              <p className="text-gray-400">{collectionCards.length} cards</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Share className="w-4 h-4 mr-2" />
              Share Gallery
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Gallery Settings
            </Button>
          </div>
        </div>
      </div>

      {/* 3D Gallery */}
      <div className="h-screen pt-16">
        <Collection3DGallery
          collection={collection}
          cards={collectionCards}
          onCardSelect={setSelectedCard}
        />
      </div>
    </div>
  );
};

export default Gallery;
