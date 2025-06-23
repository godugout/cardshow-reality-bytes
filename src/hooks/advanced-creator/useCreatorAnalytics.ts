
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { CreatorAnalytics, PerformanceMetric } from '@/types/advanced-creator';

export const useCreatorAnalytics = (timeRange: 'week' | 'month' | 'quarter' | 'year' = 'month') => {
  const { user } = useAuth();

  const { data: analytics = [], isLoading } = useQuery({
    queryKey: ['creator-analytics', user?.id, timeRange],
    queryFn: async () => {
      if (!user) return [];

      const { data: creatorProfile } = await supabase
        .from('creator_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!creatorProfile) return [];

      const endDate = new Date();
      const startDate = new Date();
      
      switch (timeRange) {
        case 'week':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(endDate.getMonth() - 1);
          break;
        case 'quarter':
          startDate.setMonth(endDate.getMonth() - 3);
          break;
        case 'year':
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
      }

      const { data, error } = await supabase
        .from('creator_analytics')
        .select('*')
        .eq('creator_id', creatorProfile.id)
        .gte('period_start', startDate.toISOString())
        .lte('period_end', endDate.toISOString())
        .order('period_start', { ascending: true });

      if (error) throw error;
      return data as CreatorAnalytics[];
    },
    enabled: !!user
  });

  const { data: performanceScore } = useQuery({
    queryKey: ['creator-performance-score', user?.id],
    queryFn: async () => {
      if (!user) return 0;

      const { data: creatorProfile } = await supabase
        .from('creator_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!creatorProfile) return 0;

      const { data, error } = await supabase.rpc('calculate_creator_performance_score', {
        creator_uuid: creatorProfile.id
      });

      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  const { data: performanceMetrics = [], isLoading: isLoadingMetrics } = useQuery({
    queryKey: ['performance-metrics', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data: creatorProfile } = await supabase
        .from('creator_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!creatorProfile) return [];

      const { data, error } = await supabase
        .from('performance_metrics')
        .select('*')
        .eq('creator_id', creatorProfile.id)
        .gte('timestamp', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('timestamp', { ascending: false });

      if (error) throw error;
      return data as PerformanceMetric[];
    },
    enabled: !!user
  });

  // Calculate derived metrics
  const revenueData = analytics.filter(a => a.metric_type === 'revenue');
  const viewsData = analytics.filter(a => a.metric_type === 'views');
  const engagementData = analytics.filter(a => a.metric_type === 'engagement');

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.metric_value, 0);
  const totalViews = viewsData.reduce((sum, item) => sum + item.metric_value, 0);
  const avgEngagement = engagementData.length > 0 
    ? engagementData.reduce((sum, item) => sum + item.metric_value, 0) / engagementData.length 
    : 0;

  return {
    analytics,
    performanceMetrics,
    performanceScore,
    totalRevenue,
    totalViews,
    avgEngagement,
    isLoading,
    isLoadingMetrics
  };
};
