
import React, { useState } from 'react';
import { animated, useSpring } from '@react-spring/web';
import { cn } from '@/lib/utils';
import type { Card } from '@/types/card';

interface CardFlipProps {
  card: Card;
  backContent?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  autoFlip?: boolean;
  flipDuration?: number;
  onFlip?: (isFlipped: boolean) => void;
  className?: string;
}

const CardFlip = ({ 
  card, 
  backContent,
  size = 'md',
  autoFlip = false,
  flipDuration = 600,
  onFlip,
  className 
}: CardFlipProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  const sizeClasses = {
    sm: 'w-32 h-40',
    md: 'w-48 h-60',
    lg: 'w-64 h-80'
  };
  
  // Flip animation with physics
  const { transform, opacity } = useSpring({
    opacity: isFlipped ? 1 : 0,
    transform: `perspective(1000px) rotateY(${isFlipped ? 180 : 0}deg)`,
    config: { 
      tension: 200, 
      friction: 25,
      duration: flipDuration 
    }
  });
  
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    onFlip?.(!isFlipped);
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }
  };
  
  // Auto-flip effect
  React.useEffect(() => {
    if (autoFlip) {
      const interval = setInterval(() => {
        setIsFlipped(prev => !prev);
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [autoFlip]);
  
  const DefaultBackContent = () => (
    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
      <div className="text-center p-4">
        <div className="w-16 h-16 mx-auto mb-3 bg-primary/20 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-white font-medium text-sm mb-1">Card Back</h3>
        <p className="text-gray-400 text-xs">Click to flip</p>
      </div>
    </div>
  );

  return (
    <div 
      className={cn(
        'relative cursor-pointer select-none',
        'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2',
        sizeClasses[size],
        className
      )}
      onClick={handleFlip}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleFlip();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Flip card: ${card.title}. Currently showing ${isFlipped ? 'back' : 'front'}`}
    >
      {/* Front of card */}
      <animated.div
        className="absolute inset-0 rounded-lg overflow-hidden shadow-lg"
        style={{
          opacity: opacity.to(o => 1 - o),
          transform,
          backfaceVisibility: 'hidden' as const
        }}
      >
        <img
          src={card.image_url || '/placeholder.svg'}
          alt={card.title}
          className="w-full h-full object-cover"
          draggable={false}
        />
        
        {/* Front overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
          <h3 className="text-white font-bold text-sm truncate">
            {card.title}
          </h3>
          {card.description && (
            <p className="text-white/80 text-xs mt-1 line-clamp-2">
              {card.description}
            </p>
          )}
        </div>
        
        {/* Flip indicator */}
        <div className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
      </animated.div>
      
      {/* Back of card */}
      <animated.div
        className="absolute inset-0 rounded-lg overflow-hidden shadow-lg"
        style={{
          opacity,
          transform: transform.to(t => `${t} rotateY(180deg)`),
          backfaceVisibility: 'hidden' as const
        }}
      >
        {backContent || <DefaultBackContent />}
      </animated.div>
      
      {/* Physical card edge simulation */}
      <div className="absolute inset-0 rounded-lg border border-white/10 pointer-events-none" 
           style={{ zIndex: 1 }} />
    </div>
  );
};

export default CardFlip;
