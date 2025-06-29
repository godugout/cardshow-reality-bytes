
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
        console.log('Fetching collections with user:', user?.id);
        console.log('Filters:', filters);
        
        let query = supabase
          .from('collections')
          .select(`
            id,
            title,
            description,
            user_id,
            visibility,
            cover_image_url,
            template_id,
            is_featured,
            is_group,
            allow_member_card_sharing,
            group_code,
            metadata,
            created_at,
            updated_at
          `)
          .order('updated_at', { ascending: false });

        // Apply search filter
        if (searchTerm) {
          console.log('Applying search term:', searchTerm);
          query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
        }

        // Apply user filter (my collections)
        if (filters.user_id) {
          console.log('Applying user_id filter:', filters.user_id);
          query = query.eq('user_id', filters.user_id);
        }

        // Apply featured filter
        if (filters.is_featured !== undefined) {
          console.log('Applying is_featured filter:', filters.is_featured);
          query = query.eq('is_featured', filters.is_featured);
        }

        console.log('Executing collections query...');
        const { data, error } = await query;
        
        if (error) {
          console.error('Collections query error:', error);
          throw error;
        }

        console.log('Collections fetched successfully:', data?.length || 0, 'items');

        if (!data || data.length === 0) {
          console.log('No collections found, returning empty array');
          return [];
        }

        // Enhance collections with stats using the new helper functions
        const enhancedCollections = await Promise.all(
          data.map(async (collection) => {
            try {
              // Get card count using the safe helper function
              const { data: cardCountData } = await supabase
                .rpc('get_collection_card_count', { collection_uuid: collection.id });
              
              // Get follower count using the safe helper function
              const { data: followerCountData } = await supabase
                .rpc('get_collection_follower_count', { collection_uuid: collection.id });

              // Get owner profile separately to avoid joins
              let owner = null;
              if (collection.user_id) {
                const { data: profileData } = await supabase
                  .from('profiles')
                  .select('id, username, avatar_url')
                  .eq('id', collection.user_id)
                  .single();
                
                if (profileData) {
                  owner = profileData;
                }
              }

              return {
                ...collection,
                owner,
                card_count: cardCountData || 0,
                follower_count: followerCountData || 0,
                is_following: false // This would need a separate query if needed
              };
            } catch (error) {
              console.warn('Error enhancing collection:', collection.id, error);
              return {
                ...collection,
                owner: null,
                card_count: 0,
                follower_count: 0,
                is_following: false
              };
            }
          })
        );

        console.log('Returning enhanced collections:', enhancedCollections.length);
        return enhancedCollections as Collection[];
        
      } catch (error) {
        console.error('Error in useCollectionsList:', error);
        handleError(error, {
          operation: 'fetch_collections',
          table: 'collections'
        });
        throw error;
      }
    },
    enabled: true,
    retry: (failureCount, error: any) => {
      console.log('Query retry attempt:', failureCount, 'Error:', error);
      if (error?.code === 'PGRST116') return false;
      return failureCount < 2;
    }
  });

  // TODO: Real-time subscription temporarily disabled due to crashes
  // Will be re-enabled with improved implementation later
  /*
  useEffect(() => {
    if (!user) return;

    console.log('Setting up realtime subscription for collections');
    const channel = supabase
      .channel('collections-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'collections'
        },
        (payload) => {
          console.log('Realtime collections change:', payload);
          refetch();
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up realtime subscription');
      supabase.removeChannel(channel);
    };
  }, [user, refetch]);
  */

  return {
    collections,
    isLoading,
    error,
    refetch,
    searchTerm,
    setSearchTerm
  };
};
