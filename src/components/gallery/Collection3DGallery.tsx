
import { useState, useEffect, useMemo, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Preload } from '@react-three/drei';
import { ErrorBoundary } from 'react-error-boundary';
import Card3DViewerPremium from '@/components/cards/Card3DViewerPremium';
import SpatialUI from './SpatialUI';
import EnvironmentalEffects from './EnvironmentalEffects';
import { useGalleryPreferences } from '@/hooks/useGalleryPreferences';
import { useGalleryNavigation } from '@/hooks/useGalleryNavigation';
import { 
  calculateCircularLayout,
  calculateGalleryWallLayout,
  calculateSpiralLayout,
  calculateGridLayout,
  calculateRandomScatterLayout,
  type CardPosition
} from '@/utils/galleryLayouts';
import type { Card } from '@/types/card';
import type { Collection } from '@/types/collection';

interface Collection3DGalleryProps {
  collection: Collection;
  cards: Card[];
  onCardSelect?: (card: Card) => void;
}

const GalleryCard = ({ cardPosition, isSelected, onClick }: {
  cardPosition: CardPosition;
  isSelected: boolean;
  onClick: () => void;
}) => {
  return (
    <group
      position={cardPosition.position}
      rotation={cardPosition.rotation}
      scale={cardPosition.scale}
      onClick={onClick}
    >
      <Card3DViewerPremium
        card={cardPosition.card}
        interactive={true}
        className={isSelected ? 'ring-2 ring-[#00C851]' : ''}
      />
      
      {/* Selection Indicator */}
      {isSelected && (
        <mesh position={[0, 0, 0.1]}>
          <ringGeometry args={[1.2, 1.4, 32]} />
          <meshBasicMaterial color="#00C851" transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
};

const Collection3DGallery = ({ collection, cards, onCardSelect }: Collection3DGalleryProps) => {
  const { preferences, loading } = useGalleryPreferences();
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentLayout, setCurrentLayout] = useState(preferences.layout_type);

  // Filter cards based on search
  const filteredCards = useMemo(() => {
    if (!searchQuery) return cards;
    return cards.filter(card => 
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.rarity?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [cards, searchQuery]);

  // Calculate card positions based on layout
  const cardPositions = useMemo((): CardPosition[] => {
    if (filteredCards.length === 0) return [];
    
    switch (currentLayout) {
      case 'gallery_wall':
        return calculateGalleryWallLayout(filteredCards);
      case 'spiral':
        return calculateSpiralLayout(filteredCards);
      case 'grid':
        return calculateGridLayout(filteredCards);
      case 'random_scatter':
        return calculateRandomScatterLayout(filteredCards);
      default:
        return calculateCircularLayout(filteredCards);
    }
  }, [filteredCards, currentLayout]);

  // Navigation hook
  useGalleryNavigation(cardPositions, selectedCardIndex, setSelectedCardIndex);

  // Collection statistics
  const collectionStats = useMemo(() => {
    const totalValue = cards.reduce((sum, card) => sum + (card.current_market_value || 0), 0);
    const uniqueRarities = new Set(cards.map(card => card.rarity).filter(Boolean)).size;
    
    return {
      totalCards: cards.length,
      uniqueRarities,
      totalValue
    };
  }, [cards]);

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
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading gallery preferences...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative bg-black">
      <ErrorBoundary fallback={<div className="text-white p-4">Gallery failed to load</div>}>
        <Canvas
          camera={{ position: [0, 2, 8], fov: 60 }}
          gl={{ antialias: true, alpha: true }}
          shadows={!preferences.accessibility_mode}
        >
          <Suspense fallback={null}>
            {/* Environmental Effects */}
            <EnvironmentalEffects
              theme={preferences.environment_theme}
              dominantColors={dominantColors}
              enableParticles={preferences.particle_effects}
            />

            {/* Render Cards */}
            {cardPositions.map((cardPosition, index) => (
              <GalleryCard
                key={cardPosition.card.id}
                cardPosition={cardPosition}
                isSelected={index === selectedCardIndex}
                onClick={() => handleCardClick(index)}
              />
            ))}

            {/* Spatial UI Elements */}
            <SpatialUI
              selectedCard={cardPositions[selectedCardIndex]?.card}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onLayoutChange={handleLayoutChange}
              collectionStats={collectionStats}
            />

            {/* Camera Controls */}
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={!preferences.accessibility_mode}
              minDistance={2}
              maxDistance={50}
              enableDamping={true}
              dampingFactor={0.05}
            />

            <Preload all />
          </Suspense>
        </Canvas>
      </ErrorBoundary>

      {/* Accessibility Instructions */}
      {preferences.accessibility_mode && (
        <div className="absolute bottom-4 left-4 bg-black/80 text-white p-3 rounded-lg max-w-sm">
          <h4 className="font-semibold mb-2">Gallery Navigation</h4>
          <p className="text-sm text-gray-300">
            Use arrow keys or WASD to navigate between cards. 
            Press Enter to select a card. Use Tab to focus on UI elements.
          </p>
        </div>
      )}
    </div>
  );
};

export default Collection3DGallery;
