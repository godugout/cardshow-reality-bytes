
import { useState, useCallback, useMemo } from 'react';
import { useCardsQuery } from './cards/useCardsQuery';
import { useCardsRealtime } from './cards/useCardsRealtime';
import type { CardFilters } from '@/types/card';

export const useCards = (filters: CardFilters = {}) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  const {
    data: cards = [],
    isLoading,
    error,
    refetch: originalRefetch
  } = useCardsQuery(filters, searchTerm);

  // Create a stable refetch function that's always defined
  const refetch = useCallback(() => {
    console.log('useCards: Refetching cards data');
    try {
      if (originalRefetch && typeof originalRefetch === 'function') {
        originalRefetch();
      } else {
        console.warn('useCards: originalRefetch is not available');
      }
    } catch (err) {
      console.error('useCards: Error during refetch:', err);
    }
  }, [originalRefetch]);

  // Always call the realtime hook, but pass undefined if refetch isn't ready
  const shouldUseRealtime = !isLoading && !error && originalRefetch;
  useCardsRealtime(shouldUseRealtime ? refetch : undefined);

  const returnValue = useMemo(() => ({
    cards: Array.isArray(cards) ? cards : [],
    isLoading,
    error,
    refetch,
    searchTerm,
    setSearchTerm
  }), [cards, isLoading, error, refetch, searchTerm]);

  return returnValue;
};

// Re-export the other hooks for convenience
export { useCardFavorites } from './cards/useCardFavorites';
export { useCardSets } from './cards/useCardSets';
