
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { TradeParticipant } from '@/types/trading';

export const useTradeParticipants = (tradeId: string) => {
  const [participants, setParticipants] = useState<TradeParticipant[]>([]);

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

    // Real-time subscription for presence
    const channel = supabase
      .channel(`trade-participants-${tradeId}`)
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
      supabase.removeChannel(channel);
    };
  }, [tradeId]);

  return { participants };
};
