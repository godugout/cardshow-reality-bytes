
import { useRef, Suspense } from 'react';
import { useThree } from '@react-three/fiber';
import { useSpring } from '@react-spring/three';
import * as THREE from 'three';
import Card3DMesh from './Card3DMesh';
import Card3DLighting from './Card3DLighting';
import ParticleSystem from './effects/ParticleSystem';
import { useAdvanced3DPreferences } from '@/hooks/useAdvanced3DPreferences';
import { useCard3DInteractions } from '@/hooks/useCard3DInteractions';
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
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  
  const { viewport } = useThree();
  const { preferences } = useAdvanced3DPreferences();
  
  const {
    isHovered,
    isFlipped,
    mousePosition,
    handlePointerMove,
    handlePointerDown,
    handlePointerUp,
    handleDoubleClick,
    handleClick,
    handlePointerEnter,
    handlePointerLeave
  } = useCard3DInteractions({ interactive, onFlip, onClick });
  
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
  
  return (
    <group ref={groupRef}>
      <Card3DMesh
        card={card}
        rotation={rotation}
        position={position}
        scale={springScale}
        isHovered={isHovered}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onLoad={onLoad}
      />
      
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
      <Card3DLighting
        rarity={card.rarity || 'common'}
        isHovered={isHovered}
        meshRef={meshRef}
      />
    </group>
  );
};

export default Card3DPremium;
