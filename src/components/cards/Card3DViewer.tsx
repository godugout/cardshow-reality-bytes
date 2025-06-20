
import { Suspense, useState, useEffect, ErrorBoundary } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, Preload } from '@react-three/drei';
import { Perf } from 'r3f-perf';
import Card3D from './Card3D';
import { detectWebGLSupport, getDevicePerformanceTier } from '@/utils/webglDetection';
import { use3DPreferences } from '@/hooks/use3DPreferences';
import { cn } from '@/lib/utils';
import type { Card } from '@/types/card';

interface Card3DViewerProps {
  card: Card;
  className?: string;
  interactive?: boolean;
  showControls?: boolean;
  onLoad?: () => void;
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
    <div className="text-gray-400">Loading 3D view...</div>
  </div>
);

const ErrorFallback = ({ card }: { card: Card }) => {
  console.warn('3D rendering failed, falling back to 2D');
  return <Card3DFallback card={card} />;
};

const Card3DViewer = ({ 
  card, 
  className, 
  interactive = true, 
  showControls = false,
  onLoad 
}: Card3DViewerProps) => {
  const { preferences, loading: prefsLoading } = use3DPreferences();
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
  if (prefsLoading || !webglSupport?.supported || !preferences.enabled) {
    return <Card3DFallback card={card} />;
  }

  const quality = preferences.quality === 'auto' ? performanceTier : preferences.quality;

  return (
    <div className={cn('w-full h-full relative', className)}>
      <ErrorBoundary fallback={<ErrorFallback card={card} />}>
        <Canvas
          dpr={[1, quality === 'high' ? 2 : 1.5]}
          performance={{ min: 0.5 }}
          gl={{ 
            antialias: quality !== 'low',
            alpha: true,
            powerPreference: 'high-performance'
          }}
          camera={{ 
            position: [0, 0, 5], 
            fov: 50,
            near: 0.1,
            far: 1000
          }}
        >
          {showPerf && <Perf position="top-left" />}
          
          <ambientLight intensity={0.4} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={1} 
            castShadow={quality === 'high'}
          />
          
          {quality !== 'low' && (
            <Environment preset="studio" background={false} />
          )}
          
          <Suspense fallback={null}>
            <Card3D
              card={card}
              interactive={interactive}
              quality={quality}
              enableAnimations={preferences.animations}
              onLoad={onLoad}
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
              maxPolarAngle={Math.PI / 1.8}
            />
          )}
        </Canvas>
      </ErrorBoundary>
    </div>
  );
};

export default Card3DViewer;
