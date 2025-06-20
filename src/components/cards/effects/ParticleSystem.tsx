
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, BufferGeometry, BufferAttribute, PointsMaterial, AdditiveBlending } from 'three';
import type { CardRarity } from '@/types/card';

interface ParticleSystemProps {
  rarity: CardRarity;
  enabled: boolean;
  count?: number;
  area?: [number, number, number];
}

const ParticleSystem = ({ 
  rarity, 
  enabled, 
  count = 100, 
  area = [3, 4, 1] 
}: ParticleSystemProps) => {
  const pointsRef = useRef<Points>(null);
  
  const { positions, velocities, sizes, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    
    // Particle behavior based on rarity
    const config = {
      common: { speed: 0.01, size: 0.02, color: [1, 1, 1] },
      uncommon: { speed: 0.015, size: 0.025, color: [0.7, 0.9, 1] },
      rare: { speed: 0.02, size: 0.03, color: [1, 0.8, 0.2] },
      epic: { speed: 0.025, size: 0.035, color: [0.8, 0.2, 1] },
      legendary: { speed: 0.03, size: 0.04, color: [1, 0.2, 0.2] },
      mythic: { speed: 0.035, size: 0.05, color: [0.2, 1, 0.8] }
    };
    
    const particleConfig = config[rarity] || config.common;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Random positions within area
      positions[i3] = (Math.random() - 0.5) * area[0];
      positions[i3 + 1] = (Math.random() - 0.5) * area[1];
      positions[i3 + 2] = (Math.random() - 0.5) * area[2];
      
      // Random velocities
      velocities[i3] = (Math.random() - 0.5) * particleConfig.speed;
      velocities[i3 + 1] = Math.random() * particleConfig.speed;
      velocities[i3 + 2] = (Math.random() - 0.5) * particleConfig.speed;
      
      // Particle sizes
      sizes[i] = particleConfig.size * (0.5 + Math.random() * 0.5);
      
      // Particle colors with variation
      colors[i3] = particleConfig.color[0] * (0.8 + Math.random() * 0.2);
      colors[i3 + 1] = particleConfig.color[1] * (0.8 + Math.random() * 0.2);
      colors[i3 + 2] = particleConfig.color[2] * (0.8 + Math.random() * 0.2);
    }
    
    return { positions, velocities, sizes, colors };
  }, [rarity, count, area]);
  
  const geometry = useMemo(() => {
    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(positions, 3));
    geo.setAttribute('size', new BufferAttribute(sizes, 1));
    geo.setAttribute('color', new BufferAttribute(colors, 3));
    return geo;
  }, [positions, sizes, colors]);
  
  useFrame((state) => {
    if (!enabled || !pointsRef.current) return;
    
    const time = state.clock.getElapsedTime();
    const positionAttribute = pointsRef.current.geometry.getAttribute('position') as BufferAttribute;
    const positions = positionAttribute.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Update positions
      positions[i3] += velocities[i3];
      positions[i3 + 1] += velocities[i3 + 1];
      positions[i3 + 2] += velocities[i3 + 2];
      
      // Wrap around boundaries
      if (positions[i3] > area[0] / 2) positions[i3] = -area[0] / 2;
      if (positions[i3] < -area[0] / 2) positions[i3] = area[0] / 2;
      if (positions[i3 + 1] > area[1] / 2) positions[i3 + 1] = -area[1] / 2;
      if (positions[i3 + 2] > area[2] / 2) positions[i3 + 2] = -area[2] / 2;
      if (positions[i3 + 2] < -area[2] / 2) positions[i3 + 2] = area[2] / 2;
      
      // Add floating motion
      positions[i3 + 1] += Math.sin(time * 2 + i * 0.1) * 0.001;
    }
    
    positionAttribute.needsUpdate = true;
  });
  
  if (!enabled) return null;
  
  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        blending={AdditiveBlending}
        sizeAttenuation={true}
      />
    </points>
  );
};

export default ParticleSystem;
