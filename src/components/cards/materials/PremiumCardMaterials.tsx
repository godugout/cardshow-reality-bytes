
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture, useEnvironment } from '@react-three/drei';
import { 
  ShaderMaterial, 
  MeshPhysicalMaterial, 
  Color, 
  Vector2, 
  Vector3,
  UniformsUtils,
  UniformsLib
} from 'three';
import { 
  holographicVertexShader, 
  holographicFragmentShader,
  metallicVertexShader,
  metallicFragmentShader,
  energyGlowVertexShader,
  energyGlowFragmentShader
} from '../shaders/PremiumShaders';
import type { CardRarity } from '@/types/card';

interface PremiumCardMaterialProps {
  rarity: CardRarity;
  imageUrl: string;
  quality: 'low' | 'medium' | 'high' | 'ultra';
  enableShaders: boolean;
}

export const usePremiumCardMaterial = ({ 
  rarity, 
  imageUrl, 
  quality,
  enableShaders 
}: PremiumCardMaterialProps) => {
  const texture = useTexture(imageUrl);
  const envMap = useEnvironment({ preset: 'studio' });
  const materialRef = useRef<ShaderMaterial | MeshPhysicalMaterial>(null);
  
  const material = useMemo(() => {
    // Set texture properties based on quality
    texture.generateMipmaps = quality !== 'low';
    texture.anisotropy = {
      low: 2,
      medium: 4,
      high: 8,
      ultra: 16
    }[quality];
    
    // Fallback to standard materials if shaders disabled
    if (!enableShaders || quality === 'low') {
      return new MeshPhysicalMaterial({
        map: texture,
        roughness: 0.3,
        metalness: rarity === 'legendary' || rarity === 'mythic' ? 0.8 : 0.1,
        envMap: quality !== 'low' ? envMap : undefined
      });
    }
    
    switch (rarity) {
      case 'rare':
      case 'epic':
        // Holographic shader
        return new ShaderMaterial({
          uniforms: {
            ...UniformsLib.lights,
            map: { value: texture },
            time: { value: 0 },
            intensity: { value: rarity === 'epic' ? 1.2 : 0.8 },
            resolution: { value: new Vector2(512, 512) },
            cameraPosition: { value: new Vector3() }
          },
          vertexShader: holographicVertexShader,
          fragmentShader: holographicFragmentShader,
          transparent: true,
          lights: true
        });
        
      case 'legendary':
        // Metallic chrome shader
        return new ShaderMaterial({
          uniforms: {
            map: { value: texture },
            envMap: { value: envMap },
            metalness: { value: 0.95 },
            roughness: { value: 0.05 },
            time: { value: 0 },
            color: { value: new Color(1, 0.8, 0.2) }
          },
          vertexShader: metallicVertexShader,
          fragmentShader: metallicFragmentShader,
          transparent: true
        });
        
      case 'mythic':
        // Energy glow shader
        return new ShaderMaterial({
          uniforms: {
            map: { value: texture },
            time: { value: 0 },
            glowColor: { value: new Color(0.2, 1, 0.8) },
            intensity: { value: 1.5 },
            pulseSpeed: { value: 3.0 }
          },
          vertexShader: energyGlowVertexShader,
          fragmentShader: energyGlowFragmentShader,
          transparent: true
        });
        
      default:
        // Enhanced standard material for common/uncommon
        return new MeshPhysicalMaterial({
          map: texture,
          roughness: 0.6,
          metalness: 0.2,
          envMap,
          clearcoat: rarity === 'uncommon' ? 0.5 : 0,
          clearcoatRoughness: 0.1
        });
    }
  }, [rarity, texture, envMap, quality, enableShaders]);
  
  // Animate shader uniforms
  useFrame((state) => {
    if (!materialRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    if ('uniforms' in materialRef.current) {
      const uniforms = materialRef.current.uniforms;
      
      if (uniforms.time) {
        uniforms.time.value = time;
      }
      
      if (uniforms.cameraPosition) {
        uniforms.cameraPosition.value.copy(state.camera.position);
      }
    }
  });
  
  if (material) {
    (material as any).ref = materialRef;
  }
  
  return material;
};
