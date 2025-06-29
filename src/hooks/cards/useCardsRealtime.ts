
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface UseCardsRealtimeProps {
  refetch?: () => void;
  enabled?: boolean;
}

export const useCardsRealtime = ({ refetch, enabled = true }: UseCardsRealtimeProps = {}) => {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const isSubscribedRef = useRef(false);

  useEffect(() => {
    if (!enabled || !refetch) {
      console.log('useCardsRealtime: Subscription disabled or no refetch function provided');
      return;
    }

    // Clean up existing subscription first
    if (channelRef.current) {
      console.log('useCardsRealtime: Cleaning up existing subscription');
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
      isSubscribedRef.current = false;
    }

    const setupSubscription = async () => {
      try {
        // Create a unique channel name with timestamp to avoid conflicts
        const channelName = `cards-changes-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        console.log(`useCardsRealtime: Creating channel: ${channelName}`);
        
        const channel = supabase.channel(channelName);
        
        channel
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'cards'
            },
            (payload) => {
              console.log('useCardsRealtime: Received change:', payload);
              refetch();
            }
          )
          .on('subscribe', (status) => {
            console.log(`useCardsRealtime: Subscription status: ${status}`);
            if (status === 'SUBSCRIBED') {
              isSubscribedRef.current = true;
            }
          })
          .on('error', (error) => {
            console.error('useCardsRealtime: Subscription error:', error);
          });

        channelRef.current = channel;
        
        // Subscribe only once
        if (!isSubscribedRef.current) {
          console.log('useCardsRealtime: Subscribing to channel');
          channel.subscribe();
        }
      } catch (error) {
        console.error('useCardsRealtime: Error setting up subscription:', error);
      }
    };

    setupSubscription();

    // Cleanup function
    return () => {
      if (channelRef.current) {
        console.log('useCardsRealtime: Cleaning up subscription on unmount');
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
        isSubscribedRef.current = false;
      }
    };
  }, [refetch, enabled]);

  // Return cleanup function for manual cleanup if needed
  return {
    cleanup: () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
        isSubscribedRef.current = false;
      }
    }
  };
};
