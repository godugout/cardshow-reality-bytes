
import { useState, useCallback, useRef } from 'react';
import { useSpring } from '@react-spring/web';

interface UseCardPhysicsInteractionsProps {
  onTap?: () => void;
  onDoubleTap?: () => void;
  onLongPress?: () => void;
  enableHaptics?: boolean;
}

export const useCardPhysicsInteractions = ({
  onTap,
  onDoubleTap,
  onLongPress,
  enableHaptics = true
}: UseCardPhysicsInteractionsProps = {}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const longPressTimer = useRef<NodeJS.Timeout>();
  const tapCount = useRef(0);
  const tapTimer = useRef<NodeJS.Timeout>();
  
  // Physics-based spring animations
  const [cardSpring, cardApi] = useSpring(() => ({
    scale: 1,
    rotateX: 0,
    rotateY: 0,
    translateZ: 0,
    shadow: 0,
    config: {
      tension: 400,
      friction: 30,
      mass: 0.8
    }
  }));

  const triggerHaptic = useCallback((intensity: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!enableHaptics || !('vibrate' in navigator)) return;
    
    const patterns = {
      light: 10,
      medium: 25,
      heavy: 50
    };
    
    navigator.vibrate(patterns[intensity]);
  }, [enableHaptics]);

  const handleMouseEnter = useCallback((event: React.MouseEvent) => {
    setIsHovered(true);
    
    cardApi.start({
      scale: 1.02,
      translateZ: 8,
      shadow: 1,
      config: { tension: 300, friction: 25 }
    });
  }, [cardApi]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setIsPressed(false);
    setMousePosition({ x: 0, y: 0 });
    
    cardApi.start({
      scale: 1,
      rotateX: 0,
      rotateY: 0,
      translateZ: 0,
      shadow: 0,
      config: { tension: 250, friction: 30 }
    });
  }, [cardApi]);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!isHovered || isPressed) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = (event.clientX - centerX) / (rect.width / 2);
    const mouseY = (event.clientY - centerY) / (rect.height / 2);
    
    setMousePosition({ x: mouseX, y: mouseY });
    
    // Subtle 3D tilt effect
    cardApi.start({
      rotateY: mouseX * 8,
      rotateX: -mouseY * 8,
      config: { tension: 400, friction: 40 }
    });
  }, [isHovered, isPressed, cardApi]);

  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    setIsPressed(true);
    triggerHaptic('light');
    
    cardApi.start({
      scale: 0.98,
      translateZ: 2,
      shadow: 0.5,
      config: { tension: 500, friction: 35 }
    });
    
    // Start long press timer
    longPressTimer.current = setTimeout(() => {
      triggerHaptic('heavy');
      onLongPress?.();
    }, 500);
    
    event.preventDefault();
  }, [cardApi, triggerHaptic, onLongPress]);

  const handleMouseUp = useCallback(() => {
    setIsPressed(false);
    
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    
    cardApi.start({
      scale: isHovered ? 1.02 : 1,
      translateZ: isHovered ? 8 : 0,
      shadow: isHovered ? 1 : 0,
      config: { tension: 400, friction: 30 }
    });
    
    // Handle tap/double tap
    tapCount.current += 1;
    
    if (tapTimer.current) {
      clearTimeout(tapTimer.current);
    }
    
    tapTimer.current = setTimeout(() => {
      if (tapCount.current === 1) {
        triggerHaptic('medium');
        onTap?.();
      } else if (tapCount.current === 2) {
        triggerHaptic('heavy');
        onDoubleTap?.();
      }
      tapCount.current = 0;
    }, 300);
  }, [cardApi, isHovered, triggerHaptic, onTap, onDoubleTap]);

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
    triggerHaptic('medium');
    
    cardApi.start({
      scale: 1.05,
      translateZ: 16,
      shadow: 2,
      config: { tension: 200, friction: 20 }
    });
  }, [cardApi, triggerHaptic]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    
    cardApi.start({
      scale: 1,
      rotateX: 0,
      rotateY: 0,
      translateZ: 0,
      shadow: 0,
      config: { tension: 250, friction: 25 }
    });
  }, [cardApi]);

  return {
    cardSpring,
    isHovered,
    isPressed,
    isDragging,
    mousePosition,
    handlers: {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onMouseMove: handleMouseMove,
      onMouseDown: handleMouseDown,
      onMouseUp: handleMouseUp,
      onDragStart: handleDragStart,
      onDragEnd: handleDragEnd
    }
  };
};
