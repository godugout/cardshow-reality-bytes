
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseErrorHandler } from '@/hooks/useSupabaseErrorHandler';
import type { Collection } from '@/types/collection';

export const useCollection = (collectionId: string) => {
  const { handleError } = useSupabaseErrorHandler();

  const { data: collection, isLoading, error, refetch } = useQuery({
    queryKey: ['collection', collectionId],
    queryFn: async () => {
      try {
        // First get the collection
        const { data: collectionData, error: collectionError } = await supabase
          .from('collections')
          .select('*')
          .eq('id', collectionId)
          .single();
        
        if (collectionError) throw collectionError;

        // Then get the owner profile separately to avoid complex joins
        let owner = null;
        if (collectionData.user_id) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('id, username, avatar_url')
            .eq('id', collectionData.user_id)
            .single();
          
          if (profileData) {
            owner = profileData;
          }
        }

        return {
          ...collectionData,
          owner
        } as Collection;
      } catch (error) {
        handleError(error, {
          operation: 'fetch_collection',
          table: 'collections'
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
