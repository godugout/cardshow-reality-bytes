
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Eye, Heart, Clock } from 'lucide-react';
import CardDisplay from '@/components/cards/CardDisplay';
import { supabase } from '@/integrations/supabase/client';
import { transformToCardType } from '@/utils/cardTransforms';
import { DiscoveryErrorBoundary } from './DiscoveryErrorBoundary';
import type { Card as CardType } from '@/types/card';

const TrendingCards = () => {
  const { data: trendingData, isLoading, error } = useQuery({
    queryKey: ['trending-cards'],
    queryFn: async () => {
      try {
        // Get trending cards from the last 7 days
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        
        const [trendingResult, hottestResult, risingResult] = await Promise.all([
          supabase
            .from('cards')
            .select('*, creator:profiles(username, avatar_url)')
            .eq('is_public', true)
            .gte('created_at', sevenDaysAgo.toISOString())
            .order('view_count', { ascending: false })
            .limit(12),
          
          supabase
            .from('cards')
            .select('*, creator:profiles(username, avatar_url)')
            .eq('is_public', true)
            .order('favorite_count', { ascending: false })
            .limit(8),
          
          supabase
            .from('cards')
            .select('*, creator:profiles(username, avatar_url)')
            .eq('is_public', true)
            .gte('created_at', new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString())
            .order('created_at', { ascending: false })
            .limit(8)
        ]);

        const transformCards = (data: any[]) => {
          return (data || []).map(item => {
            try {
              return transformToCardType(item);
            } catch (transformError) {
              console.error('Error transforming card:', transformError, item);
              return null;
            }
          }).filter(Boolean) as CardType[];
        };

        return {
          trending: transformCards(trendingResult.data),
          hottest: transformCards(hottestResult.data),
          rising: transformCards(risingResult.data)
        };
      } catch (err) {
        console.error('Error fetching trending cards:', err);
        return {
          trending: [],
          hottest: [],
          rising: []
        };
      }
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (error) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="py-12 text-center">
          <p className="text-red-400 text-lg">Failed to load trending cards</p>
          <p className="text-gray-400 mt-2">Please try refreshing the page</p>
        </CardContent>
      </Card>
    );
  }

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
    <DiscoveryErrorBoundary componentName="Trending Cards">
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
                        <DiscoveryErrorBoundary componentName="Card Display">
                          <CardDisplay
                            card={card}
                            size="md"
                            showStats={true}
                          />
                        </DiscoveryErrorBoundary>
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
    </DiscoveryErrorBoundary>
  );
};

export default TrendingCards;
