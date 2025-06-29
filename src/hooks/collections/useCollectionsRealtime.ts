
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface UseCollectionsRealtimeProps {
  refetch?: () => void;
  enabled?: boolean;
  userId?: string;
}

export const useCollectionsRealtime = ({ 
  refetch, 
  enabled = true, 
  userId 
}: UseCollectionsRealtimeProps = {}) => {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const isSubscribedRef = useRef(false);

  useEffect(() => {
    if (!enabled || !refetch || !userId) {
      console.log('useCollectionsRealtime: Subscription disabled, no refetch function, or no user');
      return;
    }

    // Clean up existing subscription first
    if (channelRef.current) {
      console.log('useCollectionsRealtime: Cleaning up existing subscription');
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
      isSubscribedRef.current = false;
    }

    const setupSubscription = async () => {
      try {
        const channelName = `collections-changes-${userId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        console.log(`useCollectionsRealtime: Creating channel: ${channelName}`);
        
        const channel = supabase.channel(channelName);
        
        channel
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'collections'
            },
            (payload) => {
              console.log('useCollectionsRealtime: Received change:', payload);
              refetch();
            }
          )
          .on('subscribe', (status) => {
            console.log(`useCollectionsRealtime: Subscription status: ${status}`);
            if (status === 'SUBSCRIBED') {
              isSubscribedRef.current = true;
            }
          })
          .on('error', (error) => {
            console.error('useCollectionsRealtime: Subscription error:', error);
          });

        channelRef.current = channel;
        
        if (!isSubscribedRef.current) {
          console.log('useCollectionsRealtime: Subscribing to channel');
          channel.subscribe();
        }
      } catch (error) {
        console.error('useCollectionsRealtime: Error setting up subscription:', error);
      }
    };

    setupSubscription();

    return () => {
      if (channelRef.current) {
        console.log('useCollectionsRealtime: Cleaning up subscription on unmount');
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
        isSubscribedRef.current = false;
      }
    };
  }, [refetch, enabled, userId]);

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
