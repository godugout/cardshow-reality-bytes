
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useSupabaseErrorHandler } from '@/hooks/useSupabaseErrorHandler';
import { useToast } from '@/hooks/use-toast';
import type { Card, CardFilters } from '@/types/card';

export const useCards = (filters: CardFilters = {}) => {
  const { user } = useAuth();
  const { handleError } = useSupabaseErrorHandler();
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  const {
    data: cards = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['cards', filters, searchTerm],
    queryFn: async () => {
      try {
        let query = supabase
          .from('cards')
          .select('*')
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

        // Get creator and set info separately to avoid complex joins
        let cardsWithDetails: any[] = data || [];
        
        if (data && data.length > 0) {
          // Get creators
          const creatorIds = [...new Set(data.map(c => c.creator_id).filter(Boolean))];
          const setIds = [...new Set(data.map(c => c.set_id).filter(Boolean))];
          
          const [profilesResult, setsResult] = await Promise.all([
            creatorIds.length > 0 ? supabase
              .from('profiles')
              .select('id, username, avatar_url')
              .in('id', creatorIds) : Promise.resolve({ data: [] }),
            setIds.length > 0 ? supabase
              .from('sets')
              .select('id, name')
              .in('id', setIds) : Promise.resolve({ data: [] })
          ]);

          // Create lookup maps
          const profileMap = new Map<string, any>();
          (profilesResult.data || []).forEach(profile => {
            profileMap.set(profile.id, profile);
          });

          const setMap = new Map<string, any>();
          (setsResult.data || []).forEach(set => {
            setMap.set(set.id, set);
          });
          
          cardsWithDetails = data.map(card => ({
            ...card,
            creator: card.creator_id ? profileMap.get(card.creator_id) : null,
            set: card.set_id ? setMap.get(card.set_id) : null
          }));
        }

        // Handle favorites separately for authenticated users
        let finalCards: any[] = cardsWithDetails;
        
        if (user && cardsWithDetails.length > 0) {
          try {
            const { data: favorites } = await supabase
              .from('card_favorites')
              .select('card_id')
              .eq('user_id', user.id);

            const favoriteIds = new Set(favorites?.map(f => f.card_id) || []);
            
            finalCards = cardsWithDetails.map(card => ({
              ...card,
              is_favorited: favoriteIds.has(card.id)
            }));
          } catch (favError) {
            console.warn('Failed to fetch favorites:', favError);
            finalCards = cardsWithDetails.map(card => ({
              ...card,
              is_favorited: false
            }));
          }
        } else if (cardsWithDetails.length > 0) {
          finalCards = cardsWithDetails.map(card => ({
            ...card,
            is_favorited: false
          }));
        }

        return finalCards as Card[];
      } catch (error) {
        handleError(error, { 
          operation: 'fetch_cards',
          table: 'cards'
        });
        throw error;
      }
    },
    enabled: true,
    retry: (failureCount, error: any) => {
      if (error?.code === 'PGRST116') return false;
      return failureCount < 2;
    }
  });

  // Real-time subscription for cards
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
  const { handleError } = useSupabaseErrorHandler();
  const queryClient = useQueryClient();

  const toggleFavorite = useMutation({
    mutationFn: async ({ cardId, isFavorited }: { cardId: string; isFavorited: boolean }) => {
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
      // Fix: Use explicit type annotation to prevent deep type instantiation
      queryClient.invalidateQueries({ queryKey: ['cards'] } as const);
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

export const useCardSets = () => {
  const { handleError } = useSupabaseErrorHandler();

  const { data: sets = [], isLoading } = useQuery({
    queryKey: ['card-sets'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('sets')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data;
      } catch (error) {
        handleError(error, {
          operation: 'fetch_sets',
          table: 'sets'
        });
        throw error;
      }
    }
  });

  return { sets, isLoading };
};
