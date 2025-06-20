
import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { animated } from '@react-spring/three';
import * as THREE from 'three';
import { usePremiumCardMaterial } from './materials/PremiumCardMaterials';
import { useAdvanced3DPreferences } from '@/hooks/useAdvanced3DPreferences';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import type { Card } from '@/types/card';

interface Card3DMeshProps {
  card: Card;
  rotation: any;
  position: any;
  scale: any;
  isHovered: boolean;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
  onPointerMove: (event: any) => void;
  onPointerDown: (event: any) => void;
  onPointerUp: () => void;
  onClick: () => void;
  onDoubleClick: () => void;
  onLoad?: () => void;
}

const Card3DMesh = ({
  card,
  rotation,
  position,
  scale,
  isHovered,
  onPointerEnter,
  onPointerLeave,
  onPointerMove,
  onPointerDown,
  onPointerUp,
  onClick,
  onDoubleClick,
  onLoad
}: Card3DMeshProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { preferences } = useAdvanced3DPreferences();
  const { logPerformance } = usePerformanceMonitor();
  
  // Convert auto quality to specific quality for the material
  const materialQuality = preferences.qualityPreset === 'auto' ? 'medium' : preferences.qualityPreset as 'low' | 'medium' | 'high' | 'ultra';
  
  // Get premium material
  const material = usePremiumCardMaterial({
    rarity: card.rarity || 'common',
    imageUrl: card.image_url || '/placeholder.svg',
    quality: materialQuality,
    enableShaders: preferences.enableShaders
  });

  // Advanced frame updates
  useFrame((state) => {
    if (!meshRef.current || !preferences.enableAnimations) return;
    
    const time = state.clock.getElapsedTime();
    
    // Subtle floating animation for premium cards
    if (['rare', 'epic', 'legendary', 'mythic'].includes(card.rarity || '')) {
      meshRef.current.position.y += Math.sin(time * 0.8) * 0.01;
      meshRef.current.rotation.z = Math.sin(time * 0.5) * 0.02;
    }
    
    // Performance monitoring
    if (Math.random() < 0.01) { // Sample 1% of frames
      logPerformance({
        fps: 1 / state.clock.getDelta(),
        renderTime: state.clock.getDelta() * 1000,
        shaderType: card.rarity || 'common'
      });
    }
  });
  
  // Load completion callback
  useEffect(() => {
    if (onLoad) {
      const timer = setTimeout(onLoad, 100);
      return () => clearTimeout(timer);
    }
  }, [onLoad]);
  
  // Cleanup
  useEffect(() => {
    return () => {
      if (material && 'dispose' in material) {
        material.dispose();
      }
    };
  }, [material]);

  return (
    <animated.mesh
      ref={meshRef}
      material={material}
      rotation={rotation}
      position={position}
      scale={scale}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onPointerMove={onPointerMove}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      castShadow={preferences.qualityPreset === 'ultra'}
      receiveShadow={preferences.qualityPreset === 'ultra'}
    >
      <planeGeometry args={[2.5, 3.5]} />
    </animated.mesh>
  );
};

export default Card3DMesh;
