
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

  // Updated rarity colors with much brighter, more vibrant colors
  const rarityColors = {
    common: 'bg-slate-500 text-white border border-slate-400/50 shadow-lg',
    uncommon: 'bg-[#00C851] text-white border border-[#00C851]/50 shadow-lg',
    rare: 'bg-blue-500 text-white border border-blue-400/50 shadow-lg',
    ultra_rare: 'bg-purple-500 text-white border border-purple-400/50 shadow-lg',
    legendary: 'bg-yellow-500 text-black border border-yellow-400/50 shadow-lg font-bold'
  };

  return (
    <Badge
      className={cn(
        'font-semibold rounded-lg backdrop-blur-sm',
        rarityColors[rarity] || rarityColors.common,
        sizeClasses[size],
        animated && 'animate-pulse hover:animate-none transition-all duration-200 hover:scale-110'
      )}
    >
      {RARITY_LABELS[rarity]}
    </Badge>
  );
};

export default RarityBadge;
