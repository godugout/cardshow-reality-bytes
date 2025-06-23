
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type PortfolioItem = Database['public']['Tables']['portfolio_tracking']['Row'] & {
  card?: {
    id: string;
    title: string;
    image_url: string;
    rarity: string;
  };
};

export const usePortfolio = () => {
  const { user } = useAuth();

  const { data: portfolio = [], isLoading, refetch } = useQuery({
    queryKey: ['portfolio', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('portfolio_tracking')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get card details separately
      const portfolioWithCards = await Promise.all(
        (data || []).map(async (item) => {
          const { data: cardData } = await supabase
            .from('cards')
            .select('id, title, image_url, rarity')
            .eq('id', item.card_id)
            .single();

          return {
            ...item,
            card: cardData || null
          };
        })
      );

      return portfolioWithCards as PortfolioItem[];
    },
    enabled: !!user,
  });

  return { portfolio, isLoading, refetch };
};

export const usePortfolioStats = () => {
  const { portfolio } = usePortfolio();

  const stats = {
    totalValue: portfolio.reduce((sum, item) => sum + (item.current_value || 0) * (item.quantity || 1), 0),
    totalCost: portfolio.reduce((sum, item) => sum + (item.purchase_price || 0) * (item.quantity || 1), 0),
    totalCards: portfolio.reduce((sum, item) => sum + (item.quantity || 1), 0),
    profitLoss: 0,
    profitLossPercentage: 0,
  };

  stats.profitLoss = stats.totalValue - stats.totalCost;
  stats.profitLossPercentage = stats.totalCost > 0 ? (stats.profitLoss / stats.totalCost) * 100 : 0;

  return stats;
};

export const useAddToPortfolio = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      cardId,
      purchasePrice,
      quantity = 1,
      purchaseDate
    }: {
      cardId: string;
      purchasePrice: number;
      quantity?: number;
      purchaseDate?: string;
    }) => {
      if (!user) throw new Error('Must be logged in');

      const { data, error } = await supabase
        .from('portfolio_tracking')
        .insert({
          user_id: user.id,
          card_id: cardId,
          purchase_price: purchasePrice,
          quantity,
          purchase_date: purchaseDate || new Date().toISOString(),
          current_value: purchasePrice, // Initialize with purchase price
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      toast({
        title: 'Added to portfolio',
        description: 'Card has been added to your portfolio',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error adding to portfolio',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
