
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Preload, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import { ErrorBoundary } from 'react-error-boundary';
import EnvironmentalEffects from './EnvironmentalEffects';
import GalleryCard from './GalleryCard';
import SpatialUI from './SpatialUI';
import { detectWebGLSupport } from '@/utils/webglDetection';
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

const GalleryErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
  <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
    <div className="text-center">
      <h3 className="text-lg font-semibold mb-2">3D Gallery Error</h3>
      <p className="text-gray-400 mb-4">Failed to render 3D gallery: {error.message}</p>
      <button 
        onClick={resetErrorBoundary}
        className="bg-[#00C851] text-white px-4 py-2 rounded hover:bg-[#00a844]"
      >
        Try Again
      </button>
    </div>
  </div>
);

const GalleryFallback2D = ({ cardPositions, selectedCardIndex, onCardClick }: {
  cardPositions: CardPosition[];
  selectedCardIndex: number;
  onCardClick: (index: number) => void;
}) => (
  <div className="w-full h-full bg-gray-900 p-4 overflow-auto">
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {cardPositions.map((cardPosition, index) => (
        <div
          key={cardPosition.card.id}
          className={`relative cursor-pointer transform transition-transform hover:scale-105 ${
            index === selectedCardIndex ? 'ring-2 ring-[#00C851]' : ''
          }`}
          onClick={() => onCardClick(index)}
        >
          <img
            src={cardPosition.card.image_url || '/placeholder.svg'}
            alt={cardPosition.card.title}
            className="w-full h-auto rounded-lg"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 rounded-b-lg">
            <p className="text-sm truncate">{cardPosition.card.title}</p>
          </div>
        </div>
      ))}
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
  // Check WebGL support
  const webglSupport = detectWebGLSupport();
  
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

  // Use 2D fallback if WebGL not supported or accessibility mode enabled
  if (!webglSupport.supported || accessibilityMode) {
    return (
      <GalleryFallback2D
        cardPositions={cardPositions}
        selectedCardIndex={selectedCardIndex}
        onCardClick={onCardClick}
      />
    );
  }

  return (
    <ErrorBoundary 
      FallbackComponent={GalleryErrorFallback}
      onReset={() => window.location.reload()}
    >
      <Canvas
        camera={{ position: [0, 2, 8], fov: 60 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance'
        }}
        shadows={!accessibilityMode}
        dpr={[1, 2]}
      >
        {/* Performance optimization components */}
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        
        <Suspense fallback={null}>
          {/* Environmental Effects */}
          <EnvironmentalEffects
            theme={environmentTheme}
            dominantColors={dominantColors}
            enableParticles={enableParticles && !accessibilityMode}
          />

          {/* Render Cards with error boundary per card */}
          {cardPositions.map((cardPosition, index) => (
            <ErrorBoundary key={cardPosition.card.id} fallback={null}>
              <GalleryCard
                cardPosition={cardPosition}
                isSelected={index === selectedCardIndex}
                onClick={() => onCardClick(index)}
              />
            </ErrorBoundary>
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
            maxPolarAngle={Math.PI / 1.8}
          />

          <Preload all />
        </Suspense>
      </Canvas>
    </ErrorBoundary>
  );
};

export default GalleryCanvas;
