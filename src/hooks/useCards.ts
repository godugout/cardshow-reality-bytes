
import { useState, useCallback } from 'react';
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
    originalRefetch();
  }, [originalRefetch]);

  // Real-time subscription for cards
  useCardsRealtime(refetch);

  return {
    cards,
    isLoading,
    error,
    refetch,
    searchTerm,
    setSearchTerm
  };
};

// Re-export the other hooks for convenience
export { useCardFavorites } from './cards/useCardFavorites';
export { useCardSets } from './cards/useCardSets';
