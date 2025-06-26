
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { UserProfile, UserStats } from '@/types/social';

export const useUserProfile = (userId?: string) => {
  const { user } = useAuth();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['user-profile', userId || user?.id],
    queryFn: async () => {
      const targetUserId = userId || user?.id;
      if (!targetUserId) return null;

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', targetUserId)
        .single();

      if (error) throw error;
      
      // Map database columns to UserProfile interface
      return {
        id: data.id,
        username: data.username || '',
        email: data.email || '',
        full_name: data.full_name || null,
        avatar_url: data.avatar_url || null,
        bio: data.bio || null,
        location: data.location || null,
        website_url: data.website_url || null, // Map from website_url column
        cover_image_url: data.cover_image_url || null, // Map from cover_image_url column
        experience_points: data.experience_points || 0,
        level: data.level || 1,
        total_followers: data.total_followers || 0,
        total_following: data.total_following || 0,
        subscription_tier: data.subscription_tier || 'free', // Map from subscription_tier column
        is_verified: data.is_verified || false,
        is_creator: data.is_creator || false,
        created_at: data.created_at,
        updated_at: data.updated_at
      } as UserProfile;
    },
    enabled: !!(userId || user?.id)
  });

  return { profile, isLoading };
};

export const useUserStats = (userId?: string) => {
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['user-stats', userId || user?.id],
    queryFn: async () => {
      const targetUserId = userId || user?.id;
      if (!targetUserId) return null;

      const { data, error } = await supabase.rpc('get_user_stats', {
        user_uuid: targetUserId
      });

      if (error) throw error;
      return data[0] as UserStats;
    },
    enabled: !!(userId || user?.id)
  });

  return { stats, isLoading };
};

export const useUpdateProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: Partial<UserProfile>) => {
      if (!user) throw new Error('Must be logged in');

      const { data, error } = await supabase
        .from('user_profiles')
        .update(profileData)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
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
    updateProfile: updateProfileMutation.mutate,
    isUpdating: updateProfileMutation.isPending
  };
};

export const useSearchUsers = (searchTerm: string) => {
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['search-users', searchTerm],
    queryFn: async () => {
      if (!searchTerm.trim()) return [];

      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, username, full_name, avatar_url')
        .or(`username.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%`)
        .limit(20);

      if (error) throw error;
      return data as UserProfile[];
    },
    enabled: searchTerm.length > 2
  });

  return { users, isLoading };
};
