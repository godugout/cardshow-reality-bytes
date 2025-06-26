
import { useMemo } from 'react';
import type { Card } from '@/types/card';

export const useCollectionStats = (cards: Card[]) => {
  return useMemo(() => {
    const totalCards = cards.length;
    const uniqueRarities = new Set(cards.map(card => card.rarity).filter(Boolean)).size;
    const totalValue = cards.reduce((sum, card) => sum + (card.current_market_value || 0), 0);

    return {
      totalCards,
      uniqueRarities,
      totalValue
    };
  }, [cards]);
};
