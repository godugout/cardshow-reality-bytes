
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useCardFavorites } from '@/hooks/useCards';
import type { Card as CardType } from '@/types/card';

interface CardActionsProps {
  card: CardType;
}

const CardActions = ({ card }: CardActionsProps) => {
  const { user } = useAuth();
  const { toggleFavorite } = useCardFavorites();

  const handleFavoriteToggle = () => {
    if (!user) return;
    toggleFavorite.mutate({
      cardId: card.id,
      isFavorited: card.is_favorited || false
    });
  };

  if (!user) return null;

  return (
    <Button
      variant="ghost"
      size="sm"
      className="absolute bottom-2 right-2 bg-black/60 hover:bg-black/80 text-white border border-white/20"
      onClick={handleFavoriteToggle}
      disabled={toggleFavorite.isPending}
    >
      <Heart 
        className={cn(
          'w-4 h-4',
          card.is_favorited ? 'fill-pink-400 text-pink-400' : 'text-gray-200'
        )}
      />
    </Button>
  );
};

export default CardActions;
