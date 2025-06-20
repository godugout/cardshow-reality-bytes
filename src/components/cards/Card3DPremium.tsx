
import { useRef, useState, useEffect, Suspense } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';
import { usePremiumCardMaterial } from './materials/PremiumCardMaterials';
import ParticleSystem from './effects/ParticleSystem';
import { useAdvanced3DPreferences } from '@/hooks/useAdvanced3DPreferences';
import { useGestureTracking } from '@/hooks/useGestureTracking';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import type { Card } from '@/types/card';

interface Card3DPremiumProps {
  card: Card;
  interactive?: boolean;
  onFlip?: () => void;
  onClick?: () => void;
  onLoad?: () => void;
}

const Card3DPremium = ({ 
  card, 
  interactive = true, 
  onFlip,
  onClick,
  onLoad 
}: Card3DPremiumProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const { viewport, camera } = useThree();
  const { preferences } = useAdvanced3DPreferences();
  const { startGestureTracking, stopGestureTracking } = useGestureTracking();
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
  
  // Responsive scaling
  const scale = Math.min(viewport.width / 6, viewport.height / 8, 1.2);
  
  // Advanced spring animations
  const { rotation, position, scale: springScale } = useSpring({
    rotation: [
      isFlipped ? Math.PI : 0,
      isHovered ? mousePosition.x * 0.3 : 0,
      isHovered ? mousePosition.y * 0.2 : 0
    ] as [number, number, number],
    position: [
      mousePosition.x * 0.1,
      isHovered ? 0.2 + mousePosition.y * 0.05 : 0,
      isHovered ? 0.3 : 0
    ] as [number, number, number],
    scale: isHovered ? scale * 1.1 : scale,
    config: { 
      tension: preferences.enableAnimations ? 200 : 1000, 
      friction: preferences.enableAnimations ? 25 : 100 
    }
  });
  
  // Mouse/touch tracking for parallax
  const handlePointerMove = (event: any) => {
    if (!interactive || !isHovered) return;
    
    const rect = event.target.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    
    setMousePosition({ x, y });
  };
  
  // Gesture handling
  const handlePointerDown = (event: any) => {
    if (!interactive) return;
    event.stopPropagation();
    startGestureTracking(event);
  };
  
  const handlePointerUp = () => {
    if (!interactive) return;
    stopGestureTracking();
  };
  
  const handleDoubleClick = () => {
    if (!interactive) return;
    setIsFlipped(!isFlipped);
    onFlip?.();
    
    // Haptic feedback (mobile)
    if (preferences.enableHaptics && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };
  
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
    <group ref={groupRef}>
      {/* Main card mesh */}
      <animated.mesh
        ref={meshRef}
        material={material}
        rotation={rotation as any}
        position={position as any}
        scale={springScale}
        onPointerEnter={() => interactive && setIsHovered(true)}
        onPointerLeave={() => {
          if (interactive) {
            setIsHovered(false);
            setMousePosition({ x: 0, y: 0 });
          }
        }}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onClick={() => interactive && onClick?.()}
        onDoubleClick={handleDoubleClick}
        castShadow={preferences.qualityPreset === 'ultra'}
        receiveShadow={preferences.qualityPreset === 'ultra'}
      >
        <planeGeometry args={[2.5, 3.5]} />
      </animated.mesh>
      
      {/* Particle effects */}
      {preferences.enableParticles && ['rare', 'epic', 'legendary', 'mythic'].includes(card.rarity || '') && (
        <Suspense fallback={null}>
          <ParticleSystem
            rarity={card.rarity || 'common'}
            enabled={preferences.enableParticles}
            count={preferences.qualityPreset === 'ultra' ? 150 : 75}
            area={[4, 5, 2]}
          />
        </Suspense>
      )}
      
      {/* Environmental lighting for premium cards */}
      {preferences.qualityPreset === 'ultra' && isHovered && (
        <>
          <pointLight
            position={[2, 2, 2]}
            intensity={0.5}
            color={card.rarity === 'legendary' ? '#FFD700' : '#FFFFFF'}
          />
          <spotLight
            position={[0, 3, 3]}
            angle={0.3}
            penumbra={0.5}
            intensity={0.8}
            castShadow
            target={meshRef.current || undefined}
          />
        </>
      )}
    </group>
  );
};

export default Card3DPremium;
