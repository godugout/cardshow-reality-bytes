
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { CommunityChallenge, ChallengeParticipation, UserAchievement, NotificationData } from '@/types/social';

export const useCommunityAchievements = (userId?: string) => {
  const { user } = useAuth();

  const { data: achievements = [], isLoading } = useQuery({
    queryKey: ['user-achievements', userId || user?.id],
    queryFn: async () => {
      const targetUserId = userId || user?.id;
      if (!targetUserId) return [];

      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', targetUserId)
        .order('unlocked_at', { ascending: false });

      if (error) throw error;
      return data as UserAchievement[];
    },
    enabled: !!(userId || user?.id)
  });

  return { achievements, isLoading };
};

export const useCommunityLeaderboard = (timeframe: 'daily' | 'weekly' | 'monthly' | 'all-time' = 'weekly') => {
  const { data: leaderboard = [], isLoading } = useQuery({
    queryKey: ['community-leaderboard', timeframe],
    queryFn: async () => {
      let query = supabase
        .from('user_profiles')
        .select('id, username, full_name, avatar_url, experience_points, level, is_verified')
        .order('experience_points', { ascending: false })
        .limit(100);

      // In a real implementation, you'd filter by timeframe
      const { data, error } = await query;

      if (error) throw error;
      return data;
    }
  });

  return { leaderboard, isLoading };
};

export const useCommunityStats = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['community-stats'],
    queryFn: async () => {
      const [usersCount, cardsCount, collectionsCount, activitiesCount] = await Promise.all([
        supabase.from('user_profiles').select('id', { count: 'exact', head: true }),
        supabase.from('cards').select('id', { count: 'exact', head: true }),
        supabase.from('collections').select('id', { count: 'exact', head: true }),
        supabase.from('social_activities').select('id', { count: 'exact', head: true })
      ]);

      return {
        totalUsers: usersCount.count || 0,
        totalCards: cardsCount.count || 0,
        totalCollections: collectionsCount.count || 0,
        totalActivities: activitiesCount.count || 0
      };
    }
  });

  return { stats, isLoading };
};

export const useNotifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      
      // Transform the data to match our interface
      return (data || []).map(item => ({
        id: item.id,
        user_id: item.user_id,
        type: item.type,
        title: item.title,
        message: item.message,
        data: item.data || {},
        read: item.read || false,
        created_at: item.created_at,
        expires_at: item.expires_at
      })) as NotificationData[];
    },
    enabled: !!user
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Must be logged in');

      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    isLoading,
    unreadCount,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    isMarkingAsRead: markAsReadMutation.isPending || markAllAsReadMutation.isPending
  };
};
