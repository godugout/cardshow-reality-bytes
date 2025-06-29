
// TODO: Realtime subscriptions temporarily disabled due to crashes
// This file contains the realtime subscription logic for cards
// Will be re-enabled with improved implementation later

/*
import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useCardsRealtime = (refetch?: () => void) => {
  const refetchRef = useRef(refetch);
  const channelRef = useRef<any>(null);
  const isSubscribedRef = useRef(false);

  // Keep refetch function up to date
  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  // Safe refetch function that handles undefined cases
  const safeRefetch = useCallback(() => {
    try {
      if (refetchRef.current && typeof refetchRef.current === 'function') {
        refetchRef.current();
      }
    } catch (error) {
      console.error('useCardsRealtime: Error during refetch:', error);
    }
  }, []);

  useEffect(() => {
    // Don't set up realtime if we don't have a refetch function
    if (!refetch) {
      return;
    }

    // Prevent multiple subscriptions
    if (isSubscribedRef.current) {
      return;
    }

    // Cleanup any existing channel first
    if (channelRef.current) {
      try {
        supabase.removeChannel(channelRef.current);
      } catch (error) {
        console.error('useCardsRealtime: Error cleaning up existing channel:', error);
      }
      channelRef.current = null;
    }

    console.log('Setting up cards realtime subscription');
    
    try {
      const channel = supabase
        .channel(`cards-changes-${Date.now()}`) // Unique channel name
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
            safeRefetch();
          }
        )
        .subscribe((status) => {
          console.log('Cards realtime subscription status:', status);
          if (status === 'SUBSCRIBED') {
            isSubscribedRef.current = true;
            console.log('Successfully subscribed to cards realtime updates');
          } else if (status === 'CLOSED') {
            isSubscribedRef.current = false;
            console.error('Failed to subscribe to cards realtime updates');
          }
        });

      channelRef.current = channel;
    } catch (error) {
      console.error('useCardsRealtime: Error setting up subscription:', error);
    }

    return () => {
      console.log('Cleaning up cards realtime subscription');
      isSubscribedRef.current = false;
      if (channelRef.current) {
        try {
          supabase.removeChannel(channelRef.current);
        } catch (error) {
          console.error('useCardsRealtime: Error cleaning up subscription:', error);
        }
        channelRef.current = null;
      }
    };
  }, [refetch, safeRefetch]);
};
*/

// Temporary no-op implementation
export const useCardsRealtime = (refetch?: () => void) => {
  // TODO: Re-implement realtime subscriptions with better error handling
  console.log('Cards realtime subscriptions temporarily disabled');
};
