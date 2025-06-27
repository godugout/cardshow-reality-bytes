
import React, { useState, useCallback } from 'react';
import { animated, useSpring, useChain, useSpringRef } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { cn } from '@/lib/utils';
import type { Card } from '@/types/card';

interface CardStackProps {
  cards: Card[];
  maxVisible?: number;
  onCardSelect?: (card: Card, index: number) => void;
  onStackShuffle?: () => void;
  className?: string;
}

const CardStack = ({ 
  cards, 
  maxVisible = 5, 
  onCardSelect, 
  onStackShuffle,
  className 
}: CardStackProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isShuffling, setIsShuffling] = useState(false);
  
  const visibleCards = cards.slice(0, maxVisible);
  
  // Animation refs for chaining
  const fanRef = useSpringRef();
  const shuffleRef = useSpringRef();
  
  // Fan-out animation
  const fanSprings = useSpring({
    ref: fanRef,
    from: { spread: 0, rotation: 0 },
    to: { spread: isShuffling ? 0 : 1, rotation: isShuffling ? 360 : 0 },
    config: { tension: 200, friction: 25 }
  });
  
  // Shuffle animation
  const shuffleSprings = useSpring({
    ref: shuffleRef,
    from: { y: 0, scale: 1 },
    to: { y: isShuffling ? -20 : 0, scale: isShuffling ? 1.1 : 1 },
    config: { tension: 300, friction: 30 }
  });
  
  // Chain animations
  useChain(isShuffling ? [shuffleRef, fanRef] : [fanRef, shuffleRef], [0, 0.3]);
  
  const handleCardClick = useCallback((card: Card, index: number) => {
    setSelectedIndex(index);
    onCardSelect?.(card, index);
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(25);
    }
  }, [onCardSelect]);
  
  const handleStackShuffle = useCallback(() => {
    setIsShuffling(true);
    
    setTimeout(() => {
      setIsShuffling(false);
      onStackShuffle?.();
    }, 800);
    
    // Strong haptic feedback for shuffle
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 100, 50]);
    }
  }, [onStackShuffle]);
  
  // Drag gesture for stack manipulation
  const bindDrag = useDrag(({ down, movement: [mx, my], velocity, direction: [dx] }) => {
    // Implement swipe-to-shuffle
    if (!down && Math.abs(velocity[0]) > 0.5 && Math.abs(dx) > 0.5) {
      handleStackShuffle();
    }
  });

  return (
    <div className={cn('relative', className)}>
      {/* Stack base */}
      <div className="relative w-48 h-60">
        {visibleCards.map((card, index) => {
          const isTop = index === visibleCards.length - 1;
          const zIndex = visibleCards.length - index;
          const offset = index * 2;
          
          return (
            <animated.div
              key={`${card.id}-${index}`}
              className={cn(
                'absolute inset-0 rounded-lg cursor-pointer transition-all duration-300',
                'bg-gray-800 border border-gray-700 overflow-hidden',
                isTop && 'hover:scale-105 hover:rotate-1'
              )}
              style={{
                zIndex,
                transform: fanSprings.spread.to(s => 
                  shuffleSprings.y.to(y =>
                    shuffleSprings.scale.to(scale =>
                      `translateX(${s * index * 8}px) translateY(${offset + y}px) rotate(${s * index * 2 - fanSprings.rotation.get() * 0.01}deg) scale(${scale})`
                    )
                  )
                ) as any,
                filter: `brightness(${1 - index * 0.1})`,
              }}
              onClick={() => handleCardClick(card, index)}
              {...(isTop ? bindDrag() : {})}
            >
              {/* Card content */}
              <div className="relative w-full h-full">
                <img
                  src={card.image_url || '/placeholder.svg'}
                  alt={card.title}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
                
                {/* Card overlay with info */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                  <h4 className="text-white font-medium text-sm truncate">
                    {card.title}
                  </h4>
                  {card.rarity && (
                    <span className={cn(
                      'inline-block px-2 py-1 rounded text-xs font-bold uppercase mt-1',
                      {
                        'bg-gray-600 text-white': card.rarity === 'common',
                        'bg-green-600 text-white': card.rarity === 'uncommon',
                        'bg-blue-600 text-white': card.rarity === 'rare',
                        'bg-purple-600 text-white': card.rarity === 'epic',
                        'bg-yellow-500 text-black': card.rarity === 'legendary',
                        'bg-gradient-to-r from-pink-500 to-purple-500 text-white': card.rarity === 'mythic'
                      }
                    )}>
                      {card.rarity}
                    </span>
                  )}
                </div>
                
                {/* Stack depth indicator */}
                {index < visibleCards.length - 1 && (
                  <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    +{cards.length - index - 1}
                  </div>
                )}
              </div>
            </animated.div>
          );
        })}
      </div>
      
      {/* Stack controls */}
      <div className="mt-4 flex justify-center space-x-2">
        <button
          onClick={handleStackShuffle}
          disabled={isShuffling}
          className={cn(
            'px-3 py-1 bg-primary text-primary-foreground rounded text-sm font-medium',
            'hover:bg-primary/90 transition-colors',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {isShuffling ? 'Shuffling...' : 'Shuffle'}
        </button>
        
        <div className="text-xs text-muted-foreground self-center">
          {cards.length} cards
        </div>
      </div>
      
      {/* Accessibility info */}
      <div className="sr-only">
        Card stack with {cards.length} cards. 
        {selectedIndex >= 0 && `Currently selected: ${cards[selectedIndex]?.title}`}
        Use arrow keys to navigate, Enter to select, Space to shuffle.
      </div>
    </div>
  );
};

export default CardStack;
