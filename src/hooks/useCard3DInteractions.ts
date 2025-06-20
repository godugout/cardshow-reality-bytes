
import { useState, useCallback } from 'react';
import { useAdvanced3DPreferences } from '@/hooks/useAdvanced3DPreferences';
import { useGestureTracking } from '@/hooks/useGestureTracking';

interface UseCard3DInteractionsProps {
  interactive: boolean;
  onFlip?: () => void;
  onClick?: () => void;
}

export const useCard3DInteractions = ({ 
  interactive, 
  onFlip, 
  onClick 
}: UseCard3DInteractionsProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const { preferences } = useAdvanced3DPreferences();
  const { startGestureTracking, stopGestureTracking } = useGestureTracking();
  
  // Mouse/touch tracking for parallax
  const handlePointerMove = useCallback((event: any) => {
    if (!interactive || !isHovered) return;
    
    const rect = event.target.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    
    setMousePosition({ x, y });
  }, [interactive, isHovered]);
  
  // Gesture handling
  const handlePointerDown = useCallback((event: any) => {
    if (!interactive) return;
    event.stopPropagation();
    startGestureTracking(event);
  }, [interactive, startGestureTracking]);
  
  const handlePointerUp = useCallback(() => {
    if (!interactive) return;
    stopGestureTracking();
  }, [interactive, stopGestureTracking]);
  
  const handleDoubleClick = useCallback(() => {
    if (!interactive) return;
    setIsFlipped(!isFlipped);
    onFlip?.();
    
    // Haptic feedback (mobile)
    if (preferences.enableHaptics && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }, [interactive, isFlipped, onFlip, preferences.enableHaptics]);

  const handleClick = useCallback(() => {
    if (interactive) onClick?.();
  }, [interactive, onClick]);

  const handlePointerEnter = useCallback(() => {
    if (interactive) setIsHovered(true);
  }, [interactive]);

  const handlePointerLeave = useCallback(() => {
    if (interactive) {
      setIsHovered(false);
      setMousePosition({ x: 0, y: 0 });
    }
  }, [interactive]);

  return {
    isHovered,
    isFlipped,
    mousePosition,
    handlePointerMove,
    handlePointerDown,
    handlePointerUp,
    handleDoubleClick,
    handleClick,
    handlePointerEnter,
    handlePointerLeave
  };
};
