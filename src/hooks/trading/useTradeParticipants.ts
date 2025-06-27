
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { TradeParticipant } from '@/types/trading';

export const useTradeParticipants = (tradeId: string) => {
  const [participants, setParticipants] = useState<TradeParticipant[]>([]);
  const channelRef = useRef<any>(null);
  const isSubscribedRef = useRef(false);

  useEffect(() => {
    if (!tradeId) return;

    const fetchParticipants = async () => {
      const { data } = await supabase
        .from('trade_participants')
        .select('*')
        .eq('trade_id', tradeId);

      // Get user profiles from user_profiles table
      const participantsWithUsers = await Promise.all(
        (data || []).map(async (participant) => {
          const { data: userProfile } = await supabase
            .from('user_profiles')
            .select('username, avatar_url')
            .eq('id', participant.user_id)
            .single();

          return {
            ...participant,
            user: userProfile || null
          };
        })
      );

      setParticipants(participantsWithUsers as TradeParticipant[]);
    };

    fetchParticipants();

    // Clean up existing channel first
    if (channelRef.current) {
      try {
        supabase.removeChannel(channelRef.current);
      } catch (error) {
        console.warn('Error removing channel:', error);
      }
      channelRef.current = null;
      isSubscribedRef.current = false;
    }

    // Real-time subscription for presence - fixed to prevent multiple subscriptions
    const channelName = `trade-participants-${tradeId}-${Date.now()}-${Math.random()}`;
    const channel = supabase.channel(channelName);
    
    channelRef.current = channel;

    channel
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trade_participants',
          filter: `trade_id=eq.${tradeId}`,
        },
        () => {
          fetchParticipants();
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          isSubscribedRef.current = true;
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          isSubscribedRef.current = false;
        }
      });

    return () => {
      if (channelRef.current && isSubscribedRef.current) {
        try {
          supabase.removeChannel(channelRef.current);
        } catch (error) {
          console.warn('Error during cleanup:', error);
        }
      }
      channelRef.current = null;
      isSubscribedRef.current = false;
    };
  }, [tradeId]);

  return { participants };
};
