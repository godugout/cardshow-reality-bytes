
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { TradeMessage } from '@/types/trading';

export const useTradeMessages = (tradeId: string) => {
  const channelRef = useRef<any>(null);
  const isSubscribedRef = useRef(false);

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
      try {
        supabase.removeChannel(channelRef.current);
      } catch (error) {
        console.warn('Error removing channel:', error);
      }
      channelRef.current = null;
      isSubscribedRef.current = false;
    }

    // Create new channel with unique name
    const channelName = `trade-messages-${tradeId}-${Date.now()}-${Math.random()}`;
    const channel = supabase.channel(channelName);
    
    channelRef.current = channel;

    channel
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
  }, [tradeId, refetch]);

  return { messages, refetch };
};
