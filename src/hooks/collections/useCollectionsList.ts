
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useSupabaseErrorHandler } from '@/hooks/useSupabaseErrorHandler';
import type { Collection, CollectionFilters } from '@/types/collection';

export const useCollectionsList = (filters: CollectionFilters = {}) => {
  const { user } = useAuth();
  const { handleError } = useSupabaseErrorHandler();
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  const {
    data: collections = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['collections', filters, searchTerm],
    queryFn: async () => {
      try {
        let query = supabase
          .from('collections')
          .select(`
            *,
            owner:profiles!collections_user_id_fkey(id, username, avatar_url)
          `)
          .order('updated_at', { ascending: false });

        // Apply filters
        if (filters.visibility?.length) {
          query = query.in('visibility', filters.visibility);
        }
        
        if (filters.user_id) {
          query = query.eq('user_id', filters.user_id);
        }
        
        if (filters.is_featured !== undefined) {
          query = query.eq('is_featured', filters.is_featured);
        }
        
        if (searchTerm) {
          query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
        }

        const { data, error } = await query;
        
        if (error) throw error;

        // Get collection stats and follower info
        let collectionsWithExtras = data || [];
        
        if (user && data) {
          try {
            // Get following status
            const { data: following } = await supabase
              .from('collection_followers')
              .select('collection_id')
              .eq('follower_id', user.id);

            const followingIds = new Set(following?.map(f => f.collection_id) || []);
            
            // Get card counts
            const collectionIds = data.map(c => c.id);
            if (collectionIds.length > 0) {
              const { data: cardCounts } = await supabase
                .from('collection_cards')
                .select('collection_id')
                .in('collection_id', collectionIds);

              // Count cards per collection
              const cardCountMap = new Map<string, number>();
              cardCounts?.forEach(cc => {
                const currentCount = cardCountMap.get(cc.collection_id) || 0;
                cardCountMap.set(cc.collection_id, currentCount + 1);
              });
              
              collectionsWithExtras = data.map(collection => ({
                ...collection,
                is_following: followingIds.has(collection.id),
                card_count: cardCountMap.get(collection.id) || 0
              }));
            } else {
              collectionsWithExtras = data.map(collection => ({
                ...collection,
                is_following: followingIds.has(collection.id),
                card_count: 0
              }));
            }
          } catch (extraError) {
            console.warn('Failed to fetch collection extras:', extraError);
            collectionsWithExtras = data.map(collection => ({
              ...collection,
              is_following: false,
              card_count: 0
            }));
          }
        } else if (data) {
          collectionsWithExtras = data.map(collection => ({
            ...collection,
            is_following: false,
            card_count: 0
          }));
        }

        return collectionsWithExtras as Collection[];
      } catch (error) {
        handleError(error, {
          operation: 'fetch_collections',
          table: 'collections'
        });
        throw error;
      }
    },
    enabled: true,
    retry: (failureCount, error: any) => {
      if (error?.code === 'PGRST116') return false;
      return failureCount < 2;
    }
  });

  // Real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('collections-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'collections'
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, refetch]);

  return {
    collections,
    isLoading,
    error,
    refetch,
    searchTerm,
    setSearchTerm
  };
};
