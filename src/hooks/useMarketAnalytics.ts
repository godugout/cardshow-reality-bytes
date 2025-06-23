
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type MarketAnalytics = Database['public']['Tables']['market_analytics']['Row'];

export const useMarketAnalytics = (cardId?: string, days: number = 30) => {
  const { data: analytics = [], isLoading } = useQuery({
    queryKey: ['market-analytics', cardId, days],
    queryFn: async () => {
      let query = supabase
        .from('market_analytics')
        .select('*')
        .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('date', { ascending: true });

      if (cardId) {
        query = query.eq('card_id', cardId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as MarketAnalytics[];
    },
  });

  return { analytics, isLoading };
};

export const useTrendingCards = () => {
  const { data: trendingCards = [], isLoading } = useQuery({
    queryKey: ['trending-cards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('market_analytics')
        .select(`
          *,
          card:cards(id, title, image_url, rarity)
        `)
        .gte('date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('volume', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
  });

  return { trendingCards, isLoading };
};

export const useMarketMetrics = () => {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['market-metrics'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('market_analytics')
        .select('*')
        .eq('date', today);

      if (error) throw error;

      const totalVolume = data.reduce((sum, item) => sum + (item.volume || 0), 0);
      const totalTransactions = data.reduce((sum, item) => sum + (item.transactions || 0), 0);
      const avgPrice = data.length > 0 
        ? data.reduce((sum, item) => sum + (item.avg_price || 0), 0) / data.length 
        : 0;

      return {
        totalVolume,
        totalTransactions,
        avgPrice,
        activeCards: data.length
      };
    },
  });

  return { metrics, isLoading };
};
