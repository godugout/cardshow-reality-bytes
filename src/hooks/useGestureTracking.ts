
import { useCallback, useRef } from 'react';

interface GestureState {
  isTracking: boolean;
  startPosition: { x: number; y: number };
  currentPosition: { x: number; y: number };
}

export const useGestureTracking = () => {
  const gestureState = useRef<GestureState>({
    isTracking: false,
    startPosition: { x: 0, y: 0 },
    currentPosition: { x: 0, y: 0 }
  });

  const startGestureTracking = useCallback((event: any) => {
    const clientX = event.clientX || (event.touches && event.touches[0]?.clientX) || 0;
    const clientY = event.clientY || (event.touches && event.touches[0]?.clientY) || 0;
    
    gestureState.current = {
      isTracking: true,
      startPosition: { x: clientX, y: clientY },
      currentPosition: { x: clientX, y: clientY }
    };
  }, []);

  const updateGestureTracking = useCallback((event: any) => {
    if (!gestureState.current.isTracking) return;
    
    const clientX = event.clientX || (event.touches && event.touches[0]?.clientX) || 0;
    const clientY = event.clientY || (event.touches && event.touches[0]?.clientY) || 0;
    
    gestureState.current.currentPosition = { x: clientX, y: clientY };
  }, []);

  const stopGestureTracking = useCallback(() => {
    gestureState.current.isTracking = false;
  }, []);

  return {
    startGestureTracking,
    updateGestureTracking,
    stopGestureTracking,
    getGestureState: () => gestureState.current
  };
};
