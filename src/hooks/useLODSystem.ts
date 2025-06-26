
import { useState, useEffect, useCallback, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export type LODLevel = 'high' | 'medium' | 'low';

interface LODConfig {
  highDetailDistance: number;
  mediumDetailDistance: number;
  updateFrequency: number; // frames between updates
}

interface CardLOD {
  cardId: string;
  distance: number;
  lodLevel: LODLevel;
  shouldRender: boolean;
}

const DEFAULT_CONFIG: LODConfig = {
  highDetailDistance: 8,
  mediumDetailDistance: 20,
  updateFrequency: 10 // Update every 10 frames
};

export const useLODSystem = (cardPositions: Array<{ card: { id: string }; position: THREE.Vector3 }>, config: Partial<LODConfig> = {}) => {
  const { camera } = useThree();
  const [cardLODs, setCardLODs] = useState<Map<string, CardLOD>>(new Map());
  const frameCountRef = useRef(0);
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  const calculateLOD = useCallback((distance: number): LODLevel => {
    if (distance <= finalConfig.highDetailDistance) return 'high';
    if (distance <= finalConfig.mediumDetailDistance) return 'medium';
    return 'low';
  }, [finalConfig]);

  const updateLODs = useCallback(() => {
    const newLODs = new Map<string, CardLOD>();
    const cameraPosition = camera.position;
    const frustum = new THREE.Frustum();
    const matrix = new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    frustum.setFromProjectionMatrix(matrix);

    cardPositions.forEach(({ card, position }) => {
      const distance = cameraPosition.distanceTo(position);
      const lodLevel = calculateLOD(distance);
      
      // Check if card is in view frustum
      const shouldRender = distance < 50 && frustum.containsPoint(position);

      newLODs.set(card.id, {
        cardId: card.id,
        distance,
        lodLevel,
        shouldRender
      });
    });

    setCardLODs(newLODs);
  }, [cardPositions, camera, calculateLOD]);

  // Update LODs on frame interval
  useFrame(() => {
    frameCountRef.current++;
    if (frameCountRef.current >= finalConfig.updateFrequency) {
      updateLODs();
      frameCountRef.current = 0;
    }
  });

  // Initial calculation
  useEffect(() => {
    updateLODs();
  }, [updateLODs]);

  const getCardLOD = useCallback((cardId: string): CardLOD | undefined => {
    return cardLODs.get(cardId);
  }, [cardLODs]);

  const getVisibleCards = useCallback(() => {
    return Array.from(cardLODs.values()).filter(lod => lod.shouldRender);
  }, [cardLODs]);

  return {
    cardLODs,
    getCardLOD,
    getVisibleCards,
    totalCards: cardPositions.length,
    visibleCards: getVisibleCards().length
  };
};
