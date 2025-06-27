
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface CardStats {
  views: number;
  favorites: number;
  earnings: number;
  tradeable_cards: number;
  total_cards: number;
}

export const useCardStats = (creatorId?: string) => {
  return useQuery({
    queryKey: ['card-stats', creatorId],
    queryFn: async (): Promise<CardStats> => {
      if (!creatorId) {
        return {
          views: 0,
          favorites: 0,
          earnings: 0,
          tradeable_cards: 0,
          total_cards: 0
        };
      }

      // Get card statistics
      const { data: cards } = await supabase
        .from('cards')
        .select('view_count, favorite_count, is_tradeable, current_market_value')
        .eq('creator_id', creatorId);

      if (!cards) {
        return {
          views: 0,
          favorites: 0,
          earnings: 0,
          tradeable_cards: 0,
          total_cards: 0
        };
      }

      const stats = cards.reduce((acc, card) => ({
        views: acc.views + (card.view_count || 0),
        favorites: acc.favorites + (card.favorite_count || 0),
        earnings: acc.earnings + (card.current_market_value || 0),
        tradeable_cards: acc.tradeable_cards + (card.is_tradeable ? 1 : 0),
        total_cards: acc.total_cards + 1
      }), {
        views: 0,
        favorites: 0,
        earnings: 0,
        tradeable_cards: 0,
        total_cards: 0
      });

      return stats;
    },
    enabled: !!creatorId
  });
};
