
import { Badge } from '@/components/ui/badge';
import { RARITY_COLORS, RARITY_LABELS, type CardRarity } from '@/types/card';
import { cn } from '@/lib/utils';

interface RarityBadgeProps {
  rarity: CardRarity;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const RarityBadge = ({ rarity, size = 'md', animated = false }: RarityBadgeProps) => {
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5'
  };

  return (
    <Badge
      className={cn(
        'text-white font-semibold border-0 shadow-sm',
        RARITY_COLORS[rarity],
        sizeClasses[size],
        animated && 'animate-pulse hover:animate-none transition-all duration-200'
      )}
    >
      {RARITY_LABELS[rarity]}
    </Badge>
  );
};

export default RarityBadge;
