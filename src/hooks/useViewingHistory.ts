
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import type { Card } from '@/types/card';

export const useViewingHistory = (collectionId: string, layoutType: string, selectedCard: Card | null) => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !collectionId) return;

    const updateViewingHistory = async () => {
      try {
        const viewingData = {
          user_id: user.id,
          collection_id: collectionId,
          layout_used: layoutType,
          cards_viewed: selectedCard ? [selectedCard.id] : [],
          last_card_viewed: selectedCard?.id || null,
          viewing_position: { x: 0, y: 0, z: 5 },
          interaction_count: 1
        };

        await supabase
          .from('gallery_viewing_history')
          .upsert(viewingData);
      } catch (error) {
        console.warn('Failed to update viewing history:', error);
      }
    };

    updateViewingHistory();
  }, [user, collectionId, layoutType, selectedCard]);
};
