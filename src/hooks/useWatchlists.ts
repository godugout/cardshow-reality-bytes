
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type UserWatchlist = Database['public']['Tables']['user_watchlists']['Row'];

interface CreateWatchlistData {
  name: string;
  search_criteria: Record<string, any>;
  alert_conditions?: Record<string, any>;
  alert_enabled?: boolean;
}

export const useWatchlists = () => {
  const { user } = useAuth();

  const { data: watchlists = [], isLoading, refetch } = useQuery({
    queryKey: ['user-watchlists', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_watchlists')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as UserWatchlist[];
    },
    enabled: !!user,
  });

  return { watchlists, isLoading, refetch };
};

export const useCreateWatchlist = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (watchlistData: CreateWatchlistData) => {
      if (!user) throw new Error('Must be logged in to create watchlists');

      const { data, error } = await supabase
        .from('user_watchlists')
        .insert({
          ...watchlistData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-watchlists'] });
      toast({
        title: 'Watchlist created',
        description: 'Your watchlist has been created successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error creating watchlist',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteWatchlist = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (watchlistId: string) => {
      const { error } = await supabase
        .from('user_watchlists')
        .delete()
        .eq('id', watchlistId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-watchlists'] });
      toast({
        title: 'Watchlist deleted',
        description: 'Your watchlist has been deleted',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error deleting watchlist',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
