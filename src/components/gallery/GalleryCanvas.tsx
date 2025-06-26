
import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Preload, AdaptiveDpr, AdaptiveEvents, Stats } from '@react-three/drei';
import { ErrorBoundary } from 'react-error-boundary';
import EnvironmentalEffects from './EnvironmentalEffects';
import GalleryCard from './GalleryCard';
import SpatialUI from './SpatialUI';
import { useLODSystem } from '@/hooks/useLODSystem';
import { useProgressiveGalleryLoading } from '@/hooks/useProgressiveGalleryLoading';
import { use3DResourceManager } from '@/hooks/use3DResourceManager';
import { detectWebGLSupport } from '@/utils/webglDetection';
import { useMobile } from '@/hooks/use-mobile';
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

const GalleryLoadingFallback = ({ progress }: { progress: number }) => (
  <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00C851] mx-auto mb-4"></div>
      <p className="mb-2">Loading 3D Gallery...</p>
      <div className="w-64 bg-gray-700 rounded-full h-2">
        <div 
          className="bg-[#00C851] h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-sm text-gray-400 mt-2">{Math.round(progress)}%</p>
    </div>
  </div>
);

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
            loading="lazy"
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
  const isMobile = useMobile();
  const { disposeAll } = use3DResourceManager();
  
  // LOD system
  const { cardLODs, getVisibleCards } = useLODSystem(cardPositions, {
    highDetailDistance: isMobile ? 6 : 8,
    mediumDetailDistance: isMobile ? 15 : 20,
    updateFrequency: isMobile ? 15 : 10
  });

  // Progressive loading
  const visibleCardIds = useMemo(() => 
    getVisibleCards().map(lod => lod.cardId), 
    [getVisibleCards]
  );

  const { 
    loadingState, 
    shouldRenderCard, 
    isLoadingComplete,
    loadingProgress 
  } = useProgressiveGalleryLoading(cardPositions, visibleCardIds, {
    initialBatchSize: isMobile ? 3 : 5,
    batchSize: isMobile ? 2 : 3,
    loadingDelay: isMobile ? 150 : 100
  });

  // Check WebGL support
  const webglSupport = detectWebGLSupport();
  
  // Mobile optimizations
  const canvasProps = useMemo(() => ({
    dpr: isMobile ? [0.5, 1] : [1, 2],
    performance: { min: isMobile ? 0.3 : 0.2, max: 1 },
    gl: { 
      antialias: !isMobile && !accessibilityMode,
      alpha: true,
      powerPreference: isMobile ? 'default' : 'high-performance',
      stencil: false,
      depth: true
    },
    camera: { 
      position: [0, 2, isMobile ? 10 : 8], 
      fov: isMobile ? 65 : 60,
      near: 0.1,
      far: isMobile ? 100 : 1000
    },
    shadows: !isMobile && !accessibilityMode
  }), [isMobile, accessibilityMode]);

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

  // Use 2D fallback if WebGL not supported, accessibility mode, or too many cards on mobile
  if (!webglSupport.supported || accessibilityMode || (isMobile && cardPositions.length > 50)) {
    return (
      <GalleryFallback2D
        cardPositions={cardPositions}
        selectedCardIndex={selectedCardIndex}
        onCardClick={onCardClick}
      />
    );
  }

  // Show loading state
  if (!isLoadingComplete && loadingProgress < 100) {
    return <GalleryLoadingFallback progress={loadingProgress} />;
  }

  return (
    <ErrorBoundary 
      FallbackComponent={GalleryErrorFallback}
      onReset={() => {
        disposeAll();
        window.location.reload();
      }}
    >
      <Canvas {...canvasProps}>
        {/* Performance monitoring in development */}
        {process.env.NODE_ENV === 'development' && <Stats />}
        
        {/* Performance optimization components */}
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        
        <Suspense fallback={null}>
          {/* Environmental Effects - reduced for mobile */}
          <EnvironmentalEffects
            theme={environmentTheme}
            dominantColors={dominantColors}
            enableParticles={enableParticles && !accessibilityMode && !isMobile}
          />

          {/* Render Cards with LOD and progressive loading */}
          {cardPositions.map((cardPosition, index) => {
            const cardLOD = cardLODs.get(cardPosition.card.id);
            const shouldRender = shouldRenderCard(cardPosition.card.id) && cardLOD?.shouldRender;
            
            if (!shouldRender) return null;

            return (
              <ErrorBoundary key={cardPosition.card.id} fallback={null}>
                <GalleryCard
                  cardPosition={cardPosition}
                  isSelected={index === selectedCardIndex}
                  onClick={() => onCardClick(index)}
                  lodLevel={cardLOD?.lodLevel || 'medium'}
                  shouldRender={shouldRender}
                />
              </ErrorBoundary>
            );
          })}

          {/* Spatial UI Elements - simplified for mobile */}
          {!isMobile && (
            <SpatialUI
              selectedCard={selectedCard}
              searchQuery={searchQuery}
              onSearchChange={onSearchChange}
              onLayoutChange={onLayoutChange}
              collectionStats={collectionStats}
            />
          )}

          {/* Camera Controls */}
          <OrbitControls
            enablePan={!isMobile}
            enableZoom={true}
            enableRotate={!accessibilityMode}
            minDistance={isMobile ? 5 : 2}
            maxDistance={isMobile ? 30 : 50}
            enableDamping={true}
            dampingFactor={isMobile ? 0.1 : 0.05}
            maxPolarAngle={Math.PI / 1.8}
            touchAction="pan-y"
          />

          <Preload all />
        </Suspense>
      </Canvas>
      
      {/* Performance info overlay */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs p-2 rounded">
          <div>Total Cards: {cardPositions.length}</div>
          <div>Visible: {getVisibleCards().length}</div>
          <div>Loaded: {loadingState.loadedCards.size}</div>
          <div>Progress: {Math.round(loadingProgress)}%</div>
        </div>
      )}
    </ErrorBoundary>
  );
};

export default GalleryCanvas;
