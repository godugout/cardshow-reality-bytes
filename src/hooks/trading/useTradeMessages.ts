
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { TradeMessage } from '@/types/trading';

export const useTradeMessages = (tradeId: string) => {
  const { data: messages = [], refetch } = useQuery({
    queryKey: ['trade-messages', tradeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trade_messages')
        .select('*')
        .eq('trade_id', tradeId)
        .order('timestamp', { ascending: true });

      if (error) throw error;
      
      // Get sender profiles separately
      const messagesWithSenders = await Promise.all(
        (data || []).map(async (message) => {
          const { data: senderProfile } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', message.sender_id)
            .single();

          return {
            ...message,
            sender: senderProfile || null
          };
        })
      );

      return messagesWithSenders as TradeMessage[];
    },
    enabled: !!tradeId,
  });

  // Real-time subscription for messages
  useEffect(() => {
    if (!tradeId) return;

    const channel = supabase
      .channel(`trade-messages-${tradeId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'trade_messages',
          filter: `trade_id=eq.${tradeId}`,
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tradeId, refetch]);

  return { messages, refetch };
};
