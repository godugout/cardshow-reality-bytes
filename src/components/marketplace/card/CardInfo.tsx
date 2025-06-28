
import { Badge } from '@/components/ui/badge';
import RarityBadge from '@/components/cards/RarityBadge';
import type { CardRarity } from '@/types/card';

interface CardInfoProps {
  title?: string;
  rarity?: string;
  condition: string;
}

const CardInfo = ({ title, rarity, condition }: CardInfoProps) => {
  return (
    <div className="space-y-3">
      <h3 className="font-bold text-lg leading-tight line-clamp-1">
        {title || 'Unknown Card'}
      </h3>
      
      <div className="flex items-center justify-between gap-2">
        {rarity && <RarityBadge rarity={rarity as CardRarity} />}
        <Badge variant="outline" className="text-xs rounded-2xl border-0 bg-muted/50">
          {condition}
        </Badge>
      </div>
    </div>
  );
};

export default CardInfo;
