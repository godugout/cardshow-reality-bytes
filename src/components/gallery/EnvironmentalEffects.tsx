
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Stars, Cloud } from '@react-three/drei';
import * as THREE from 'three';
import type { EnvironmentTheme } from '@/hooks/useGalleryPreferences';

interface EnvironmentalEffectsProps {
  theme: EnvironmentTheme;
  dominantColors: string[];
  enableParticles: boolean;
}

const EnvironmentalEffects = ({ theme, dominantColors, enableParticles }: EnvironmentalEffectsProps) => {
  const particlesRef = useRef<THREE.Points>(null);
  const cloudsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.001;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.0005;
    }
  });

  const getEnvironmentPreset = () => {
    switch (theme) {
      case 'cosmic': return 'night';
      case 'nature': return 'forest';
      case 'light': return 'studio';
      case 'dark': return 'warehouse';
      default: return 'studio';
    }
  };

  const getAmbientColor = () => {
    if (dominantColors.length > 0) {
      return new THREE.Color(dominantColors[0]);
    }
    return new THREE.Color('#ffffff');
  };

  return (
    <>
      {/* Environment Lighting */}
      <Environment preset={getEnvironmentPreset()} background={false} />
      
      {/* Ambient Lighting */}
      <ambientLight intensity={0.3} color={getAmbientColor()} />
      
      {/* Themed Effects */}
      {theme === 'cosmic' && (
        <>
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          {enableParticles && (
            <points ref={particlesRef}>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={1000}
                  array={new Float32Array(
                    Array.from({ length: 3000 }, () => (Math.random() - 0.5) * 100)
                  )}
                  itemSize={3}
                />
              </bufferGeometry>
              <pointsMaterial size={0.1} color="#00C851" transparent opacity={0.6} />
            </points>
          )}
        </>
      )}
      
      {theme === 'nature' && (
        <group ref={cloudsRef}>
          <Cloud position={[-20, 10, -20]} opacity={0.3} speed={0.4} width={20} depth={1.5} />
          <Cloud position={[20, 8, -15]} opacity={0.2} speed={0.3} width={15} depth={1} />
          <Cloud position={[0, 12, -25]} opacity={0.25} speed={0.5} width={25} depth={2} />
        </group>
      )}
      
      {/* Dynamic Fog */}
      <fog attach="fog" args={[getAmbientColor(), 20, 100]} />
      
      {/* Directional Light with Shadows */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
    </>
  );
};

export default EnvironmentalEffects;
