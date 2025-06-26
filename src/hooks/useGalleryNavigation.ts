
import { useEffect, useCallback } from 'react';
import { useGalleryPreferences } from './useGalleryPreferences';
import type { CardPosition } from '@/utils/galleryLayouts';

export const useGalleryNavigation = (
  cardPositions: CardPosition[], 
  selectedIndex: number, 
  onCardSelect: (index: number) => void
) => {
  const { preferences } = useGalleryPreferences();
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent default behavior for navigation keys
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
        // Navigate up in grid-like layouts
        const newIndex = Math.max(0, selectedIndex - 5); // Assume 5 cards per row
        onCardSelect(newIndex);
      } else if (event.code === 'ArrowDown' || event.code === 'KeyS') {
        // Navigate down in grid-like layouts
        const newIndex = Math.min(cardPositions.length - 1, selectedIndex + 5);
        onCardSelect(newIndex);
      }
    };
    
    if (!preferences.accessibility_mode) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedIndex, cardPositions.length, onCardSelect, preferences.accessibility_mode]);
  
  const focusOnCard = useCallback((index: number) => {
    if (cardPositions[index]) {
      onCardSelect(index);
    }
  }, [cardPositions, onCardSelect]);
  
  return {
    focusOnCard
  };
};
