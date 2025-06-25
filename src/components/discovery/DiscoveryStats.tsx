
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Eye, Heart, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const DiscoveryStats = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['discovery-stats'],
    queryFn: async () => {
      const [totalCards, totalViews, totalFavorites, recentCards] = await Promise.all([
        supabase.from('cards').select('id', { count: 'exact' }).eq('is_public', true),
        supabase.from('cards').select('view_count').eq('is_public', true),
        supabase.from('card_favorites').select('id', { count: 'exact' }),
        supabase.from('cards').select('id', { count: 'exact' })
          .eq('is_public', true)
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      ]);

      const totalViewCount = totalViews.data?.reduce((sum, card) => sum + (card.view_count || 0), 0) || 0;

      return {
        totalCards: totalCards.count || 0,
        totalViews: totalViewCount,
        totalFavorites: totalFavorites.count || 0,
        recentCards: recentCards.count || 0
      };
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-800 rounded-lg h-24" />
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Cards',
      value: stats?.totalCards?.toLocaleString() || '0',
      icon: Zap,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Total Views',
      value: stats?.totalViews?.toLocaleString() || '0',
      icon: Eye,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Total Favorites',
      value: stats?.totalFavorites?.toLocaleString() || '0',
      icon: Heart,
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/10'
    },
    {
      title: 'New This Week',
      value: stats?.recentCards?.toLocaleString() || '0',
      icon: TrendingUp,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DiscoveryStats;
