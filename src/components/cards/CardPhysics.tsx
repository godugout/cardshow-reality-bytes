
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
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = useCallback(() => {
    if (interactive) {
      setCardState('hovered');
      setIsHovered(true);
    }
  }, [interactive]);

  const handleMouseLeave = useCallback(() => {
    if (interactive) {
      setCardState('resting');
      setIsHovered(false);
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
        
        {/* Card details overlay with luxury slow animations */}
        {showDetails && (
          <div className={cn(
            'absolute bottom-0 left-0 right-0 p-3',
            // Ultra-slow 6 second backdrop transition
            'transition-all duration-[6000ms] ease-[cubic-bezier(0.05,0.7,0.1,1)]',
            isHovered 
              ? 'bg-gradient-to-t from-black/95 via-black/70 to-transparent backdrop-blur-md' 
              : 'bg-gradient-to-t from-black/60 via-black/20 to-transparent backdrop-blur-sm'
          )}>
            {/* Card title with 3 second delay */}
            <h3 className={cn(
              'text-white font-bold text-sm truncate mb-1',
              'transition-all duration-[5000ms] ease-out',
              isHovered 
                ? 'opacity-100 transform translate-y-0 text-shadow-lg delay-[3000ms]' 
                : 'opacity-70 transform translate-y-2'
            )}>
              {card.title}
            </h3>
            
            {/* Card description with 5 second delay */}
            {card.description && (
              <p className={cn(
                'text-white/80 text-xs line-clamp-2',
                'transition-all duration-[6000ms] ease-out',
                isHovered 
                  ? 'opacity-90 transform translate-y-0 delay-[5000ms]' 
                  : 'opacity-0 transform translate-y-3'
              )}>
                {card.description}
              </p>
            )}
          </div>
        )}
        
        {/* Rarity indicator with 7 second delay */}
        {card.rarity && card.rarity !== 'common' && (
          <div className={cn(
            'absolute top-2 right-2',
            'transition-all duration-[7000ms] ease-out',
            isHovered 
              ? 'opacity-100 scale-110 delay-[7000ms]' 
              : 'opacity-80 scale-100'
          )}>
            <div className={cn(
              'px-2 py-1 rounded text-xs font-bold uppercase tracking-wide',
              'transition-all duration-[4000ms] ease-out',
              {
                'bg-gray-600 text-white': card.rarity === 'uncommon',
                'bg-blue-600 text-white': card.rarity === 'rare', 
                'bg-purple-600 text-white': card.rarity === 'epic',
                'bg-yellow-600 text-black': card.rarity === 'legendary',
                'bg-gradient-to-r from-pink-500 to-purple-500 text-white': card.rarity === 'mythic'
              },
              isHovered ? 'shadow-2xl backdrop-blur-sm delay-[7000ms]' : ''
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
