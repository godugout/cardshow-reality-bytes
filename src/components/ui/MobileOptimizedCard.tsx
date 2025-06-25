
import { useState, useRef } from 'react';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';
import { useAccessibilityFeatures } from '@/hooks/useAccessibilityFeatures';
import { useGestureTracking } from '@/hooks/useGestureTracking';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Card as CardType } from '@/types/card';

interface MobileOptimizedCardProps {
  card: CardType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onTap?: () => void;
  onDoubleTap?: () => void;
  onLongPress?: () => void;
}

const MobileOptimizedCard = ({ 
  card, 
  size = 'md', 
  className,
  onTap,
  onDoubleTap,
  onLongPress
}: MobileOptimizedCardProps) => {
  const { 
    triggerHapticFeedback, 
    getOptimizedImageUrl, 
    isMobile,
    config
  } = useMobileOptimization();
  
  const { a11yState, announce, manageFocus } = useAccessibilityFeatures();
  const { gestureState, startGestureTracking, updateGestureTracking, stopGestureTracking } = useGestureTracking();
  
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const longPressTimer = useRef<NodeJS.Timeout>();

  const sizeClasses = {
    sm: 'w-32 h-40',
    md: 'w-48 h-60',
    lg: 'w-64 h-80'
  };

  const handlePointerDown = (event: React.PointerEvent) => {
    setIsPressed(true);
    startGestureTracking(event.nativeEvent);
    triggerHapticFeedback('light');
    
    // Start long press timer
    longPressTimer.current = setTimeout(() => {
      if (onLongPress) {
        triggerHapticFeedback('heavy');
        onLongPress();
        announce(`Long press action for ${card.title}`, 'assertive');
      }
    }, 500);
  };

  const handlePointerMove = (event: React.PointerEvent) => {
    updateGestureTracking(event.nativeEvent);
  };

  const handlePointerUp = (event: React.PointerEvent) => {
    setIsPressed(false);
    stopGestureTracking();
    
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    
    // Handle tap/double tap
    const timeSinceStart = Date.now() - (gestureState.startPosition.x ? Date.now() : Date.now());
    
    if (timeSinceStart < 300) {
      // Quick tap
      triggerHapticFeedback('medium');
      onTap?.();
      announce(`Selected ${card.title}`, 'polite');
    }
  };

  const handleDoubleClick = () => {
    triggerHapticFeedback('heavy');
    onDoubleTap?.();
    announce(`Double tapped ${card.title}`, 'assertive');
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onTap?.();
      announce(`Activated ${card.title} with keyboard`, 'polite');
    }
  };

  const handleFocus = () => {
    if (a11yState.keyboardNavigation) {
      announce(`Card: ${card.title}. ${card.description || 'No description available.'}`, 'polite');
    }
  };

  // Get optimized image URL
  const imageUrl = getOptimizedImageUrl(card.image_url || '/placeholder.svg', 400, 500);

  return (
    <Card
      ref={cardRef}
      className={cn(
        'relative overflow-hidden cursor-pointer transition-all duration-200',
        'focus:ring-2 focus:ring-[#00C851] focus:ring-offset-2',
        'hover:scale-105 active:scale-95',
        isPressed && 'scale-95',
        a11yState.highContrastMode && 'border-2 border-white',
        a11yState.reducedMotion && 'transition-none hover:scale-100 active:scale-100',
        sizeClasses[size],
        className
      )}
      tabIndex={0}
      role="button"
      aria-label={`Card: ${card.title}. ${card.description || ''} ${card.rarity ? `Rarity: ${card.rarity}.` : ''}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onDoubleClick={handleDoubleClick}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
    >
      {/* Image Container */}
      <div className="relative h-3/4 overflow-hidden">
        {!imageLoaded && (
          <div 
            className="absolute inset-0 bg-gray-800 animate-pulse"
            aria-hidden="true"
          />
        )}
        
        <img
          src={imageUrl}
          alt={card.title}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            imageLoaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={() => setImageLoaded(true)}
          loading={config.enableLazyLoading ? "lazy" : "eager"}
          decoding="async"
        />
        
        {/* Accessibility overlay for high contrast */}
        {a11yState.highContrastMode && (
          <div className="absolute inset-0 bg-black/20" aria-hidden="true" />
        )}
        
        {/* Rarity indicator */}
        {card.rarity && (
          <div 
            className={cn(
              'absolute top-2 right-2 px-2 py-1 rounded text-xs font-semibold',
              'bg-black/70 text-white',
              a11yState.highContrastMode && 'bg-white text-black border border-black'
            )}
            aria-label={`Rarity: ${card.rarity}`}
          >
            {card.rarity.toUpperCase()}
          </div>
        )}
      </div>

      {/* Card Info */}
      <div className="p-3 h-1/4 flex flex-col justify-between">
        <h3 
          className={cn(
            'font-bold text-white text-sm truncate',
            a11yState.fontSize === 'large' && 'text-base',
            a11yState.fontSize === 'xl' && 'text-lg',
            a11yState.highContrastMode && 'text-white drop-shadow-lg'
          )}
          title={card.title}
        >
          {card.title}
        </h3>
        
        {card.description && (
          <p 
            className={cn(
              'text-xs text-gray-400 line-clamp-2 mt-1',
              a11yState.fontSize === 'large' && 'text-sm',
              a11yState.fontSize === 'xl' && 'text-base',
              a11yState.highContrastMode && 'text-gray-200'
            )}
          >
            {card.description}
          </p>
        )}
      </div>

      {/* Touch target overlay for accessibility */}
      <div 
        className="absolute inset-0 min-h-[44px] min-w-[44px]"
        aria-hidden="true"
      />
    </Card>
  );
};

export default MobileOptimizedCard;
