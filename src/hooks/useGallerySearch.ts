
import { useMemo } from 'react';
import type { Card } from '@/types/card';

export const useGallerySearch = (cards: Card[], searchQuery: string) => {
  return useMemo(() => {
    if (!searchQuery) return cards;
    return cards.filter(card => 
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.rarity?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [cards, searchQuery]);
};
