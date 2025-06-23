
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
    <div>
      <h3 className="font-semibold text-lg mb-1 line-clamp-1">
        {title || 'Unknown Card'}
      </h3>
      
      <div className="flex items-center justify-between">
        {rarity && <RarityBadge rarity={rarity as CardRarity} />}
        <Badge variant="outline" className="text-xs">
          {condition}
        </Badge>
      </div>
    </div>
  );
};

export default CardInfo;
