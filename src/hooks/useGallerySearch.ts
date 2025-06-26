
import { useMemo } from 'react';
import type { Card } from '@/types/card';

export const useGallerySearch = (cards: Card[], searchQuery: string) => {
  return useMemo(() => {
    if (!searchQuery.trim()) return cards;
    
    const query = searchQuery.toLowerCase().trim();
    
    return cards.filter(card => 
      card.title?.toLowerCase().includes(query) ||
      card.description?.toLowerCase().includes(query) ||
      card.rarity?.toLowerCase().includes(query)
    );
  }, [cards, searchQuery]);
};
