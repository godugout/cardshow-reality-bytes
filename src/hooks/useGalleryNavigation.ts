
import { useRef, useEffect, useCallback } from 'react';
import type { CardPosition } from '@/utils/galleryLayouts';

export const useGalleryNavigation = (
  cardPositions: CardPosition[], 
  selectedIndex: number, 
  onCardSelect: (index: number) => void
) => {
  const keys = useRef<Set<string>>(new Set());
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      keys.current.add(event.code);
      
      // Prevent default browser behavior for navigation keys
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'KeyA', 'KeyD', 'KeyW', 'KeyS'].includes(event.code)) {
        event.preventDefault();
      }
      
      // Card navigation
      if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
        const newIndex = Math.max(0, selectedIndex - 1);
        onCardSelect(newIndex);
      } else if (event.code === 'ArrowRight' || event.code === 'KeyD') {
        const newIndex = Math.min(cardPositions.length - 1, selectedIndex + 1);
        onCardSelect(newIndex);
      } else if (event.code === 'ArrowUp' || event.code === 'KeyW') {
        // Navigate to card above (for grid layouts)
        const newIndex = Math.max(0, selectedIndex - Math.ceil(Math.sqrt(cardPositions.length)));
        onCardSelect(newIndex);
      } else if (event.code === 'ArrowDown' || event.code === 'KeyS') {
        // Navigate to card below (for grid layouts)
        const newIndex = Math.min(cardPositions.length - 1, selectedIndex + Math.ceil(Math.sqrt(cardPositions.length)));
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
  
  const focusOnCard = useCallback((index: number) => {
    if (index >= 0 && index < cardPositions.length) {
      onCardSelect(index);
    }
  }, [cardPositions.length, onCardSelect]);
  
  const navigateToNext = useCallback(() => {
    const newIndex = Math.min(cardPositions.length - 1, selectedIndex + 1);
    onCardSelect(newIndex);
  }, [cardPositions.length, selectedIndex, onCardSelect]);
  
  const navigateToPrevious = useCallback(() => {
    const newIndex = Math.max(0, selectedIndex - 1);
    onCardSelect(newIndex);
  }, [selectedIndex, onCardSelect]);
  
  return {
    focusOnCard,
    navigateToNext,
    navigateToPrevious,
    currentKeys: keys.current
  };
};
