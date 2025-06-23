
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { UserRelationship } from '@/types/social';

export const useUserRelationships = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: following = [], isLoading: isLoadingFollowing } = useQuery({
    queryKey: ['user-following', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_relationships')
        .select(`
          *,
          following:user_profiles!user_relationships_following_id_fkey(
            id, username, full_name, avatar_url, is_verified
          )
        `)
        .eq('follower_id', user.id)
        .eq('relationship_type', 'follow');

      if (error) throw error;
      return data as (UserRelationship & { following: any })[];
    },
    enabled: !!user
  });

  const { data: followers = [], isLoading: isLoadingFollowers } = useQuery({
    queryKey: ['user-followers', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_relationships')
        .select(`
          *,
          follower:user_profiles!user_relationships_follower_id_fkey(
            id, username, full_name, avatar_url, is_verified
          )
        `)
        .eq('following_id', user.id)
        .eq('relationship_type', 'follow');

      if (error) throw error;
      return data as (UserRelationship & { follower: any })[];
    },
    enabled: !!user
  });

  const followUserMutation = useMutation({
    mutationFn: async (userIdToFollow: string) => {
      if (!user) throw new Error('Must be logged in');

      const { data, error } = await supabase
        .from('user_relationships')
        .insert({
          follower_id: user.id,
          following_id: userIdToFollow,
          relationship_type: 'follow'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-following'] });
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
      toast({
        title: 'Following user',
        description: 'You are now following this user.',
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

  const unfollowUserMutation = useMutation({
    mutationFn: async (userIdToUnfollow: string) => {
      if (!user) throw new Error('Must be logged in');

      const { error } = await supabase
        .from('user_relationships')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', userIdToUnfollow)
        .eq('relationship_type', 'follow');

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-following'] });
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
      toast({
        title: 'Unfollowed user',
        description: 'You are no longer following this user.',
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

  const isFollowing = (userId: string) => {
    return following.some(rel => rel.following_id === userId);
  };

  return {
    following,
    followers,
    isLoadingFollowing,
    isLoadingFollowers,
    followUser: followUserMutation.mutate,
    unfollowUser: unfollowUserMutation.mutate,
    isFollowing,
    isFollowingUser: followUserMutation.isPending,
    isUnfollowingUser: unfollowUserMutation.isPending
  };
};

export const useBlockUser = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const blockUserMutation = useMutation({
    mutationFn: async (userIdToBlock: string) => {
      if (!user) throw new Error('Must be logged in');

      // First remove any existing follow relationship
      await supabase
        .from('user_relationships')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', userIdToBlock);

      // Then create block relationship
      const { data, error } = await supabase
        .from('user_relationships')
        .insert({
          follower_id: user.id,
          following_id: userIdToBlock,
          relationship_type: 'block'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-following'] });
      toast({
        title: 'User blocked',
        description: 'This user has been blocked.',
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
    blockUser: blockUserMutation.mutate,
    isBlocking: blockUserMutation.isPending
  };
};
