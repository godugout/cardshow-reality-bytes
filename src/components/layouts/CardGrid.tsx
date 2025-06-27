
import React from 'react';
import CardPhysics from '@/components/cards/CardPhysics';
import SpatialLayout from '@/components/ui/SpatialLayout';
import { cn } from '@/lib/utils';
import type { Card } from '@/types/card';

interface CardGridProps {
  cards: Card[];
  layout?: 'grid' | 'stack' | 'spread' | 'cascade' | 'gallery';
  cardSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  spacing?: 'tight' | 'normal' | 'loose' | 'scattered';
  interactive?: boolean;
  showDetails?: boolean;
  onCardClick?: (card: Card) => void;
  className?: string;
}

const CardGrid = ({
  cards,
  layout = 'grid',
  cardSize = 'md',
  spacing = 'normal',
  interactive = true,
  showDetails = true,
  onCardClick,
  className
}: CardGridProps) => {
  if (!cards.length) {
    return (
      <div className="flex items-center justify-center min-h-64 text-muted-foreground">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-lg flex items-center justify-center">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <p>No cards found</p>
        </div>
      </div>
    );
  }

  return (
    <SpatialLayout
      variant={layout}
      spacing={spacing}
      perspective={layout === 'cascade'}
      className={cn('w-full', className)}
    >
      {cards.map((card) => (
        <CardPhysics
          key={card.id}
          card={card}
          size={cardSize}
          interactive={interactive}
          showDetails={showDetails}
          onClick={() => onCardClick?.(card)}
        />
      ))}
    </SpatialLayout>
  );
};

export default CardGrid;
