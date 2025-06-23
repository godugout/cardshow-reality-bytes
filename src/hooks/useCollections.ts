
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { Collection, CollectionFilters, CollectionCard } from '@/types/collection';

export const useCollections = (filters: CollectionFilters = {}) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  const {
    data: collections = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['collections', filters, searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('collections')
        .select(`
          *,
          owner:profiles(id, username, avatar_url)
        `)
        .order('updated_at', { ascending: false });

      // Apply filters
      if (filters.visibility?.length) {
        query = query.in('visibility', filters.visibility);
      }
      
      if (filters.user_id) {
        query = query.eq('user_id', filters.user_id);
      }
      
      if (filters.is_featured !== undefined) {
        query = query.eq('is_featured', filters.is_featured);
      }
      
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      
      if (error) throw error;

      // Get collection stats and follower info
      let collectionsWithExtras = data || [];
      
      if (user && data) {
        // Get following status
        const { data: following } = await supabase
          .from('collection_followers')
          .select('collection_id')
          .eq('follower_id', user.id);

        const followingIds = new Set(following?.map(f => f.collection_id) || []);
        
        // Get card counts
        const collectionIds = data.map(c => c.id);
        if (collectionIds.length > 0) {
          const { data: cardCounts } = await supabase
            .from('collection_cards')
            .select('collection_id')
            .in('collection_id', collectionIds);

          // Count cards per collection
          const cardCountMap = new Map<string, number>();
          cardCounts?.forEach(cc => {
            const currentCount = cardCountMap.get(cc.collection_id) || 0;
            cardCountMap.set(cc.collection_id, currentCount + 1);
          });
          
          collectionsWithExtras = data.map(collection => ({
            ...collection,
            is_following: followingIds.has(collection.id),
            card_count: cardCountMap.get(collection.id) || 0
          }));
        } else {
          collectionsWithExtras = data.map(collection => ({
            ...collection,
            is_following: followingIds.has(collection.id),
            card_count: 0
          }));
        }
      } else if (data) {
        collectionsWithExtras = data.map(collection => ({
          ...collection,
          is_following: false,
          card_count: 0
        }));
      }

      return collectionsWithExtras as Collection[];
    },
    enabled: true
  });

  // Real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('collections-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'collections'
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, refetch]);

  return {
    collections,
    isLoading,
    error,
    refetch,
    searchTerm,
    setSearchTerm
  };
};

export const useCollection = (collectionId: string) => {
  const { user } = useAuth();

  const { data: collection, isLoading, error, refetch } = useQuery({
    queryKey: ['collection', collectionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('collections')
        .select(`
          *,
          owner:profiles(id, username, avatar_url)
        `)
        .eq('id', collectionId)
        .single();
      
      if (error) throw error;
      return data as Collection;
    },
    enabled: !!collectionId
  });

  // Real-time subscription for individual collection
  useEffect(() => {
    if (!collectionId) return;

    const channel = supabase
      .channel(`collection-${collectionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'collections',
          filter: `id=eq.${collectionId}`
        },
        () => {
          refetch();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'collection_cards',
          filter: `collection_id=eq.${collectionId}`
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [collectionId, refetch]);

  return { collection, isLoading, error, refetch };
};

export const useCollectionCards = (collectionId: string) => {
  const { data: cards = [], isLoading, refetch } = useQuery({
    queryKey: ['collection-cards', collectionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('collection_cards')
        .select(`
          *,
          card:cards(
            id,
            title,
            image_url,
            rarity,
            current_market_value
          )
        `)
        .eq('collection_id', collectionId)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as CollectionCard[];
    },
    enabled: !!collectionId
  });

  // Real-time subscription for collection cards
  useEffect(() => {
    if (!collectionId) return;

    const channel = supabase
      .channel(`collection-cards-${collectionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'collection_cards',
          filter: `collection_id=eq.${collectionId}`
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [collectionId, refetch]);

  return { cards, isLoading, refetch };
};

export const useCollectionMutations = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createCollection = useMutation({
    mutationFn: async (data: {
      title: string;
      description?: string;
      visibility?: 'public' | 'private' | 'shared';
      template_id?: string;
    }) => {
      if (!user) throw new Error('Must be logged in');

      const { data: collection, error } = await supabase
        .from('collections')
        .insert({
          ...data,
          user_id: user.id, // Changed from owner_id to user_id
          visibility: data.visibility || 'private'
        })
        .select()
        .single();
      
      if (error) throw error;
      return collection;
    },
    onSuccess: (collection) => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      toast({
        title: 'Collection created',
        description: `"${collection.title}" has been created successfully.`,
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

  const updateCollection = useMutation({
    mutationFn: async (data: {
      id: string;
      title?: string;
      description?: string;
      visibility?: 'public' | 'private' | 'shared';
      cover_image_url?: string;
    }) => {
      const { data: collection, error } = await supabase
        .from('collections')
        .update(data)
        .eq('id', data.id)
        .select()
        .single();
      
      if (error) throw error;
      return collection;
    },
    onSuccess: (collection) => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      queryClient.invalidateQueries({ queryKey: ['collection', collection.id] });
      toast({
        title: 'Collection updated',
        description: 'Your collection has been updated successfully.',
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

  const deleteCollection = useMutation({
    mutationFn: async (collectionId: string) => {
      const { error } = await supabase
        .from('collections')
        .delete()
        .eq('id', collectionId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      toast({
        title: 'Collection deleted',
        description: 'Your collection has been deleted successfully.',
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

  const addCardToCollection = useMutation({
    mutationFn: async (data: {
      collection_id: string;
      card_id: string;
      quantity?: number;
      notes?: string;
    }) => {
      const { error } = await supabase
        .from('collection_cards')
        .insert({
          ...data,
          quantity: data.quantity || 1,
          added_by: user?.id
        });
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['collection-cards', variables.collection_id] });
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      toast({
        title: 'Card added',
        description: 'Card has been added to your collection.',
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

  const removeCardFromCollection = useMutation({
    mutationFn: async (data: {
      collection_id: string;
      card_id: string;
    }) => {
      const { error } = await supabase
        .from('collection_cards')
        .delete()
        .eq('collection_id', data.collection_id)
        .eq('card_id', data.card_id);
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['collection-cards', variables.collection_id] });
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      toast({
        title: 'Card removed',
        description: 'Card has been removed from your collection.',
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

  const followCollection = useMutation({
    mutationFn: async (collectionId: string) => {
      if (!user) throw new Error('Must be logged in');

      const { error } = await supabase
        .from('collection_followers')
        .insert({
          collection_id: collectionId,
          follower_id: user.id
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      toast({
        title: 'Following collection',
        description: 'You are now following this collection.',
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

  const unfollowCollection = useMutation({
    mutationFn: async (collectionId: string) => {
      if (!user) throw new Error('Must be logged in');

      const { error } = await supabase
        .from('collection_followers')
        .delete()
        .eq('collection_id', collectionId)
        .eq('follower_id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      toast({
        title: 'Unfollowed collection',
        description: 'You are no longer following this collection.',
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

  return {
    createCollection,
    updateCollection,
    deleteCollection,
    addCardToCollection,
    removeCardFromCollection,
    followCollection,
    unfollowCollection
  };
};
