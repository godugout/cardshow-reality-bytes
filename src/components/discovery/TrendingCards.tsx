
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Eye, Heart, Clock } from 'lucide-react';
import CardDisplay from '@/components/cards/CardDisplay';
import { supabase } from '@/integrations/supabase/client';
import type { Card as CardType, ManaCost } from '@/types/card';

// Helper function to transform Supabase data to CardType
const transformToCardType = (data: any): CardType => {
  return {
    ...data,
    mana_cost: (typeof data.mana_cost === 'object' && data.mana_cost !== null) 
      ? data.mana_cost as ManaCost 
      : {} as ManaCost,
    abilities: Array.isArray(data.abilities) ? data.abilities : [],
    is_favorited: false
  } as CardType;
};

const TrendingCards = () => {
  const { data: trendingData, isLoading } = useQuery({
    queryKey: ['trending-cards'],
    queryFn: async () => {
      // Get trending cards from the last 7 days
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      
      const { data: trending } = await supabase
        .from('cards')
        .select('*, creator:profiles(username, avatar_url)')
        .eq('is_public', true)
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('view_count', { ascending: false })
        .limit(12);

      const { data: hottest } = await supabase
        .from('cards')
        .select('*, creator:profiles(username, avatar_url)')
        .eq('is_public', true)
        .order('favorite_count', { ascending: false })
        .limit(8);

      const { data: rising } = await supabase
        .from('cards')
        .select('*, creator:profiles(username, avatar_url)')
        .eq('is_public', true)
        .gte('created_at', new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(8);

      return {
        trending: (trending || []).map(transformToCardType),
        hottest: (hottest || []).map(transformToCardType),
        rising: (rising || []).map(transformToCardType)
      };
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
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

  const sections = [
    {
      title: "Trending This Week",
      description: "Most viewed cards in the last 7 days",
      icon: TrendingUp,
      cards: trendingData?.trending || [],
      badge: "Hot",
      color: "text-red-400"
    },
    {
      title: "Community Favorites",
      description: "Most loved cards by collectors",
      icon: Heart,
      cards: trendingData?.hottest || [],
      badge: "Popular",
      color: "text-pink-400"
    },
    {
      title: "Rising Stars",
      description: "New cards gaining momentum",
      icon: Clock,
      cards: trendingData?.rising || [],
      badge: "Rising",
      color: "text-blue-400"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">What's Trending</h2>
        <p className="text-gray-400">Discover the cards everyone's talking about</p>
      </div>

      {sections.map((section, index) => {
        const Icon = section.icon;
        return (
          <Card key={index} className="bg-gray-800 border-gray-700">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${section.color}`} />
                <CardTitle className="text-white">{section.title}</CardTitle>
                <Badge variant="outline" className={`border-current ${section.color}`}>
                  {section.badge}
                </Badge>
              </div>
              <p className="text-gray-400">{section.description}</p>
            </CardHeader>
            <CardContent>
              {section.cards.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {section.cards.slice(0, 8).map((card, cardIndex) => (
                    <div key={card.id} className="relative">
                      <CardDisplay
                        card={card}
                        size="md"
                        showStats={true}
                      />
                      {cardIndex < 3 && (
                        <Badge 
                          className={`absolute -top-2 -right-2 ${
                            cardIndex === 0 ? 'bg-yellow-500' : 
                            cardIndex === 1 ? 'bg-gray-400' : 'bg-orange-500'
                          }`}
                        >
                          #{cardIndex + 1}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  No {section.title.toLowerCase()} found
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default TrendingCards;
