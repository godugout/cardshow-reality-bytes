
import { useMemo } from 'react';
import { useTexture, useEnvironment } from '@react-three/drei';
import { MeshStandardMaterial, MeshPhysicalMaterial, ShaderMaterial, Color, Vector2 } from 'three';
import type { CardRarity } from '@/types/card';

// Holographic shader for rare cards
const holographicVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const holographicFragmentShader = `
  uniform sampler2D map;
  uniform float time;
  uniform float intensity;
  uniform vec2 resolution;
  
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  
  vec3 rainbow(float t) {
    vec3 a = vec3(0.5);
    vec3 b = vec3(0.5);
    vec3 c = vec3(1.0);
    vec3 d = vec3(0.263, 0.416, 0.557);
    return a + b * cos(6.28318 * (c * t + d));
  }
  
  void main() {
    vec4 texColor = texture2D(map, vUv);
    
    // Create holographic effect based on viewing angle
    vec3 viewDir = normalize(vViewPosition);
    float fresnel = dot(vNormal, viewDir);
    fresnel = 1.0 - abs(fresnel);
    
    // Rainbow interference pattern
    float wave = sin(vUv.x * 20.0 + time * 2.0) * cos(vUv.y * 15.0 + time * 1.5);
    vec3 hologram = rainbow(wave + fresnel) * intensity * fresnel;
    
    // Blend with original texture
    vec3 finalColor = mix(texColor.rgb, texColor.rgb + hologram, 0.7 * fresnel);
    
    gl_FragColor = vec4(finalColor, texColor.a);
  }
`;

interface CardMaterialProps {
  rarity: CardRarity;
  imageUrl: string;
  quality: 'low' | 'medium' | 'high';
  time: number;
}

export const useCardMaterial = ({ rarity, imageUrl, quality, time }: CardMaterialProps) => {
  const texture = useTexture(imageUrl);
  const envMap = useEnvironment({ preset: 'studio' });

  const material = useMemo(() => {
    // Set texture properties based on quality
    texture.generateMipmaps = quality !== 'low';
    texture.anisotropy = quality === 'high' ? 16 : quality === 'medium' ? 8 : 4;

    switch (rarity) {
      case 'common':
        return new MeshStandardMaterial({
          map: texture,
          roughness: 0.8,
          metalness: 0.1
        });

      case 'uncommon':
        return new MeshStandardMaterial({
          map: texture,
          roughness: 0.6,
          metalness: 0.3,
          envMap: quality !== 'low' ? envMap : undefined
        });

      case 'rare':
        return new ShaderMaterial({
          uniforms: {
            map: { value: texture },
            time: { value: time },
            intensity: { value: 0.8 },
            resolution: { value: new Vector2(512, 512) }
          },
          vertexShader: holographicVertexShader,
          fragmentShader: holographicFragmentShader,
          transparent: true
        });

      case 'epic':
        return new MeshPhysicalMaterial({
          map: texture,
          roughness: 0.1,
          metalness: 0.9,
          envMap,
          reflectivity: 1.0,
          clearcoat: 1.0,
          clearcoatRoughness: 0.1
        });

      case 'legendary':
        return new MeshPhysicalMaterial({
          map: texture,
          roughness: 0.0,
          metalness: 1.0,
          envMap,
          emissive: new Color(0x004411),
          emissiveIntensity: 0.3
        });

      case 'mythic':
        return new MeshPhysicalMaterial({
          map: texture,
          roughness: 0.0,
          metalness: 1.0,
          envMap,
          emissive: new Color(0x440011),
          emissiveIntensity: 0.5,
          transmission: 0.1,
          thickness: 0.5
        });

      default:
        return new MeshStandardMaterial({ map: texture });
    }
  }, [rarity, texture, envMap, quality, time]);

  return material;
};
