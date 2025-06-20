
import { useState, useCallback } from 'react';

interface GestureState {
  isTracking: boolean;
  startPosition: { x: number; y: number };
  currentPosition: { x: number; y: number };
  gestureType: 'none' | 'drag' | 'pinch' | 'swipe';
}

export const useGestureTracking = () => {
  const [gestureState, setGestureState] = useState<GestureState>({
    isTracking: false,
    startPosition: { x: 0, y: 0 },
    currentPosition: { x: 0, y: 0 },
    gestureType: 'none'
  });

  const startGestureTracking = useCallback((event: PointerEvent | TouchEvent) => {
    const point = 'touches' in event ? event.touches[0] : event;
    setGestureState({
      isTracking: true,
      startPosition: { x: point.clientX, y: point.clientY },
      currentPosition: { x: point.clientX, y: point.clientY },
      gestureType: 'none'
    });
  }, []);

  const updateGestureTracking = useCallback((event: PointerEvent | TouchEvent) => {
    if (!gestureState.isTracking) return;

    const point = 'touches' in event ? event.touches[0] : event;
    const deltaX = point.clientX - gestureState.startPosition.x;
    const deltaY = point.clientY - gestureState.startPosition.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    let gestureType: GestureState['gestureType'] = 'none';
    
    if (distance > 10) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        gestureType = Math.abs(deltaX) > 50 ? 'swipe' : 'drag';
      } else {
        gestureType = 'drag';
      }
    }

    setGestureState(prev => ({
      ...prev,
      currentPosition: { x: point.clientX, y: point.clientY },
      gestureType
    }));
  }, [gestureState.isTracking, gestureState.startPosition]);

  const stopGestureTracking = useCallback(() => {
    setGestureState(prev => ({
      ...prev,
      isTracking: false,
      gestureType: 'none'
    }));
  }, []);

  return {
    gestureState,
    startGestureTracking,
    updateGestureTracking,
    stopGestureTracking
  };
};
