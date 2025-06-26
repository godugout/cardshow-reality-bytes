
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';
import { useLODSystem } from '@/hooks/useLODSystem';
import { use3DResourceManager } from '@/hooks/use3DResourceManager';
import { optimizedTextureManager } from '@/utils/optimizedTextureManager';
import type { CardPosition } from '@/utils/galleryLayouts';
import type { LODLevel } from '@/hooks/useLODSystem';

interface GalleryCardProps {
  cardPosition: CardPosition;
  isSelected: boolean;
  onClick: () => void;
  lodLevel?: LODLevel;
  shouldRender?: boolean;
}

const GalleryCard = ({ 
  cardPosition, 
  isSelected, 
  onClick, 
  lodLevel = 'medium',
  shouldRender = true 
}: GalleryCardProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { trackGeometry, trackMaterial, trackTexture } = use3DResourceManager();
  
  // LOD-based geometry
  const geometry = useMemo(() => {
    const segments = {
      high: [32, 32],
      medium: [16, 16], 
      low: [8, 8]
    }[lodLevel] as [number, number];
    
    const geom = new THREE.PlaneGeometry(2.5, 3.5, segments[0], segments[1]);
    return trackGeometry(geom);
  }, [lodLevel, trackGeometry]);

  // LOD-based material and texture config
  const material = useMemo(() => {
    const textureConfig = {
      high: { maxSize: 1024, quality: 'high' as const, enableMipmaps: true, anisotropy: 16, format: THREE.RGBAFormat },
      medium: { maxSize: 512, quality: 'medium' as const, enableMipmaps: true, anisotropy: 8, format: THREE.RGBAFormat },
      low: { maxSize: 256, quality: 'low' as const, enableMipmaps: false, anisotropy: 2, format: THREE.RGBFormat }
    }[lodLevel];

    // Create material based on LOD
    const mat = new THREE.MeshStandardMaterial({
      transparent: true,
      alphaTest: 0.1
    });

    // Load texture asynchronously
    optimizedTextureManager.loadTexture(
      cardPosition.card.image_url || '/placeholder.svg',
      textureConfig,
      { priority: isSelected ? 'high' : 'medium', lod: lodLevel }
    ).then(texture => {
      mat.map = trackTexture(texture);
      mat.needsUpdate = true;
    }).catch(error => {
      console.warn('Failed to load card texture:', error);
    });

    return trackMaterial(mat);
  }, [cardPosition.card.image_url, lodLevel, isSelected, trackMaterial, trackTexture]);
  
  // Spring animation for hover and selection effects
  const { scale, position } = useSpring({
    scale: isSelected ? 1.2 : 1,
    position: cardPosition.position.toArray() as [number, number, number],
    config: { 
      tension: lodLevel === 'high' ? 200 : 150, 
      friction: lodLevel === 'high' ? 25 : 30 
    }
  });

  // Reduced animation for lower LOD levels
  useFrame((state) => {
    if (meshRef.current && !isSelected && lodLevel === 'high') {
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime + cardPosition.card.id.length) * 0.002;
    }
  });

  // Don't render if not visible or too far
  if (!shouldRender) return null;

  return (
    <animated.group position={position} scale={scale}>
      <mesh
        ref={meshRef}
        geometry={geometry}
        material={material}
        rotation={cardPosition.rotation.toArray() as [number, number, number]}
        onClick={onClick}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'default'}
        castShadow={lodLevel === 'high'}
        receiveShadow={lodLevel === 'high'}
      />
      
      {/* Selection indicator - only for high LOD */}
      {isSelected && lodLevel === 'high' && (
        <mesh position={[0, 0, 0.01]}>
          <ringGeometry args={[1.4, 1.6, 32]} />
          <meshBasicMaterial color="#00C851" transparent opacity={0.8} />
        </mesh>
      )}
      
      {/* Simplified selection indicator for medium/low LOD */}
      {isSelected && lodLevel !== 'high' && (
        <mesh position={[0, 0, 0.01]}>
          <ringGeometry args={[1.4, 1.6, 16]} />
          <meshBasicMaterial color="#00C851" transparent opacity={0.6} />
        </mesh>
      )}
    </animated.group>
  );
};

export default GalleryCard;
