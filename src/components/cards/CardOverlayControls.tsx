
import { Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useCardFavorites } from '@/hooks/useCards';
import Card3DToggle from './Card3DToggle';
import RarityBadge from './RarityBadge';
import type { Card } from '@/types/card';

interface CardOverlayControlsProps {
  card: Card;
  is3D: boolean;
  onToggle3D: (value: boolean) => void;
  user: any;
}

const CardOverlayControls = ({ card, is3D, onToggle3D, user }: CardOverlayControlsProps) => {
  const { toggleFavorite } = useCardFavorites();

  const handleFavoriteToggle = () => {
    if (!user) return;
    toggleFavorite.mutate({
      cardId: card.id,
      isFavorited: card.is_favorited || false
    });
  };

  return (
    <>
      {/* Top Controls */}
      <div className="absolute top-2 left-2 z-30">
        <Card3DToggle is3D={is3D} onToggle={onToggle3D} />
      </div>

      <div className="absolute top-2 right-2 z-30 space-y-2">
        {/* Rarity Badge */}
        {card.rarity && (
          <RarityBadge rarity={card.rarity} size="sm" animated />
        )}
      </div>

      {/* Serial Number */}
      {card.serial_number && (
        <div className="absolute top-12 right-2 z-30">
          <Badge variant="secondary" className="text-xs font-mono">
            #{card.serial_number}
          </Badge>
        </div>
      )}

      {/* Quick Action - Favorite (hidden by default, shows on hover) */}
      {user && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute bottom-20 right-2 z-30 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          onClick={handleFavoriteToggle}
          disabled={toggleFavorite.isPending}
        >
          <Heart 
            className={cn(
              'w-4 h-4',
              card.is_favorited ? 'fill-red-500 text-red-500' : 'text-white'
            )}
          />
        </Button>
      )}
    </>
  );
};

export default CardOverlayControls;
