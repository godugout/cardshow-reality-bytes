
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
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5'
  };

  // Updated rarity colors with better contrast
  const rarityColors = {
    common: 'bg-neutral-500 text-white',
    uncommon: 'bg-success text-white',
    rare: 'bg-primary text-white',
    ultra_rare: 'bg-secondary text-white',
    legendary: 'bg-accent text-white'
  };

  return (
    <Badge
      className={cn(
        'font-semibold border-0 shadow-sm rounded-lg',
        rarityColors[rarity] || rarityColors.common,
        sizeClasses[size],
        animated && 'animate-pulse hover:animate-none transition-all duration-200'
      )}
    >
      {RARITY_LABELS[rarity]}
    </Badge>
  );
};

export default RarityBadge;
