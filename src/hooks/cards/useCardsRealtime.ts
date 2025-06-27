
import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useCardsRealtime = (refetch: () => void) => {
  // Memoize the refetch callback to prevent re-subscriptions
  const memoizedRefetch = useCallback(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
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
        () => {
          memoizedRefetch();
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIPTION_ERROR') {
          console.error('Failed to subscribe to cards realtime updates');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []); // Remove refetch from dependencies to prevent re-subscriptions
};
