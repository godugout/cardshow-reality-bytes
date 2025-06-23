
import { useQuery, useEffect } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { TradeOffer, TradeFilters } from '@/types/trading';

export const useTradeOffers = (filters: TradeFilters = {}) => {
  const { user } = useAuth();
  
  const { data: offers = [], isLoading, error, refetch } = useQuery({
    queryKey: ['trade-offers', filters],
    queryFn: async () => {
      if (!user) return [];

      let query = supabase
        .from('trade_offers')
        .select('*')
        .or(`initiator_id.eq.${user.id},recipient_id.eq.${user.id}`)
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
      
      // Get profile data separately
      const tradesWithProfiles = await Promise.all(
        (data || []).map(async (trade) => {
          const [initiatorProfile, recipientProfile] = await Promise.all([
            supabase.from('profiles').select('id, username, avatar_url').eq('id', trade.initiator_id).single(),
            supabase.from('profiles').select('id, username, avatar_url').eq('id', trade.recipient_id).single()
          ]);

          return {
            ...trade,
            initiator: initiatorProfile.data || null,
            recipient: recipientProfile.data || null
          };
        })
      );

      return tradesWithProfiles as TradeOffer[];
    },
    enabled: !!user,
  });

  // Real-time subscription for trade offers
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('trade-offers-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trade_offers',
          filter: `or(initiator_id.eq.${user.id},recipient_id.eq.${user.id})`,
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

  return { offers, isLoading, error, refetch };
};
