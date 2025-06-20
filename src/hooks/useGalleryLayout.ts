
import { useMemo } from 'react';
import { 
  calculateCircularLayout,
  calculateGalleryWallLayout,
  calculateSpiralLayout,
  calculateGridLayout,
  calculateRandomScatterLayout,
  type CardPosition
} from '@/utils/galleryLayouts';
import type { Card } from '@/types/card';
import type { GalleryLayoutType } from '@/hooks/useGalleryPreferences';

export const useGalleryLayout = (cards: Card[], layoutType: GalleryLayoutType): CardPosition[] => {
  return useMemo((): CardPosition[] => {
    if (cards.length === 0) return [];
    
    switch (layoutType) {
      case 'gallery_wall':
        return calculateGalleryWallLayout(cards);
      case 'spiral':
        return calculateSpiralLayout(cards);
      case 'grid':
        return calculateGridLayout(cards);
      case 'random_scatter':
        return calculateRandomScatterLayout(cards);
      default:
        return calculateCircularLayout(cards);
    }
  }, [cards, layoutType]);
};
