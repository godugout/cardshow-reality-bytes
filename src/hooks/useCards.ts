
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { Card, CardFilters } from '@/types/card';

export const useCards = (filters: CardFilters = {}) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  const {
    data: cards = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['cards', filters, searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('cards')
        .select(`
          *,
          creator:profiles(id, username, avatar_url),
          set:sets(id, name)
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.rarity?.length) {
        query = query.in('rarity', filters.rarity);
      }
      
      if (filters.card_type?.length) {
        query = query.in('card_type', filters.card_type);
      }
      
      if (filters.creator_id) {
        query = query.eq('creator_id', filters.creator_id);
      }
      
      if (filters.set_id) {
        query = query.eq('set_id', filters.set_id);
      }
      
      if (filters.min_price !== undefined) {
        query = query.gte('current_market_value', filters.min_price);
      }
      
      if (filters.max_price !== undefined) {
        query = query.lte('current_market_value', filters.max_price);
      }
      
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      
      if (error) throw error;

      // Handle favorites separately for authenticated users
      let cardsWithFavorites = data || [];
      
      if (user && data) {
        const { data: favorites } = await supabase
          .from('card_favorites')
          .select('card_id')
          .eq('user_id', user.id);

        const favoriteIds = new Set(favorites?.map(f => f.card_id) || []);
        
        cardsWithFavorites = data.map(card => ({
          ...card,
          is_favorited: favoriteIds.has(card.id)
        }));
      } else if (data) {
        cardsWithFavorites = data.map(card => ({
          ...card,
          is_favorited: false
        }));
      }

      return cardsWithFavorites as Card[];
    },
    enabled: true
  });

  return {
    cards,
    isLoading,
    error,
    refetch,
    searchTerm,
    setSearchTerm
  };
};

export const useCardFavorites = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const toggleFavorite = useMutation({
    mutationFn: async ({ cardId, isFavorited }: { cardId: string; isFavorited: boolean }) => {
      if (!user) throw new Error('Must be logged in to favorite cards');

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
    },
    onSuccess: (_, { isFavorited }) => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
      toast({
        title: isFavorited ? 'Removed from favorites' : 'Added to favorites',
        description: isFavorited ? 'Card removed from your collection' : 'Card added to your favorites',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  return { toggleFavorite };
};

export const useCardSets = () => {
  const { data: sets = [], isLoading } = useQuery({
    queryKey: ['card-sets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sets')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  return { sets, isLoading };
};
