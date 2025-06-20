
import { useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import type { Card } from '@/types/card';

export const useViewingHistory = (
  collectionId: string,
  layoutType: string,
  selectedCard?: Card
) => {
  const { user } = useAuth();
  const sessionStartTime = useRef(Date.now());
  const viewedCards = useRef<Set<string>>(new Set());
  const interactionCount = useRef(0);

  // Track card views
  useEffect(() => {
    if (selectedCard) {
      viewedCards.current.add(selectedCard.id);
      interactionCount.current++;
    }
  }, [selectedCard]);

  // Save viewing session on unmount
  useEffect(() => {
    return () => {
      if (!user) return;

      const sessionDuration = Math.floor((Date.now() - sessionStartTime.current) / 1000);
      
      supabase
        .from('gallery_viewing_history')
        .insert({
          user_id: user.id,
          collection_id: collectionId,
          layout_used: layoutType,
          cards_viewed: Array.from(viewedCards.current),
          session_duration: sessionDuration,
          interaction_count: interactionCount.current,
          last_card_viewed: selectedCard?.id || null
        })
        .then(({ error }) => {
          if (error) console.error('Error saving viewing history:', error);
        });
    };
  }, [user, collectionId, layoutType, selectedCard]);

  return {
    markInteraction: () => interactionCount.current++,
    getSessionStats: () => ({
      duration: Math.floor((Date.now() - sessionStartTime.current) / 1000),
      cardsViewed: viewedCards.current.size,
      interactions: interactionCount.current
    })
  };
};
