
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { TradeMessage } from '@/types/trading';

export const useTradeMessages = (tradeId: string) => {
  const channelRef = useRef<any>(null);

  const { data: messages = [], refetch } = useQuery({
    queryKey: ['trade-messages', tradeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trade_messages')
        .select('*')
        .eq('trade_id', tradeId)
        .order('timestamp', { ascending: true });

      if (error) throw error;
      
      // Get sender profiles from user_profiles table
      const messagesWithSenders = await Promise.all(
        (data || []).map(async (message) => {
          const { data: senderProfile } = await supabase
            .from('user_profiles')
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

  // Real-time subscription for messages - fixed to prevent multiple subscriptions
  useEffect(() => {
    if (!tradeId) return;

    // Clean up existing channel first
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    // Create new channel with unique name
    const channelName = `trade-messages-${tradeId}-${Date.now()}`;
    channelRef.current = supabase
      .channel(channelName)
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
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [tradeId, refetch]);

  return { messages, refetch };
};
