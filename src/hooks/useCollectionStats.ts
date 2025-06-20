
import { useMemo } from 'react';
import type { Card } from '@/types/card';

export const useCollectionStats = (cards: Card[]) => {
  return useMemo(() => {
    const totalValue = cards.reduce((sum, card) => sum + (card.current_market_value || 0), 0);
    const uniqueRarities = new Set(cards.map(card => card.rarity).filter(Boolean)).size;
    
    return {
      totalCards: cards.length,
      uniqueRarities,
      totalValue
    };
  }, [cards]);
};
