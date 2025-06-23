
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { CreatorFollow, CreatorActivity } from '@/types/creator-community';

export const useCreatorFollows = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: following = [], isLoading: isLoadingFollowing } = useQuery({
    queryKey: ['creator-follows-following', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Get creator profile
      const { data: creatorProfile } = await supabase
        .from('creator_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!creatorProfile) return [];

      const { data, error } = await supabase
        .from('creator_follows')
        .select(`
          *,
          following:creator_profiles!creator_follows_following_id_fkey(
            id,
            user_profile:user_profiles(username, avatar_url)
          )
        `)
        .eq('follower_id', creatorProfile.id);

      if (error) throw error;
      return data as CreatorFollow[];
    },
    enabled: !!user
  });

  const { data: followers = [], isLoading: isLoadingFollowers } = useQuery({
    queryKey: ['creator-follows-followers', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Get creator profile
      const { data: creatorProfile } = await supabase
        .from('creator_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!creatorProfile) return [];

      const { data, error } = await supabase
        .from('creator_follows')
        .select(`
          *,
          follower:creator_profiles!creator_follows_follower_id_fkey(
            id,
            user_profile:user_profiles(username, avatar_url)
          )
        `)
        .eq('following_id', creatorProfile.id);

      if (error) throw error;
      return data as CreatorFollow[];
    },
    enabled: !!user
  });

  const followCreatorMutation = useMutation({
    mutationFn: async (creatorIdToFollow: string) => {
      if (!user) throw new Error('Must be logged in');

      // Get creator profile
      const { data: creatorProfile } = await supabase
        .from('creator_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!creatorProfile) throw new Error('Creator profile required');

      const { data, error } = await supabase
        .from('creator_follows')
        .insert({
          follower_id: creatorProfile.id,
          following_id: creatorIdToFollow
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creator-follows-following'] });
      toast({
        title: 'Following creator',
        description: 'You are now following this creator.',
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

  const unfollowCreatorMutation = useMutation({
    mutationFn: async (creatorIdToUnfollow: string) => {
      if (!user) throw new Error('Must be logged in');

      // Get creator profile
      const { data: creatorProfile } = await supabase
        .from('creator_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!creatorProfile) throw new Error('Creator profile required');

      const { error } = await supabase
        .from('creator_follows')
        .delete()
        .eq('follower_id', creatorProfile.id)
        .eq('following_id', creatorIdToUnfollow);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creator-follows-following'] });
      toast({
        title: 'Unfollowed creator',
        description: 'You are no longer following this creator.',
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
    following,
    followers,
    isLoadingFollowing,
    isLoadingFollowers,
    followCreator: followCreatorMutation.mutate,
    unfollowCreator: unfollowCreatorMutation.mutate,
    isFollowing: followCreatorMutation.isPending,
    isUnfollowing: unfollowCreatorMutation.isPending
  };
};

export const useCreatorActivityFeed = (creatorId?: string) => {
  const { data: activities = [], isLoading } = useQuery({
    queryKey: ['creator-activity-feed', creatorId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_creator_activity_feed', {
        creator_uuid: creatorId || null,
        limit_count: 50
      });

      if (error) throw error;
      
      // Transform the data to match our CreatorActivity interface
      return (data as any[]).map(item => ({
        id: item.activity_id,
        creator_id: item.creator_id,
        activity_type: item.activity_type,
        activity_data: item.activity_data,
        created_at: item.created_at,
        visibility: 'public' as const,
        creator_username: item.creator_username
      })) as CreatorActivity[];
    }
  });

  return { activities, isLoading };
};
