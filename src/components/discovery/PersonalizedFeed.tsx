
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import CardDisplay from '@/components/cards/CardDisplay';
import { supabase } from '@/integrations/supabase/client';
import { transformToCardType } from '@/utils/cardTransforms';
import { DiscoveryErrorBoundary } from './DiscoveryErrorBoundary';
import type { Card as CardType } from '@/types/card';

interface PersonalizedFeedProps {
  filter: 'new' | 'hot' | 'recommended';
}

const PersonalizedFeed = ({ filter }: PersonalizedFeedProps) => {
  const { user } = useAuth();

  const { data: cards, isLoading, error } = useQuery({
    queryKey: ['personalized-feed', filter, user?.id],
    queryFn: async (): Promise<CardType[]> => {
      try {
        let query = supabase
          .from('cards')
          .select('*, creator:profiles(username, avatar_url)')
          .eq('is_public', true);

        switch (filter) {
          case 'new':
            query = query
              .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
              .order('created_at', { ascending: false });
            break;
          case 'hot':
            query = query
              .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
              .order('view_count', { ascending: false });
            break;
          case 'recommended':
            // For now, show popular cards - can be enhanced with ML later
            query = query.order('favorite_count', { ascending: false });
            break;
        }

        const { data, error } = await query.limit(20);
        
        if (error) throw error;
        
        return (data || []).map(item => {
          try {
            return transformToCardType(item);
          } catch (transformError) {
            console.error('Error transforming card:', transformError, item);
            return null;
          }
        }).filter(Boolean) as CardType[];
      } catch (err) {
        console.error('Error fetching personalized feed:', err);
        throw err;
      }
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (error) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="py-12 text-center">
          <p className="text-red-400 text-lg">Failed to load cards</p>
          <p className="text-gray-400 mt-2">Please try refreshing the page</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-800 h-64 rounded-lg" />
        ))}
      </div>
    );
  }

  if (!cards?.length) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="py-12 text-center">
          <p className="text-gray-400 text-lg">No cards found for this category</p>
          <p className="text-gray-500 mt-2">Check back later for new content</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <DiscoveryErrorBoundary componentName="Personalized Feed">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <DiscoveryErrorBoundary key={card.id} componentName="Card Display">
            <CardDisplay
              card={card}
              size="md"
              showStats={true}
            />
          </DiscoveryErrorBoundary>
        ))}
      </div>
    </DiscoveryErrorBoundary>
  );
};

export default PersonalizedFeed;
