
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { SocialActivity } from '@/types/social';

export const useSocialActivities = (userId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: activities = [], isLoading } = useQuery({
    queryKey: ['social-activities', userId || user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase.rpc('get_activity_feed', {
        user_uuid: userId || user.id,
        limit_count: 50
      });

      if (error) throw error;
      
      return (data as any[]).map(item => ({
        id: item.activity_id,
        user_id: item.user_id,
        username: item.username,
        avatar_url: item.avatar_url,
        activity_type: item.activity_type,
        target_id: item.target_id,
        target_type: item.target_type,
        activity_timestamp: item.activity_timestamp,
        metadata: item.metadata,
        reaction_count: item.reaction_count,
        visibility: 'public' as const,
        featured_status: false,
        created_at: item.activity_timestamp,
        updated_at: item.activity_timestamp
      })) as SocialActivity[];
    },
    enabled: !!user
  });

  const createActivityMutation = useMutation({
    mutationFn: async (activityData: {
      activity_type: string;
      target_id?: string;
      target_type?: string;
      visibility?: 'public' | 'friends' | 'private';
      metadata?: Record<string, any>;
    }) => {
      if (!user) throw new Error('Must be logged in');

      const { data, error } = await supabase
        .from('social_activities')
        .insert({
          ...activityData,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-activities'] });
      toast({
        title: 'Activity shared',
        description: 'Your activity has been shared with the community.',
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
    activities,
    isLoading,
    createActivity: createActivityMutation.mutate,
    isCreatingActivity: createActivityMutation.isPending
  };
};

export const useActivityReactions = (activityId: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const toggleReactionMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Must be logged in');

      // For simplicity, we'll just increment the reaction count
      // In a real app, you'd want a separate reactions table
      const { error } = await supabase
        .from('social_activities')
        .update({ 
          reaction_count: supabase.sql`reaction_count + 1`
        })
        .eq('id', activityId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-activities'] });
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
    toggleReaction: toggleReactionMutation.mutate,
    isToggling: toggleReactionMutation.isPending
  };
};
