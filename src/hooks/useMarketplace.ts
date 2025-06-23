import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { MarketplaceListing, ListingFilters, CreateListingData } from '@/types/marketplace';

export const useMarketplaceListings = (filters: ListingFilters = {}) => {
  const { data: listings = [], isLoading, error, refetch } = useQuery({
    queryKey: ['marketplace-listings', filters],
    queryFn: async () => {
      let query = supabase
        .from('marketplace_listings')
        .select(`
          *,
          card:cards(id, title, image_url, rarity),
          seller_profiles!marketplace_listings_seller_id_fkey(user_id, rating, total_sales, verification_status)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (filters.search) {
        query = query.or(`description.ilike.%${filters.search}%`);
      }

      if (filters.min_price !== undefined) {
        query = query.gte('price', filters.min_price);
      }

      if (filters.max_price !== undefined) {
        query = query.lte('price', filters.max_price);
      }

      if (filters.condition?.length) {
        query = query.in('condition', filters.condition);
      }

      if (filters.listing_type?.length) {
        query = query.in('listing_type', filters.listing_type);
      }

      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      // Get seller profiles with user info
      const listingsWithProfiles = await Promise.all(
        (data || []).map(async (listing) => {
          let profiles = null;
          
          if (listing.seller_profiles?.user_id) {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('username, avatar_url')
              .eq('id', listing.seller_profiles.user_id)
              .single();
            profiles = profileData;
          }

          return {
            ...listing,
            card: listing.card && typeof listing.card === 'object' && 'id' in listing.card
              ? listing.card
              : null,
            seller_profiles: listing.seller_profiles && typeof listing.seller_profiles === 'object' && 'user_id' in listing.seller_profiles
              ? listing.seller_profiles
              : null,
            profiles
          };
        })
      );

      return listingsWithProfiles as MarketplaceListing[];
    },
  });

  return { listings, isLoading, error, refetch };
};

export const useCreateListing = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listingData: CreateListingData) => {
      if (!user) throw new Error('Must be logged in to create listings');

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
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplace-listings'] });
      toast({
        title: 'Listing created',
        description: 'Your card is now listed on the marketplace',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error creating listing',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useWatchListing = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ listingId, isWatching }: { listingId: string; isWatching: boolean }) => {
      if (!user) throw new Error('Must be logged in');

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
            user_id: user.id,
          });
        
        if (error) throw error;
      }
    },
    onSuccess: (_, { isWatching }) => {
      queryClient.invalidateQueries({ queryKey: ['marketplace-listings'] });
      toast({
        title: isWatching ? 'Removed from watchlist' : 'Added to watchlist',
        description: isWatching ? 'Listing removed from your watchlist' : 'You\'ll be notified of updates',
      });
    },
  });
};

export const useSellerProfile = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['seller-profile', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('seller_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user,
  });
};
