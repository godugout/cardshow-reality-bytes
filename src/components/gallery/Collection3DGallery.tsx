
import { useState, useMemo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import GalleryCanvas from './GalleryCanvas';
import GalleryAccessibility from './GalleryAccessibility';
import { useGalleryPreferences } from '@/hooks/useGalleryPreferences';
import { useGalleryNavigation } from '@/hooks/useGalleryNavigation';
import { useGalleryLayout } from '@/hooks/useGalleryLayout';
import { useCollectionStats } from '@/hooks/useCollectionStats';
import { useGallerySearch } from '@/hooks/useGallerySearch';
import type { Card } from '@/types/card';
import type { Collection } from '@/types/collection';

interface Collection3DGalleryProps {
  collection: Collection;
  cards: Card[];
  onCardSelect?: (card: Card) => void;
}

const GalleryError = ({ error }: { error: Error }) => (
  <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
    <div className="text-center max-w-md">
      <h3 className="text-xl font-bold text-red-400 mb-2">Gallery Error</h3>
      <p className="text-gray-400 mb-4">Failed to load the 3D gallery view</p>
      <p className="text-sm text-gray-500">{error.message}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="mt-4 px-4 py-2 bg-[#00C851] text-white rounded hover:bg-[#00a844]"
      >
        Reload Page
      </button>
    </div>
  </div>
);

const Collection3DGallery = ({ collection, cards, onCardSelect }: Collection3DGalleryProps) => {
  const { preferences, loading } = useGalleryPreferences();
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentLayout, setCurrentLayout] = useState(preferences.layout_type);

  // Filter cards based on search
  const filteredCards = useGallerySearch(cards, searchQuery);

  // Calculate card positions based on layout
  const cardPositions = useGalleryLayout(filteredCards, currentLayout);

  // Navigation hook
  useGalleryNavigation(cardPositions, selectedCardIndex, setSelectedCardIndex);

  // Collection statistics
  const collectionStats = useCollectionStats(cards);

  // Extract dominant colors from cards for environmental theming
  const dominantColors = useMemo(() => {
    // Simple default colors - in a real implementation, you'd extract from card images
    return ['#00C851', '#1a1a1a', '#333333'];
  }, [cards]);

  const handleCardClick = (index: number) => {
    setSelectedCardIndex(index);
    const selectedCard = cardPositions[index]?.card;
    if (selectedCard && onCardSelect) {
      onCardSelect(selectedCard);
    }
  };

  const handleLayoutChange = (layout: string) => {
    setCurrentLayout(layout as any);
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900">
        <div className="text-white text-center">
          <div className="animate-spin w-8 h-8 border-2 border-[#00C851] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading gallery preferences...</p>
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900">
        <div className="text-white text-center">
          <h3 className="text-xl font-bold mb-2">Empty Collection</h3>
          <p className="text-gray-400">This collection doesn't have any cards yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative bg-black">
      <ErrorBoundary fallbackRender={({ error }) => <GalleryError error={error} />}>
        <GalleryCanvas
          cardPositions={cardPositions}
          selectedCardIndex={selectedCardIndex}
          onCardClick={handleCardClick}
          environmentTheme={preferences.environment_theme}
          enableParticles={preferences.particle_effects}
          accessibilityMode={preferences.accessibility_mode}
          dominantColors={dominantColors}
          selectedCard={cardPositions[selectedCardIndex]?.card}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onLayoutChange={handleLayoutChange}
          collectionStats={collectionStats}
        />
      </ErrorBoundary>

      {/* Accessibility Instructions */}
      <GalleryAccessibility accessibilityMode={preferences.accessibility_mode} />
    </div>
  );
};

export default Collection3DGallery;
