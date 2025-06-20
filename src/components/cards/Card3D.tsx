
import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGesture } from '@use-gesture/react';
import { useSpring, animated } from '@react-spring/three';
import { Mesh, Vector3 } from 'three';
import { useCardMaterial } from './materials/CardMaterials';
import type { Card } from '@/types/card';

interface Card3DProps {
  card: Card;
  interactive?: boolean;
  quality: 'low' | 'medium' | 'high';
  enableAnimations?: boolean;
  onClick?: () => void;
  onLoad?: () => void;
}

const Card3D = ({ 
  card, 
  interactive = true, 
  quality, 
  enableAnimations = true,
  onClick,
  onLoad 
}: Card3DProps) => {
  const meshRef = useRef<Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [time, setTime] = useState(0);
  const { viewport, size } = useThree();

  // Calculate responsive scale
  const scale = Math.min(viewport.width / 6, viewport.height / 8, 1);

  // Get material based on rarity
  const material = useCardMaterial({
    rarity: card.rarity || 'common',
    imageUrl: card.image_url || '/placeholder.svg',
    quality,
    time
  });

  // Spring animation for hover and flip effects
  const { rotation, position, scale: springScale } = useSpring({
    rotation: [
      isFlipped ? Math.PI : 0,
      isHovered && !isFlipped ? 0.1 : 0,
      isHovered && !isFlipped ? 0.1 : 0
    ],
    position: [0, isHovered ? 0.1 : 0, 0],
    scale: isHovered ? scale * 1.05 : scale,
    config: { tension: 300, friction: 40 }
  });

  // Touch gesture handling - removed target option for Three.js compatibility
  const bind = useGesture({
    onDrag: ({ offset: [x, y] }) => {
      if (!interactive || !meshRef.current) return;
      meshRef.current.rotation.y = x / 100;
      meshRef.current.rotation.x = -y / 100;
    },
    onPinch: ({ offset: [scale] }) => {
      if (!interactive || !meshRef.current) return;
      const newScale = Math.max(0.5, Math.min(2, 1 + scale / 200));
      meshRef.current.scale.setScalar(newScale);
    },
    onDoubleClick: () => {
      if (interactive) {
        setIsFlipped(!isFlipped);
        onClick?.();
      }
    }
  });

  // Animation frame updates
  useFrame((state) => {
    if (!enableAnimations) return;
    
    setTime(state.clock.getElapsedTime());
    
    if (meshRef.current && !isHovered && interactive) {
      // Subtle floating animation
      meshRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.02;
      
      // Gentle rotation for rare cards
      if (card.rarity && ['epic', 'legendary', 'mythic'].includes(card.rarity)) {
        meshRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.05;
      }
    }
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (material && 'dispose' in material) {
        material.dispose();
      }
    };
  }, [material]);

  // Signal load completion
  useEffect(() => {
    if (onLoad) {
      const timer = setTimeout(onLoad, 100);
      return () => clearTimeout(timer);
    }
  }, [onLoad]);

  return (
    <animated.mesh
      ref={meshRef}
      rotation={rotation as any}
      position={position as any}
      scale={springScale}
      material={material}
      onPointerEnter={() => interactive && setIsHovered(true)}
      onPointerLeave={() => interactive && setIsHovered(false)}
      onClick={() => interactive && onClick?.()}
      {...(interactive ? bind() : {})}
    >
      <planeGeometry args={[2.5, 3.5]} />
    </animated.mesh>
  );
};

export default Card3D;
