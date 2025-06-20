
import { useRef } from 'react';
import * as THREE from 'three';
import { useAdvanced3DPreferences } from '@/hooks/useAdvanced3DPreferences';
import type { CardRarity } from '@/types/card';

interface Card3DLightingProps {
  rarity: CardRarity;
  isHovered: boolean;
  meshRef: React.RefObject<THREE.Mesh>;
}

const Card3DLighting = ({ rarity, isHovered, meshRef }: Card3DLightingProps) => {
  const { preferences } = useAdvanced3DPreferences();

  if (preferences.qualityPreset !== 'ultra' || !isHovered) {
    return null;
  }

  return (
    <>
      <pointLight
        position={[2, 2, 2]}
        intensity={0.5}
        color={rarity === 'legendary' ? '#FFD700' : '#FFFFFF'}
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
  );
};

export default Card3DLighting;
