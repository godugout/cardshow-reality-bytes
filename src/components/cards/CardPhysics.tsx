
import React, { useState, useCallback } from 'react';
import PhysicalCard from '@/components/ui/PhysicalCard';
import { cn } from '@/lib/utils';
import type { Card } from '@/types/card';

interface CardPhysicsProps {
  card: Card;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  interactive?: boolean;
  showDetails?: boolean;
  onClick?: () => void;
  className?: string;
}

const CardPhysics = ({ 
  card, 
  size = 'md', 
  interactive = true,
  showDetails = true,
  onClick,
  className 
}: CardPhysicsProps) => {
  const [cardState, setCardState] = useState<'resting' | 'hovered' | 'active' | 'floating' | 'premium'>('resting');

  const handleMouseEnter = useCallback(() => {
    if (interactive) {
      setCardState('hovered');
    }
  }, [interactive]);

  const handleMouseLeave = useCallback(() => {
    if (interactive) {
      setCardState('resting');
    }
  }, [interactive]);

  const handleMouseDown = useCallback(() => {
    if (interactive) {
      setCardState('active');
    }
  }, [interactive]);

  const handleMouseUp = useCallback(() => {
    if (interactive) {
      setCardState('hovered');
    }
  }, [interactive]);

  const handleClick = useCallback(() => {
    if (interactive && onClick) {
      onClick();
    }
  }, [interactive, onClick]);

  return (
    <PhysicalCard
      size={size}
      rarity={card.rarity || 'common'}
      state={cardState}
      interactive={interactive}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
      className={cn('overflow-hidden', className)}
    >
      {/* Card Image */}
      <div className="relative w-full h-full">
        <img
          src={card.image_url || '/placeholder.svg'}
          alt={card.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* Physical lighting overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 pointer-events-none" />
        
        {/* Card details overlay */}
        {showDetails && (
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            <h3 className="text-white font-bold text-sm truncate">
              {card.title}
            </h3>
            {card.description && (
              <p className="text-white/80 text-xs mt-1 line-clamp-2">
                {card.description}
              </p>
            )}
          </div>
        )}
        
        {/* Rarity indicator */}
        {card.rarity && card.rarity !== 'common' && (
          <div className="absolute top-2 right-2">
            <div className={cn(
              'px-2 py-1 rounded text-xs font-bold uppercase tracking-wide',
              {
                'bg-gray-600 text-white': card.rarity === 'uncommon',
                'bg-blue-600 text-white': card.rarity === 'rare', 
                'bg-purple-600 text-white': card.rarity === 'epic',
                'bg-yellow-600 text-black': card.rarity === 'legendary',
                'bg-gradient-to-r from-pink-500 to-purple-500 text-white': card.rarity === 'mythic'
              }
            )}>
              {card.rarity}
            </div>
          </div>
        )}
      </div>
    </PhysicalCard>
  );
};

export default CardPhysics;
