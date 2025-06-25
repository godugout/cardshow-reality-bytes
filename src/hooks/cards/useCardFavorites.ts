
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useSupabaseErrorHandler } from '@/hooks/useSupabaseErrorHandler';
import { useToast } from '@/hooks/use-toast';

interface FavoriteMutationData {
  cardId: string;
  isFavorited: boolean;
}

export const useCardFavorites = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { handleError } = useSupabaseErrorHandler();
  const queryClient = useQueryClient();

  const toggleFavorite = useMutation({
    mutationFn: async (data: FavoriteMutationData): Promise<void> => {
      const { cardId, isFavorited } = data;
      if (!user) throw new Error('Must be logged in to favorite cards');

      try {
        if (isFavorited) {
          const { error } = await supabase
            .from('card_favorites')
            .delete()
            .eq('user_id', user.id)
            .eq('card_id', cardId);
          
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('card_favorites')
            .insert({ user_id: user.id, card_id: cardId });
          
          if (error) throw error;
        }
      } catch (error) {
        handleError(error, {
          operation: isFavorited ? 'unfavorite_card' : 'favorite_card',
          table: 'card_favorites'
        });
        throw error;
      }
    },
    onSuccess: (_, { isFavorited }) => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
      toast({
        title: isFavorited ? 'Removed from favorites' : 'Added to favorites',
        description: isFavorited ? 'Card removed from your collection' : 'Card added to your favorites',
      });
    },
    onError: (error) => {
      console.error('Failed to update favorite:', error);
    }
  });

  return { toggleFavorite };
};
