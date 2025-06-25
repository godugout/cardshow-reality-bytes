
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseErrorHandler } from '@/hooks/useSupabaseErrorHandler';
import type { TradeOffer, TradeFilters } from '@/types/trading';

export const useTradeOffers = (userId?: string, filters: TradeFilters = {}) => {
  const { handleError } = useSupabaseErrorHandler();
  
  const { data: offers = [], isLoading, error, refetch } = useQuery({
    queryKey: ['trade-offers', userId, filters],
    queryFn: async () => {
      if (!userId) return [];

      try {
        let query = supabase
          .from('trade_offers')
          .select('*')
          .or(`initiator_id.eq.${userId},recipient_id.eq.${userId}`)
          .order('created_at', { ascending: false });

        if (filters.status?.length) {
          query = query.in('status', filters.status);
        }

        if (filters.initiator_id) {
          query = query.eq('initiator_id', filters.initiator_id);
        }

        if (filters.recipient_id) {
          query = query.eq('recipient_id', filters.recipient_id);
        }

        const { data, error } = await query;
        if (error) throw error;
        
        // Get profile data separately using maybeSingle to handle missing profiles
        const tradesWithProfiles = await Promise.all(
          (data || []).map(async (trade) => {
            try {
              const [initiatorProfile, recipientProfile] = await Promise.all([
                supabase
                  .from('user_profiles')
                  .select('id, username, avatar_url')
                  .eq('id', trade.initiator_id)
                  .maybeSingle(),
                supabase
                  .from('user_profiles')
                  .select('id, username, avatar_url')
                  .eq('id', trade.recipient_id)
                  .maybeSingle()
              ]);

              return {
                ...trade,
                initiator: initiatorProfile.data || { 
                  id: trade.initiator_id, 
                  username: 'Unknown User', 
                  avatar_url: null 
                },
                recipient: recipientProfile.data || { 
                  id: trade.recipient_id, 
                  username: 'Unknown User', 
                  avatar_url: null 
                }
              };
            } catch (profileError) {
              console.warn('Error fetching profile for trade:', trade.id, profileError);
              return {
                ...trade,
                initiator: { 
                  id: trade.initiator_id, 
                  username: 'Unknown User', 
                  avatar_url: null 
                },
                recipient: { 
                  id: trade.recipient_id, 
                  username: 'Unknown User', 
                  avatar_url: null 
                }
              };
            }
          })
        );

        return tradesWithProfiles as TradeOffer[];
      } catch (error) {
        handleError(error as any, {
          operation: 'fetch trade offers',
          table: 'trade_offers',
          userId
        });
        return [];
      }
    },
    enabled: !!userId,
    retry: 2,
    staleTime: 30000, // 30 seconds
  });

  // Real-time subscription for trade offers
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('trade-offers-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trade_offers',
          filter: `or(initiator_id.eq.${userId},recipient_id.eq.${userId})`,
        },
        (payload) => {
          console.log('Trade offer change:', payload);
          refetch();
        }
      )
      .subscribe((status) => {
        // Fixed: Check for 'SUBSCRIPTION_ERROR' status correctly
        if (status !== 'SUBSCRIBED') {
          console.error('Failed to subscribe to trade offers changes. Status:', status);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, refetch]);

  return { offers, isLoading, error, refetch };
};
