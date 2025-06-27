
import React, { forwardRef } from 'react';
import { animated } from '@react-spring/web';
import { cn } from '@/lib/utils';
import { useCardPhysicsInteractions } from '@/hooks/useCardPhysicsInteractions';
import type { Card } from '@/types/card';

interface InteractiveCardProps extends React.HTMLAttributes<HTMLDivElement> {
  card?: Card;
  size?: 'sm' | 'md' | 'lg';
  enableInteractions?: boolean;
  onCardTap?: () => void;
  onCardDoubleTap?: () => void;
  onCardLongPress?: () => void;
  showRarityGlow?: boolean;
  children: React.ReactNode;
}

const InteractiveCard = forwardRef<HTMLDivElement, InteractiveCardProps>(({
  card,
  size = 'md',
  enableInteractions = true,
  onCardTap,
  onCardDoubleTap,
  onCardLongPress,
  showRarityGlow = true,
  className,
  children,
  ...props
}, ref) => {
  const { cardSpring, handlers } = useCardPhysicsInteractions({
    onTap: onCardTap,
    onDoubleTap: onCardDoubleTap,
    onLongPress: onCardLongPress,
    enableHaptics: enableInteractions
  });

  const sizeClasses = {
    sm: 'w-32 h-40',
    md: 'w-48 h-60',
    lg: 'w-64 h-80'
  };

  const getRarityGlow = () => {
    if (!showRarityGlow || !card?.rarity) return '';
    
    const glowColors = {
      common: '',
      uncommon: 'drop-shadow-[0_0_8px_rgba(156,163,175,0.4)]',
      rare: 'drop-shadow-[0_0_12px_rgba(59,130,246,0.5)]',
      epic: 'drop-shadow-[0_0_16px_rgba(147,51,234,0.6)]',
      legendary: 'drop-shadow-[0_0_20px_rgba(251,191,36,0.7)]',
      mythic: 'drop-shadow-[0_0_24px_rgba(236,72,153,0.8)]'
    };
    
    return glowColors[card.rarity] || '';
  };

  return (
    <animated.div
      ref={ref}
      className={cn(
        'relative cursor-pointer select-none transform-gpu',
        'transition-all duration-300 ease-out',
        'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2',
        sizeClasses[size],
        getRarityGlow(),
        className
      )}
      style={{
        transform: cardSpring.scale.to(s => 
          `scale(${s}) translateZ(${cardSpring.translateZ.get()}px)`
        ) as any,
        transformStyle: 'preserve-3d',
        filter: cardSpring.shadow.to(s => 
          `drop-shadow(0 ${s * 8}px ${s * 24}px rgba(0,0,0,${s * 0.3}))`
        )
      }}
      tabIndex={enableInteractions ? 0 : -1}
      role={enableInteractions ? 'button' : undefined}
      aria-label={card ? `Card: ${card.title}` : 'Interactive card'}
      {...(enableInteractions ? handlers : {})}
      {...props}
    >
      <animated.div
        className="w-full h-full rounded-lg overflow-hidden"
        style={{
          transform: cardSpring.rotateX.to(x => 
            cardSpring.rotateY.to(y => 
              `rotateX(${x}deg) rotateY(${y}deg)`
            )
          ) as any,
          transformStyle: 'preserve-3d'
        }}
      >
        {children}
        
        {/* Interaction overlay for subtle visual feedback */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10 opacity-0 transition-opacity duration-200 pointer-events-none group-hover:opacity-100" />
        
        {/* Physical card edge simulation */}
        <div className="absolute inset-0 rounded-lg border border-white/10 pointer-events-none" />
      </animated.div>
      
      {/* Accessibility indicator */}
      {enableInteractions && (
        <div className="sr-only">
          Interactive card. Press Enter to select, double-click for details.
        </div>
      )}
    </animated.div>
  );
});

InteractiveCard.displayName = 'InteractiveCard';

export default InteractiveCard;
