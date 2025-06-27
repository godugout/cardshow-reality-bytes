import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useCardsRealtime = (refetch: () => void) => {
  const refetchRef = useRef(refetch);
  const channelRef = useRef<any>(null);

  // Keep refetch function up to date
  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  useEffect(() => {
    // Cleanup any existing channel first
    if (channelRef.current) {
      console.log('Cleaning up existing cards realtime channel');
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    console.log('Setting up cards realtime subscription');
    
    const channel = supabase
      .channel('cards-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cards',
          filter: 'is_public=eq.true'
        },
        (payload) => {
          console.log('Cards realtime update received:', payload);
          refetchRef.current();
        }
      )
      .subscribe((status) => {
        console.log('Cards realtime subscription status:', status);
        if (status === 'CLOSED') {
          console.error('Failed to subscribe to cards realtime updates');
        } else if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to cards realtime updates');
        }
      });

    channelRef.current = channel;

    return () => {
      console.log('Cleaning up cards realtime subscription');
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, []); // Empty dependency array to prevent re-subscriptions
};
