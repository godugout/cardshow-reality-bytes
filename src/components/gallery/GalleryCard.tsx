
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import type { CardPosition } from '@/utils/galleryLayouts';

interface GalleryCardProps {
  cardPosition: CardPosition;
  isSelected: boolean;
  onClick: () => void;
}

const GalleryCard = ({ cardPosition, isSelected, onClick }: GalleryCardProps) => {
  const meshRef = useRef<Mesh>(null);
  
  // Simple hover animation
  useFrame((state) => {
    if (meshRef.current && isSelected) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group
      position={cardPosition.position}
      rotation={cardPosition.rotation}
      scale={cardPosition.scale}
    >
      {/* Card Mesh */}
      <mesh ref={meshRef} onClick={onClick}>
        <planeGeometry args={[2.5, 3.5]} />
        <meshStandardMaterial 
          color={isSelected ? '#00C851' : '#ffffff'} 
          transparent 
          opacity={0.9}
        />
      </mesh>
      
      {/* Card Image/Texture would go here in a real implementation */}
      {cardPosition.card.image_url && (
        <mesh position={[0, 0, 0.01]} onClick={onClick}>
          <planeGeometry args={[2.4, 3.4]} />
          <meshBasicMaterial 
            color="#333" 
            transparent 
            opacity={0.8}
          />
        </mesh>
      )}
      
      {/* Selection Indicator */}
      {isSelected && (
        <mesh position={[0, 0, -0.01]}>
          <ringGeometry args={[1.3, 1.5, 32]} />
          <meshBasicMaterial color="#00C851" transparent opacity={0.6} />
        </mesh>
      )}
      
      {/* Card Title */}
      <group position={[0, -2, 0.1]}>
        <mesh>
          <planeGeometry args={[2.5, 0.5]} />
          <meshBasicMaterial color="#000" transparent opacity={0.7} />
        </mesh>
      </group>
    </group>
  );
};

export default GalleryCard;
