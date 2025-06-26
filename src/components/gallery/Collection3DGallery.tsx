
import { useState, useMemo, Suspense } from 'react';
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

const GalleryErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
  <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
    <div className="text-center">
      <h2 className="text-xl font-bold mb-4">Gallery Loading Error</h2>
      <p className="text-gray-400 mb-4">Something went wrong loading the 3D gallery.</p>
      <button 
        onClick={resetErrorBoundary}
        className="bg-[#00C851] text-white px-4 py-2 rounded hover:bg-[#00a844]"
      >
        Try Again
      </button>
    </div>
  </div>
);

const GalleryLoadingFallback = () => (
  <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00C851] mx-auto mb-4"></div>
      <p>Loading 3D Gallery...</p>
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
    // In a real implementation, you'd extract colors from card images
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
    return <GalleryLoadingFallback />;
  }

  return (
    <div className="w-full h-full relative bg-black">
      <ErrorBoundary 
        FallbackComponent={GalleryErrorFallback}
        onReset={() => window.location.reload()}
      >
        <Suspense fallback={<GalleryLoadingFallback />}>
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
        </Suspense>
      </ErrorBoundary>

      {/* Accessibility Instructions */}
      <GalleryAccessibility accessibilityMode={preferences.accessibility_mode} />
    </div>
  );
};

export default Collection3DGallery;
