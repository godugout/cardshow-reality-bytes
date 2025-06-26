
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Preload } from '@react-three/drei';
import { ErrorBoundary } from 'react-error-boundary';
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

const GalleryFallback = () => (
  <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
    <div className="text-center">
      <div className="animate-spin w-8 h-8 border-2 border-[#00C851] border-t-transparent rounded-full mx-auto mb-4"></div>
      <p>Loading 3D Gallery...</p>
    </div>
  </div>
);

const GalleryError = () => (
  <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
    <div className="text-center">
      <p className="text-red-400 mb-2">Failed to load 3D Gallery</p>
      <p className="text-gray-400 text-sm">Falling back to 2D view</p>
    </div>
  </div>
);

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
  if (cardPositions.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <p className="text-gray-400">No cards found in this collection</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary fallback={<GalleryError />}>
      <Canvas
        camera={{ position: [0, 2, 8], fov: 60 }}
        gl={{ 
          antialias: !accessibilityMode, 
          alpha: true,
          powerPreference: 'high-performance'
        }}
        shadows={!accessibilityMode}
        dpr={accessibilityMode ? [0.5, 1] : [1, 2]}
      >
        <Suspense fallback={null}>
          {/* Environmental Effects */}
          <EnvironmentalEffects
            theme={environmentTheme}
            dominantColors={dominantColors}
            enableParticles={enableParticles && !accessibilityMode}
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
            enablePan={!accessibilityMode}
            enableZoom={true}
            enableRotate={!accessibilityMode}
            minDistance={2}
            maxDistance={50}
            enableDamping={!accessibilityMode}
            dampingFactor={0.05}
          />

          <Preload all />
        </Suspense>
      </Canvas>
    </ErrorBoundary>
  );
};

export default GalleryCanvas;
