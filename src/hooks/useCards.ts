
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

  // Memoize the refetch function to prevent unnecessary re-subscriptions
  const refetch = useCallback(() => {
    console.log('useCards: Refetching cards data');
    try {
      originalRefetch();
    } catch (err) {
      console.error('useCards: Error during refetch:', err);
    }
  }, [originalRefetch]);

  // Real-time subscription for cards - only if we have valid filters
  const shouldUseRealtime = useMemo(() => {
    // Don't use realtime if we're still loading or have errors
    return !isLoading && !error;
  }, [isLoading, error]);

  // Conditionally use realtime
  if (shouldUseRealtime) {
    useCardsRealtime(refetch);
  }

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
