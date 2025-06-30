
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseErrorHandler } from '@/hooks/useSupabaseErrorHandler';
import type { CollectionCard } from '@/types/collection';

export const useCollectionCards = (collectionId: string) => {
  const { handleError } = useSupabaseErrorHandler();

  const { data: cards = [], isLoading, refetch } = useQuery({
    queryKey: ['collection-cards', collectionId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('collection_cards')
          .select(`
            *,
            card:cards(
              id,
              title,
              image_url,
              rarity,
              current_market_value
            )
          `)
          .eq('collection_id', collectionId)
          .order('display_order', { ascending: true });
        
        if (error) throw error;
        
        // Ensure we have the quantity field with proper defaults
        const enhancedCards = (data || []).map(card => ({
          ...card,
          quantity: card.quantity || 1,
          notes: card.notes || '',
          added_by: card.added_by || null
        }));
        
        return enhancedCards as CollectionCard[];
      } catch (error) {
        handleError(error, {
          operation: 'fetch_collection_cards',
          table: 'collection_cards'
        });
        throw error;
      }
    },
    enabled: !!collectionId,
    retry: (failureCount, error: any) => {
      if (error?.code === 'PGRST116') return false;
      return failureCount < 2;
    }
  });

  // Real-time subscription for collection cards
  useEffect(() => {
    if (!collectionId) return;

    const channel = supabase
      .channel(`collection-cards-${collectionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'collection_cards',
          filter: `collection_id=eq.${collectionId}`
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [collectionId, refetch]);

  return { cards, isLoading, refetch };
};
