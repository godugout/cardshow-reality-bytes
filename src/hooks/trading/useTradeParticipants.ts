
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { TradeParticipant } from '@/types/trading';

export const useTradeParticipants = (tradeId: string) => {
  const [participants, setParticipants] = useState<TradeParticipant[]>([]);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (!tradeId) return;

    const fetchParticipants = async () => {
      const { data } = await supabase
        .from('trade_participants')
        .select('*')
        .eq('trade_id', tradeId);

      // Get user profiles separately
      const participantsWithUsers = await Promise.all(
        (data || []).map(async (participant) => {
          const { data: userProfile } = await supabase
            .from('profiles')
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
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    // Real-time subscription for presence - fixed to prevent multiple subscriptions
    const channelName = `trade-participants-${tradeId}-${Date.now()}`;
    channelRef.current = supabase
      .channel(channelName)
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
      .subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [tradeId]);

  return { participants };
};
