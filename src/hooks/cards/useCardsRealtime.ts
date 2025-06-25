
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useCardsRealtime = (refetch: () => void) => {
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
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);
};
