
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, Heart, Eye, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getUserInteractions, getTrendingCards, getSimilarCards, getNewReleases, getPopularCards } from '../services/recommendationService';
import type { RecommendationSection } from '../types/recommendationTypes';

export const useRecommendations = () => {
  const { user } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  const { data: recommendations, isLoading, refetch, error } = useQuery({
    queryKey: ['card-recommendations', user?.id, refreshKey],
    queryFn: async (): Promise<RecommendationSection[]> => {
      try {
        // Get user's favorites and viewing history to personalize recommendations
        const userInteractions = user ? await getUserInteractions(user.id) : null;
        
        // Get different recommendation categories
        const [trending, similar, newReleases, popular] = await Promise.all([
          getTrendingCards(),
          getSimilarCards(userInteractions),
          getNewReleases(),
          getPopularCards()
        ]);

        return [
          {
            title: "Trending Now",
            description: "Cards gaining popularity this week",
            icon: TrendingUp,
            badge: "Hot",
            cards: trending
          },
          {
            title: user ? "Based on Your Interests" : "Popular Choices",
            description: user ? "Cards similar to ones you've viewed" : "Cards loved by the community",
            icon: Heart,
            badge: "For You",
            cards: similar
          },
          {
            title: "Fresh Releases",
            description: "Just dropped this week",
            icon: Eye,
            badge: "New",
            cards: newReleases
          },
          {
            title: "Community Favorites",
            description: "Most collected cards this month",
            icon: Users,
            badge: "Popular",
            cards: popular
          }
        ];
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        return [];
      }
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    refetch();
  };

  return {
    recommendations,
    isLoading,
    error,
    handleRefresh
  };
};
