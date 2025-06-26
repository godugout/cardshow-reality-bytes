
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';
import type { CardPosition } from '@/utils/galleryLayouts';

interface GalleryCardProps {
  cardPosition: CardPosition;
  isSelected: boolean;
  onClick: () => void;
}

const GalleryCard = ({ cardPosition, isSelected, onClick }: GalleryCardProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Spring animation for hover and selection effects
  const { scale, position } = useSpring({
    scale: isSelected ? 1.2 : 1,
    position: cardPosition.position.toArray() as [number, number, number],
    config: { tension: 200, friction: 25 }
  });

  // Gentle floating animation
  useFrame((state) => {
    if (meshRef.current && !isSelected) {
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime + cardPosition.card.id.length) * 0.002;
    }
  });

  return (
    <animated.group position={position} scale={scale}>
      <mesh
        ref={meshRef}
        rotation={cardPosition.rotation.toArray() as [number, number, number]}
        onClick={onClick}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'default'}
      >
        {/* Card geometry - standard trading card proportions */}
        <planeGeometry args={[2.5, 3.5]} />
        
        {/* Card material with image texture */}
        <meshStandardMaterial>
          <primitive 
            object={new THREE.TextureLoader().load(
              cardPosition.card.image_url || '/placeholder.svg'
            )} 
            attach="map" 
          />
        </meshStandardMaterial>
        
        {/* Selection indicator */}
        {isSelected && (
          <mesh position={[0, 0, 0.01]}>
            <ringGeometry args={[1.4, 1.6, 32]} />
            <meshBasicMaterial color="#00C851" transparent opacity={0.8} />
          </mesh>
        )}
      </mesh>
      
      {/* Card title floating above */}
      {isSelected && (
        <group position={[0, 2.2, 0]}>
          {/* This would be replaced with actual 3D text in a full implementation */}
        </group>
      )}
    </animated.group>
  );
};

export default GalleryCard;
