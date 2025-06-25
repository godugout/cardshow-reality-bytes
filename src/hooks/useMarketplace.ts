
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useSupabaseErrorHandler } from '@/hooks/useSupabaseErrorHandler';
import { useToast } from '@/hooks/use-toast';
import type { MarketplaceListing, CreateListingData } from '@/types/marketplace';

export const useMarketplaceListings = (filters: Record<string, any> = {}) => {
  const { handleError } = useSupabaseErrorHandler();

  const { data: listings = [], isLoading, error, refetch } = useQuery({
    queryKey: ['marketplace-listings', filters],
    queryFn: async () => {
      try {
        let query = supabase
          .from('marketplace_listings')
          .select(`
            *,
            card:cards(
              id,
              title,
              image_url,
              rarity
            ),
            seller_profiles(
              user_id,
              rating,
              total_sales,
              verification_status
            ),
            profiles:seller_profiles!inner(
              user_id,
              profiles!inner(
                username,
                avatar_url
              )
            )
          `)
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        if (filters.search) {
          query = query.or(`card.title.ilike.%${filters.search}%`);
        }

        if (filters.min_price) {
          query = query.gte('price', filters.min_price);
        }

        if (filters.max_price) {
          query = query.lte('price', filters.max_price);
        }

        if (filters.condition?.length) {
          query = query.in('condition', filters.condition);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data as MarketplaceListing[];
      } catch (error) {
        handleError(error, { operation: 'fetch_marketplace_listings' });
        throw error;
      }
    },
    retry: (failureCount, error: any) => {
      if (error?.code === 'PGRST116') return false;
      return failureCount < 2;
    }
  });

  if (error) {
    handleError(error, { operation: 'fetch_marketplace_listings' });
  }

  return { listings, isLoading, error, refetch };
};

export const useCreateListing = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { handleError } = useSupabaseErrorHandler();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listingData: CreateListingData) => {
      if (!user) throw new Error('Must be logged in to create listings');

      try {
        const { data, error } = await supabase
          .from('marketplace_listings')
          .insert({
            ...listingData,
            seller_id: user.id,
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        handleError(error, { 
          operation: 'create_listing',
          table: 'marketplace_listings'
        });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplace-listings'] });
      toast({
        title: 'Listing created',
        description: 'Your card has been listed for sale',
      });
    },
    onError: (error) => {
      console.error('Failed to create listing:', error);
    },
  });
};

export const useWatchListing = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { handleError } = useSupabaseErrorHandler();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ listingId, isWatching }: { listingId: string; isWatching: boolean }) => {
      if (!user) throw new Error('Must be logged in to watch listings');

      try {
        if (isWatching) {
          const { error } = await supabase
            .from('marketplace_watchers')
            .delete()
            .eq('listing_id', listingId)
            .eq('user_id', user.id);
          
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('marketplace_watchers')
            .insert({
              listing_id: listingId,
              user_id: user.id
            });
          
          if (error) throw error;
        }
      } catch (error) {
        handleError(error, {
          operation: isWatching ? 'unwatch_listing' : 'watch_listing',
          table: 'marketplace_watchers'
        });
        throw error;
      }
    },
    onSuccess: (_, { isWatching }) => {
      queryClient.invalidateQueries({ queryKey: ['marketplace-listings'] });
      toast({
        title: isWatching ? 'Removed from watchlist' : 'Added to watchlist',
        description: isWatching ? 'Listing removed from your watchlist' : 'You\'ll be notified of updates',
      });
    },
    onError: (error) => {
      console.error('Failed to update watchlist:', error);
    },
  });
};
