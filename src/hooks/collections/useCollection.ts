
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Collection } from '@/types/collection';

export const useCollection = (collectionId: string) => {
  const { data: collection, isLoading, error, refetch } = useQuery({
    queryKey: ['collection', collectionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('collections')
        .select(`
          *,
          owner:profiles(id, username, avatar_url)
        `)
        .eq('id', collectionId)
        .single();
      
      if (error) throw error;
      return data as Collection;
    },
    enabled: !!collectionId
  });

  // Real-time subscription for individual collection
  useEffect(() => {
    if (!collectionId) return;

    const channel = supabase
      .channel(`collection-${collectionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'collections',
          filter: `id=eq.${collectionId}`
        },
        () => {
          refetch();
        }
      )
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

  return { collection, isLoading, error, refetch };
};
