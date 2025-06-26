
import { useRef, useEffect, useCallback } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useGalleryPreferences } from './useGalleryPreferences';
import * as THREE from 'three';

export const useGalleryNavigation = (cardPositions: any[], selectedIndex: number, onCardSelect: (index: number) => void) => {
  const { camera } = useThree();
  const { preferences } = useGalleryPreferences();
  
  const targetPosition = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());
  const currentVelocity = useRef(new THREE.Vector3());
  const keys = useRef<Set<string>>(new Set());
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      keys.current.add(event.code);
      
      // Card navigation
      if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
        const newIndex = Math.max(0, selectedIndex - 1);
        onCardSelect(newIndex);
      } else if (event.code === 'ArrowRight' || event.code === 'KeyD') {
        const newIndex = Math.min(cardPositions.length - 1, selectedIndex + 1);
        onCardSelect(newIndex);
      }
    };
    
    const handleKeyUp = (event: KeyboardEvent) => {
      keys.current.delete(event.code);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [selectedIndex, cardPositions.length, onCardSelect]);
  
  // Smooth camera movement
  useFrame((state, delta) => {
    if (cardPositions.length === 0) return;
    
    const selectedCard = cardPositions[selectedIndex];
    if (!selectedCard) return;
    
    // Calculate target position (offset from card)
    const cardPos = selectedCard.position;
    const offset = new THREE.Vector3(0, 1, 4);
    targetPosition.current.copy(cardPos).add(offset);
    targetLookAt.current.copy(cardPos);
    
    // Handle WASD movement
    const moveSpeed = preferences.navigation_speed * 5 * delta;
    const forward = new THREE.Vector3();
    const right = new THREE.Vector3();
    
    camera.getWorldDirection(forward);
    right.crossVectors(forward, camera.up).normalize();
    
    if (keys.current.has('KeyW')) {
      targetPosition.current.add(forward.clone().multiplyScalar(moveSpeed));
    }
    if (keys.current.has('KeyS')) {
      targetPosition.current.add(forward.clone().multiplyScalar(-moveSpeed));
    }
    if (keys.current.has('KeyA')) {
      targetPosition.current.add(right.clone().multiplyScalar(-moveSpeed));
    }
    if (keys.current.has('KeyD')) {
      targetPosition.current.add(right.clone().multiplyScalar(moveSpeed));
    }
    
    // Smooth camera interpolation
    const lerpFactor = preferences.reduced_motion ? 0.1 : 0.05;
    camera.position.lerp(targetPosition.current, lerpFactor);
    
    // Look at target
    const lookAtTarget = new THREE.Vector3();
    lookAtTarget.copy(camera.position).add(camera.getWorldDirection(new THREE.Vector3()));
    lookAtTarget.lerp(targetLookAt.current, lerpFactor);
    camera.lookAt(lookAtTarget);
  });
  
  const focusOnCard = useCallback((index: number) => {
    if (cardPositions[index]) {
      onCardSelect(index);
    }
  }, [cardPositions, onCardSelect]);
  
  return {
    focusOnCard
  };
};
