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
        
        // Start with a basic query to test if RLS is working
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

        // Apply filters step by step to identify any issues
        if (filters.visibility?.length) {
          console.log('Applying visibility filter:', filters.visibility);
          query = query.in('visibility', filters.visibility);
        }
        
        if (filters.user_id) {
          console.log('Applying user_id filter:', filters.user_id);
          query = query.eq('user_id', filters.user_id);
        }
        
        if (filters.is_featured !== undefined) {
          console.log('Applying is_featured filter:', filters.is_featured);
          query = query.eq('is_featured', filters.is_featured);
        }
        
        if (searchTerm) {
          console.log('Applying search term:', searchTerm);
          query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
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

        // For now, return basic collections without complex joins to test RLS
        const basicCollections = data.map(collection => ({
          ...collection,
          owner: null, // We'll add this back later once basic query works
          is_following: false,
          card_count: 0
        }));

        console.log('Returning basic collections:', basicCollections.length);
        return basicCollections as Collection[];
        
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

  // Real-time subscription - keep it simple for now
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

  return {
    collections,
    isLoading,
    error,
    refetch,
    searchTerm,
    setSearchTerm
  };
};
