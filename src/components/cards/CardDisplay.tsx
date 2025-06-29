
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import CardImage from './CardImage';
import CardInfo from './CardInfo';
import CardActions from './CardActions';
import CardMetadata from './CardMetadata';
import type { Card as CardType } from '@/types/card';

interface CardDisplayProps {
  card: CardType;
  size?: 'sm' | 'md' | 'lg';
  showStats?: boolean;
  className?: string;
}

const CardDisplay = ({ card, size = 'md', showStats = false, className }: CardDisplayProps) => {
  const [is3D, setIs3D] = useState(false);

  const sizeClasses = {
    sm: 'w-48 h-64',
    md: 'w-64 h-80',
    lg: 'w-80 h-96'
  };

  return (
    <Card className={cn(
      'group relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-gray-900 border-gray-800',
      sizeClasses[size],
      className
    )}>
      <CardContent className="p-0 h-full">
        {/* Card Image/3D View */}
        <CardImage
          card={card}
          is3D={is3D}
          onToggle3D={setIs3D}
        />
        
        {/* Card Metadata (Rarity, Serial Number) */}
        <CardMetadata card={card} />

        {/* Favorite Button */}
        <CardActions card={card} />

        {/* Card Info */}
        <CardInfo card={card} showStats={showStats} />
      </CardContent>
    </Card>
  );
};

export default CardDisplay;
