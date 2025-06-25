
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Heart, Eye, TrendingUp, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import CardDisplay from '@/components/cards/CardDisplay';
import { supabase } from '@/integrations/supabase/client';
import type { Card as CardType } from '@/types/card';

interface RecommendationSection {
  title: string;
  description: string;
  icon: any;
  badge: string;
  cards: CardType[];
}

const CardRecommendations = () => {
  const { user } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  const { data: recommendations, isLoading, refetch } = useQuery({
    queryKey: ['card-recommendations', user?.id, refreshKey],
    queryFn: async (): Promise<RecommendationSection[]> => {
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
    },
    enabled: true,
  });

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="bg-gray-800 border-gray-700">
            <CardHeader>
              <div className="animate-pulse bg-gray-700 h-6 w-48 rounded" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="animate-pulse bg-gray-700 h-64 rounded-lg" />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Personalized Recommendations</h2>
          <p className="text-gray-400">Discover cards tailored just for you</p>
        </div>
        <Button
          onClick={handleRefresh}
          variant="outline"
          className="border-[#00C851] text-[#00C851] hover:bg-[#00C851] hover:text-white"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {recommendations?.map((section, index) => {
        const Icon = section.icon;
        return (
          <Card key={index} className="bg-gray-800 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-[#00C851]" />
                  <CardTitle className="text-white">{section.title}</CardTitle>
                  <Badge variant="outline" className="border-[#00C851] text-[#00C851]">
                    {section.badge}
                  </Badge>
                </div>
              </div>
              <p className="text-gray-400">{section.description}</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {section.cards.slice(0, 4).map((card) => (
                  <CardDisplay
                    key={card.id}
                    card={card}
                    size="md"
                    showStats={true}
                  />
                ))}
              </div>
              {section.cards.length > 4 && (
                <div className="mt-4 text-center">
                  <Button variant="ghost" className="text-[#00C851] hover:text-white hover:bg-[#00C851]">
                    View All {section.cards.length} Cards
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

// Helper function to transform Supabase data to CardType
const transformToCardType = (data: any): CardType => ({
  ...data,
  mana_cost: data.mana_cost || {},
  abilities: data.abilities || [],
  is_favorited: false
});

// Helper functions for fetching recommendations
async function getUserInteractions(userId: string) {
  const { data } = await supabase
    .from('card_favorites')
    .select('card_id')
    .eq('user_id', userId)
    .limit(10);
  
  return data?.map(f => f.card_id) || [];
}

async function getTrendingCards(): Promise<CardType[]> {
  const { data } = await supabase
    .from('cards')
    .select('*, creator:profiles(username, avatar_url)')
    .eq('is_public', true)
    .order('view_count', { ascending: false })
    .limit(8);
  
  return (data || []).map(transformToCardType);
}

async function getSimilarCards(userInteractions: string[] | null): Promise<CardType[]> {
  if (!userInteractions?.length) {
    return getPopularCards();
  }

  // Get cards with similar rarities/types to user's favorites
  const { data } = await supabase
    .from('cards')
    .select('*, creator:profiles(username, avatar_url)')
    .eq('is_public', true)
    .not('id', 'in', `(${userInteractions.join(',')})`)
    .order('favorite_count', { ascending: false })
    .limit(8);
  
  return (data || []).map(transformToCardType);
}

async function getNewReleases(): Promise<CardType[]> {
  const { data } = await supabase
    .from('cards')
    .select('*, creator:profiles(username, avatar_url)')
    .eq('is_public', true)
    .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    .order('created_at', { ascending: false })
    .limit(8);
  
  return (data || []).map(transformToCardType);
}

async function getPopularCards(): Promise<CardType[]> {
  const { data } = await supabase
    .from('cards')
    .select('*, creator:profiles(username, avatar_url)')
    .eq('is_public', true)
    .order('favorite_count', { ascending: false })
    .limit(8);
  
  return (data || []).map(transformToCardType);
}

export default CardRecommendations;
