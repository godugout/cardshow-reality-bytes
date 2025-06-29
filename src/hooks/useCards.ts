
import { useState, useCallback, useMemo } from 'react';
import { useCardsQuery } from './cards/useCardsQuery';
import { useCardsRealtime } from './cards/useCardsRealtime';
import type { CardFilters, Card } from '@/types/card';

// Additional sample cards to supplement the main grid
const additionalSampleCards: Card[] = [
  {
    id: '11',
    title: 'Neon Dreams',
    description: 'Electric visions from a cyberpunk future',
    image_url: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400&h=560&fit=crop',
    creator_id: 'demo',
    rarity: 'rare',
    serial_number: 99,
    total_supply: 800,
    current_market_value: 159.99,
    view_count: 1234,
    favorite_count: 78,
    creator: { id: 'demo', username: 'NeonArtist', avatar_url: undefined }
  },
  {
    id: '12',
    title: 'Vintage Code',
    description: 'Classic programming aesthetics meet modern design',
    image_url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=560&fit=crop',
    creator_id: 'demo',
    rarity: 'uncommon',
    serial_number: 321,
    total_supply: 2000,
    current_market_value: 79.99,
    view_count: 567,
    favorite_count: 29,
    creator: { id: 'demo', username: 'VintageCode', avatar_url: undefined }
  }
];

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

  // Call the realtime hook with proper props object
  const shouldUseRealtime = !isLoading && !error && originalRefetch;
  useCardsRealtime({ 
    refetch: shouldUseRealtime ? refetch : undefined,
    enabled: shouldUseRealtime 
  });

  // If no cards from API, supplement with sample cards for demo
  const finalCards = useMemo(() => {
    const apiCards = Array.isArray(cards) ? cards : [];
    if (apiCards.length === 0) {
      return additionalSampleCards;
    }
    // Append additional sample cards to existing API cards
    return [...apiCards, ...additionalSampleCards];
  }, [cards]);

  const returnValue = useMemo(() => ({
    cards: finalCards,
    isLoading,
    error,
    refetch,
    searchTerm,
    setSearchTerm
  }), [finalCards, isLoading, error, refetch, searchTerm]);

  return returnValue;
};

// Re-export the other hooks for convenience
export { useCardFavorites } from './cards/useCardFavorites';
export { useCardSets } from './cards/useCardSets';
