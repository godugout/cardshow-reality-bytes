
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Preload } from '@react-three/drei';
import EnvironmentalEffects from './EnvironmentalEffects';
import GalleryCard from './GalleryCard';
import SpatialUI from './SpatialUI';
import type { CardPosition } from '@/utils/galleryLayouts';
import type { Card } from '@/types/card';
import type { EnvironmentTheme } from '@/hooks/useGalleryPreferences';

interface GalleryCanvasProps {
  cardPositions: CardPosition[];
  selectedCardIndex: number;
  onCardClick: (index: number) => void;
  environmentTheme: EnvironmentTheme;
  enableParticles: boolean;
  accessibilityMode: boolean;
  dominantColors: string[];
  selectedCard?: Card;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onLayoutChange: (layout: string) => void;
  collectionStats: {
    totalCards: number;
    uniqueRarities: number;
    totalValue: number;
  };
}

const GalleryCanvas = ({
  cardPositions,
  selectedCardIndex,
  onCardClick,
  environmentTheme,
  enableParticles,
  accessibilityMode,
  dominantColors,
  selectedCard,
  searchQuery,
  onSearchChange,
  onLayoutChange,
  collectionStats
}: GalleryCanvasProps) => {
  // Fallback for empty card positions
  if (!cardPositions || cardPositions.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">No Cards Found</h3>
          <p className="text-gray-400">This collection appears to be empty.</p>
        </div>
      </div>
    );
  }

  return (
    <Canvas
      camera={{ position: [0, 2, 8], fov: 60 }}
      gl={{ antialias: true, alpha: true }}
      shadows={!accessibilityMode}
      onCreated={(state) => {
        // Ensure camera is properly set up
        state.camera.lookAt(0, 0, 0);
      }}
    >
      <Suspense fallback={null}>
        {/* Environmental Effects */}
        <EnvironmentalEffects
          theme={environmentTheme}
          dominantColors={dominantColors}
          enableParticles={enableParticles}
        />

        {/* Render Cards */}
        {cardPositions.map((cardPosition, index) => (
          <GalleryCard
            key={cardPosition.card.id}
            cardPosition={cardPosition}
            isSelected={index === selectedCardIndex}
            onClick={() => onCardClick(index)}
          />
        ))}

        {/* Spatial UI Elements */}
        <SpatialUI
          selectedCard={selectedCard}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          onLayoutChange={onLayoutChange}
          collectionStats={collectionStats}
        />

        {/* Camera Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={!accessibilityMode}
          minDistance={2}
          maxDistance={50}
          enableDamping={true}
          dampingFactor={0.05}
        />

        <Preload all />
      </Suspense>
    </Canvas>
  );
};

export default GalleryCanvas;
