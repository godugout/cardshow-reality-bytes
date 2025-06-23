
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type AuctionBid = Database['public']['Tables']['auction_bids']['Row'] & {
  bidder?: {
    username: string;
    avatar_url?: string;
  };
};

export const useAuctionBids = (auctionId: string) => {
  const { data: bids = [], isLoading, refetch } = useQuery({
    queryKey: ['auction-bids', auctionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('auction_bids')
        .select('*')
        .eq('auction_id', auctionId)
        .order('amount', { ascending: false });

      if (error) throw error;

      // Get bidder profiles separately
      const bidsWithProfiles = await Promise.all(
        (data || []).map(async (bid) => {
          const { data: bidderProfile } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', bid.bidder_id)
            .single();

          return {
            ...bid,
            bidder: bidderProfile || null
          };
        })
      );

      return bidsWithProfiles as AuctionBid[];
    },
    enabled: !!auctionId,
  });

  // Real-time subscription for auction bids
  useEffect(() => {
    if (!auctionId) return;

    const channel = supabase
      .channel(`auction-bids-${auctionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'auction_bids',
          filter: `auction_id=eq.${auctionId}`,
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [auctionId, refetch]);

  return { bids, isLoading, refetch };
};

export const usePlaceBid = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      auctionId, 
      amount, 
      proxyMax 
    }: { 
      auctionId: string; 
      amount: number; 
      proxyMax?: number; 
    }) => {
      if (!user) throw new Error('Must be logged in to place bids');

      const { data, error } = await supabase.rpc('place_bid', {
        p_auction_id: auctionId,
        p_amount: amount,
        p_proxy_max: proxyMax
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['auction-bids', variables.auctionId] });
      queryClient.invalidateQueries({ queryKey: ['marketplace-listings'] });
      toast({
        title: 'Bid placed successfully',
        description: 'Your bid has been placed and is now the highest bid',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error placing bid',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useCurrentHighestBid = (auctionId: string) => {
  const { data: highestBid } = useQuery({
    queryKey: ['highest-bid', auctionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('auction_bids')
        .select('amount, bidder_id')
        .eq('auction_id', auctionId)
        .eq('is_winning_bid', true)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!auctionId,
  });

  return { highestBid };
};
