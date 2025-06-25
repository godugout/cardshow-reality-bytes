
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import CardDisplay from '@/components/cards/CardDisplay';
import { supabase } from '@/integrations/supabase/client';
import type { Card as CardType } from '@/types/card';

interface PersonalizedFeedProps {
  filter: 'new' | 'hot' | 'recommended';
}

// Helper function to transform Supabase data to CardType
const transformToCardType = (data: any): CardType => ({
  ...data,
  mana_cost: data.mana_cost || {},
  abilities: data.abilities || [],
  is_favorited: false
});

const PersonalizedFeed = ({ filter }: PersonalizedFeedProps) => {
  const { user } = useAuth();

  const { data: cards, isLoading } = useQuery({
    queryKey: ['personalized-feed', filter, user?.id],
    queryFn: async (): Promise<CardType[]> => {
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
      return (data || []).map(transformToCardType);
    },
  });

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <CardDisplay
          key={card.id}
          card={card}
          size="md"
          showStats={true}
        />
      ))}
    </div>
  );
};

export default PersonalizedFeed;
