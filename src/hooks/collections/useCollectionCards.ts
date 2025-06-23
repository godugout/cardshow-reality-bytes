
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { CollectionCard } from '@/types/collection';

export const useCollectionCards = (collectionId: string) => {
  const { data: cards = [], isLoading, refetch } = useQuery({
    queryKey: ['collection-cards', collectionId],
    queryFn: async () => {
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
      return data as CollectionCard[];
    },
    enabled: !!collectionId
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
