
import { useRef, useCallback } from 'react';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';
import { useAccessibilityFeatures } from '@/hooks/useAccessibilityFeatures';
import { useGestureTracking } from '@/hooks/useGestureTracking';

interface UseMobileCardGesturesProps {
  onTap?: () => void;
  onDoubleTap?: () => void;
  onLongPress?: () => void;
  cardTitle: string;
}

export const useMobileCardGestures = ({
  onTap,
  onDoubleTap,
  onLongPress,
  cardTitle
}: UseMobileCardGesturesProps) => {
  const { triggerHapticFeedback } = useMobileOptimization();
  const { a11yState, announce } = useAccessibilityFeatures();
  const { gestureState, startGestureTracking, updateGestureTracking, stopGestureTracking } = useGestureTracking();
  
  const longPressTimer = useRef<NodeJS.Timeout>();

  const handlePointerDown = useCallback((event: React.PointerEvent) => {
    startGestureTracking(event.nativeEvent);
    triggerHapticFeedback('light');
    
    // Start long press timer
    longPressTimer.current = setTimeout(() => {
      if (onLongPress) {
        triggerHapticFeedback('heavy');
        onLongPress();
        announce(`Long press action for ${cardTitle}`, 'assertive');
      }
    }, 500);
  }, [startGestureTracking, triggerHapticFeedback, onLongPress, cardTitle, announce]);

  const handlePointerMove = useCallback((event: React.PointerEvent) => {
    updateGestureTracking(event.nativeEvent);
  }, [updateGestureTracking]);

  const handlePointerUp = useCallback((event: React.PointerEvent) => {
    stopGestureTracking();
    
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    
    // Handle tap/double tap
    const timeSinceStart = Date.now() - (gestureState.startPosition.x ? Date.now() : Date.now());
    
    if (timeSinceStart < 300) {
      // Quick tap
      triggerHapticFeedback('medium');
      onTap?.();
      announce(`Selected ${cardTitle}`, 'polite');
    }
  }, [stopGestureTracking, gestureState.startPosition.x, triggerHapticFeedback, onTap, cardTitle, announce]);

  const handleDoubleClick = useCallback(() => {
    triggerHapticFeedback('heavy');
    onDoubleTap?.();
    announce(`Double tapped ${cardTitle}`, 'assertive');
  }, [triggerHapticFeedback, onDoubleTap, cardTitle, announce]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onTap?.();
      announce(`Activated ${cardTitle} with keyboard`, 'polite');
    }
  }, [onTap, cardTitle, announce]);

  const handleFocus = useCallback(() => {
    if (a11yState.keyboardNavigation) {
      announce(`Card: ${cardTitle}. No description available.`, 'polite');
    }
  }, [a11yState.keyboardNavigation, cardTitle, announce]);

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleDoubleClick,
    handleKeyDown,
    handleFocus
  };
};
