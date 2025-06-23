
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { PlatformAnalytics, ModerationItem, SystemHealth } from '@/types/enterprise';

export const useAdminMetrics = () => {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['admin-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_platform_metrics', { days_back: 30 });
      if (error) throw error;
      return data as {
        metric_type: string;
        current_value: number;
        previous_value: number;
        change_percentage: number;
      }[];
    }
  });

  return { metrics, isLoading };
};

export const useModerationQueue = () => {
  const { data: queue = [], isLoading } = useQuery({
    queryKey: ['moderation-queue'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('moderation_queue')
        .select('*')
        .eq('status', 'pending')
        .order('priority', { ascending: false })
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as ModerationItem[];
    }
  });

  return { queue, isLoading };
};

export const useSystemHealth = () => {
  const { data: health = [], isLoading } = useQuery({
    queryKey: ['system-health'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_health')
        .select('*')
        .gte('recorded_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('recorded_at', { ascending: false });

      if (error) throw error;
      return data as SystemHealth[];
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  return { health, isLoading };
};

export const useUserManagement = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data;
    }
  });

  const suspendUserMutation = useMutation({
    mutationFn: async ({ userId, reason }: { userId: string; reason: string }) => {
      const { error } = await supabase.rpc('log_audit_event', {
        p_action: 'user_suspended',
        p_resource_type: 'user',
        p_resource_id: userId,
        p_new_values: { reason, suspended_at: new Date().toISOString() }
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: 'User suspended',
        description: 'User has been suspended successfully.',
      });
    }
  });

  return { users, isLoading, suspendUser: suspendUserMutation.mutate };
};
