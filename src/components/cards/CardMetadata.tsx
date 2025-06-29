
import { Badge } from '@/components/ui/badge';
import RarityBadge from './RarityBadge';
import type { Card as CardType } from '@/types/card';

interface CardMetadataProps {
  card: CardType;
}

const CardMetadata = ({ card }: CardMetadataProps) => {
  return (
    <>
      {/* Rarity Badge with Brighter Colors */}
      {card.rarity && (
        <div className="absolute top-2 right-2">
          <RarityBadge rarity={card.rarity} size="sm" animated />
        </div>
      )}

      {/* Serial Number with Brighter Color */}
      {card.serial_number && (
        <div className="absolute top-12 right-2">
          <Badge className="text-xs font-mono bg-[#00C851] text-white border-0 shadow-lg">
            #{card.serial_number}
          </Badge>
        </div>
      )}
    </>
  );
};

export default CardMetadata;
