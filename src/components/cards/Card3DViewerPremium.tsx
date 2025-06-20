
import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, Preload, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import { ErrorBoundary } from 'react-error-boundary';
import { Perf } from 'r3f-perf';
import Card3DPremium from './Card3DPremium';
import { detectWebGLSupport, getDevicePerformanceTier } from '@/utils/webglDetection';
import { useAdvanced3DPreferences } from '@/hooks/useAdvanced3DPreferences';
import { cn } from '@/lib/utils';
import type { Card } from '@/types/card';

interface Card3DViewerPremiumProps {
  card: Card;
  className?: string;
  interactive?: boolean;
  showControls?: boolean;
  onLoad?: () => void;
  onFlip?: () => void;
}

const Card3DFallback = ({ card }: { card: Card }) => (
  <div className="w-full h-full flex items-center justify-center bg-gray-800 rounded-lg">
    <img
      src={card.image_url || '/placeholder.svg'}
      alt={card.title}
      className="max-w-full max-h-full object-contain rounded-lg"
    />
  </div>
);

const LoadingFallback = () => (
  <div className="w-full h-full flex items-center justify-center bg-gray-800 rounded-lg animate-pulse">
    <div className="text-gray-400">Loading premium 3D view...</div>
  </div>
);

const ErrorFallback = ({ card }: { card: Card }) => {
  console.warn('Premium 3D rendering failed, falling back to 2D');
  return <Card3DFallback card={card} />;
};

const Card3DViewerPremium = ({ 
  card, 
  className, 
  interactive = true, 
  showControls = false,
  onLoad,
  onFlip 
}: Card3DViewerPremiumProps) => {
  const { preferences, loading: prefsLoading } = useAdvanced3DPreferences();
  const [webglSupport, setWebglSupport] = useState<{ supported: boolean; version: number } | null>(null);
  const [performanceTier, setPerformanceTier] = useState<'low' | 'medium' | 'high'>('medium');
  const [showPerf, setShowPerf] = useState(false);

  useEffect(() => {
    setWebglSupport(detectWebGLSupport());
    setPerformanceTier(getDevicePerformanceTier());
    
    // Show performance monitor in development
    setShowPerf(process.env.NODE_ENV === 'development');
  }, []);

  // Don't render 3D if preferences are disabled or WebGL not supported
  if (prefsLoading || !webglSupport?.supported || preferences.accessibilityMode) {
    return <Card3DFallback card={card} />;
  }

  // Determine final quality settings
  const quality = preferences.qualityPreset === 'auto' ? performanceTier : preferences.qualityPreset;
  const dpr = {
    low: [0.5, 1],
    medium: [1, 1.5],
    high: [1, 2],
    ultra: [1, 2]
  }[quality] as [number, number];

  return (
    <div className={cn('w-full h-full relative', className)}>
      <ErrorBoundary fallback={<ErrorFallback card={card} />}>
        <Canvas
          dpr={dpr}
          performance={{ min: 0.2, max: 1 }}
          gl={{ 
            antialias: quality !== 'low',
            alpha: true,
            powerPreference: 'high-performance',
            stencil: false,
            depth: true
          }}
          camera={{ 
            position: [0, 0, 6], 
            fov: 45,
            near: 0.1,
            far: 1000
          }}
          shadows={quality === 'ultra'}
        >
          {showPerf && <Perf position="top-left" />}
          
          {/* Adaptive performance components */}
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
          
          {/* Lighting setup based on quality */}
          <ambientLight intensity={quality === 'low' ? 0.6 : 0.4} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={1.2} 
            castShadow={quality === 'ultra'}
            shadow-mapSize-width={quality === 'ultra' ? 2048 : 1024}
            shadow-mapSize-height={quality === 'ultra' ? 2048 : 1024}
          />
          
          {quality !== 'low' && (
            <Environment 
              preset="studio" 
              background={false}
              resolution={quality === 'ultra' ? 512 : 256}
            />
          )}
          
          <Suspense fallback={null}>
            <Card3DPremium
              card={card}
              interactive={interactive}
              onLoad={onLoad}
              onFlip={onFlip}
            />
            <Preload all />
          </Suspense>
          
          {showControls && interactive && (
            <OrbitControls
              enablePan={false}
              enableZoom={true}
              enableRotate={true}
              minDistance={3}
              maxDistance={10}
              maxPolarAngle={Math.PI / 1.6}
              enableDamping={true}
              dampingFactor={0.05}
            />
          )}
        </Canvas>
      </ErrorBoundary>
      
      {/* Quality indicator */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
          Quality: {quality.toUpperCase()}
        </div>
      )}
    </div>
  );
};

export default Card3DViewerPremium;
