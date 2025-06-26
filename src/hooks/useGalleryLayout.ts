
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

export type GalleryLayoutType = 'circular' | 'gallery_wall' | 'spiral' | 'grid' | 'random_scatter';

export const useGalleryLayout = (cards: Card[], layoutType: GalleryLayoutType): CardPosition[] => {
  return useMemo((): CardPosition[] => {
    if (!cards || cards.length === 0) return [];
    
    try {
      switch (layoutType) {
        case 'gallery_wall':
          return calculateGalleryWallLayout(cards);
        case 'spiral':
          return calculateSpiralLayout(cards);
        case 'grid':
          return calculateGridLayout(cards);
        case 'random_scatter':
          return calculateRandomScatterLayout(cards);
        case 'circular':
        default:
          return calculateCircularLayout(cards);
      }
    } catch (error) {
      console.warn('Failed to calculate gallery layout:', error);
      // Fallback to simple circular layout
      return calculateCircularLayout(cards);
    }
  }, [cards, layoutType]);
};
