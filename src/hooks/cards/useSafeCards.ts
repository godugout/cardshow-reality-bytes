
import { useState, useCallback, useMemo, useEffect } from 'react';
import { useCardsQuery } from './useCardsQuery';
import { useCardsRealtime } from './useCardsRealtime';
import type { CardFilters } from '@/types/card';

interface SafeCardsState {
  cards: any[];
  isLoading: boolean;
  error: string | null;
  hasInitialized: boolean;
}

export const useSafeCards = (filters: CardFilters = {}) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [safeState, setSafeState] = useState<SafeCardsState>({
    cards: [],
    isLoading: true,
    error: null,
    hasInitialized: false
  });

  const {
    data: cards = [],
    isLoading: queryLoading,
    error: queryError,
    refetch: originalRefetch
  } = useCardsQuery(filters, searchTerm);

  // Update safe state when query state changes
  useEffect(() => {
    setSafeState(prev => ({
      cards: Array.isArray(cards) ? cards : [],
      isLoading: queryLoading,
      error: queryError ? (typeof queryError === 'string' ? queryError : 'Failed to load cards') : null,
      hasInitialized: true
    }));
  }, [cards, queryLoading, queryError]);

  // Create a stable refetch function
  const refetch = useCallback(() => {
    try {
      console.log('useSafeCards: Refetching cards data');
      if (originalRefetch && typeof originalRefetch === 'function') {
        originalRefetch();
      }
    } catch (err) {
      console.error('useSafeCards: Error during refetch:', err);
      setSafeState(prev => ({
        ...prev,
        error: 'Failed to refresh cards'
      }));
    }
  }, [originalRefetch]);

  // Only use realtime if we have initialized successfully and have a working refetch
  const shouldUseRealtime = useMemo(() => {
    return safeState.hasInitialized && 
           !safeState.isLoading && 
           !safeState.error && 
           originalRefetch && 
           typeof originalRefetch === 'function';
  }, [safeState.hasInitialized, safeState.isLoading, safeState.error, originalRefetch]);

  // Always call the hook but conditionally pass the refetch function
  useCardsRealtime(shouldUseRealtime ? refetch : undefined);

  const returnValue = useMemo(() => ({
    cards: safeState.cards,
    isLoading: safeState.isLoading,
    error: safeState.error,
    hasInitialized: safeState.hasInitialized,
    refetch,
    searchTerm,
    setSearchTerm
  }), [safeState, refetch, searchTerm]);

  return returnValue;
};
