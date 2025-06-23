
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

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
          user_id: user.id,
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
