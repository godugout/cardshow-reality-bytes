
import * as THREE from 'three';
import type { Card } from '@/types/card';

export interface CardPosition {
  card: Card;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: number;
}

export const calculateCircularLayout = (cards: Card[], radius: number = 8): CardPosition[] => {
  return cards.map((card, index) => {
    const angle = (index / cards.length) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = Math.sin(index * 0.1) * 0.5; // Slight vertical variation
    
    return {
      card,
      position: new THREE.Vector3(x, y, z),
      rotation: new THREE.Euler(0, angle + Math.PI, 0),
      scale: 1
    };
  });
};

export const calculateGalleryWallLayout = (cards: Card[]): CardPosition[] => {
  const columns = Math.ceil(Math.sqrt(cards.length));
  const rows = Math.ceil(cards.length / columns);
  const spacing = 3;
  
  return cards.map((card, index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);
    
    const x = (col - (columns - 1) / 2) * spacing;
    const y = ((rows - 1) / 2 - row) * spacing;
    const z = -5;
    
    return {
      card,
      position: new THREE.Vector3(x, y, z),
      rotation: new THREE.Euler(0, 0, 0),
      scale: 1
    };
  });
};

export const calculateSpiralLayout = (cards: Card[], radius: number = 6): CardPosition[] => {
  return cards.map((card, index) => {
    const t = index / cards.length;
    const angle = t * Math.PI * 8; // Multiple spirals
    const r = radius * (0.5 + t * 0.5);
    const x = Math.cos(angle) * r;
    const z = Math.sin(angle) * r;
    const y = t * 10 - 5; // Vertical progression
    
    return {
      card,
      position: new THREE.Vector3(x, y, z),
      rotation: new THREE.Euler(0, angle, 0),
      scale: 0.8 + t * 0.4
    };
  });
};

export const calculateGridLayout = (cards: Card[]): CardPosition[] => {
  const size = Math.ceil(Math.pow(cards.length, 1/3)); // 3D cube
  const spacing = 3;
  
  return cards.map((card, index) => {
    const x = (index % size) - (size - 1) / 2;
    const y = Math.floor((index / size) % size) - (size - 1) / 2;
    const z = Math.floor(index / (size * size)) - Math.floor(Math.pow(cards.length, 1/3)) / 2;
    
    return {
      card,
      position: new THREE.Vector3(x * spacing, y * spacing, z * spacing),
      rotation: new THREE.Euler(
        Math.random() * 0.2 - 0.1,
        Math.random() * Math.PI * 2,
        Math.random() * 0.2 - 0.1
      ),
      scale: 1
    };
  });
};

export const calculateRandomScatterLayout = (cards: Card[], bounds: number = 10): CardPosition[] => {
  const positions: THREE.Vector3[] = [];
  const minDistance = 2.5;
  
  return cards.map((card) => {
    let position: THREE.Vector3;
    let attempts = 0;
    
    do {
      position = new THREE.Vector3(
        (Math.random() - 0.5) * bounds * 2,
        (Math.random() - 0.5) * bounds,
        (Math.random() - 0.5) * bounds * 2
      );
      attempts++;
    } while (
      attempts < 50 && 
      positions.some(pos => pos.distanceTo(position) < minDistance)
    );
    
    positions.push(position);
    
    return {
      card,
      position,
      rotation: new THREE.Euler(
        Math.random() * 0.4 - 0.2,
        Math.random() * Math.PI * 2,
        Math.random() * 0.4 - 0.2
      ),
      scale: 0.8 + Math.random() * 0.4
    };
  });
};
