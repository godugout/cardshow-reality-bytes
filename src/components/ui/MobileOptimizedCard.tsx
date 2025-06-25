
import { useState } from 'react';
import { useAccessibilityFeatures } from '@/hooks/useAccessibilityFeatures';
import { useMobileCardGestures } from '@/hooks/useMobileCardGestures';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import MobileCardImage from './MobileCardImage';
import MobileCardInfo from './MobileCardInfo';
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
  const { a11yState } = useAccessibilityFeatures();
  const [isPressed, setIsPressed] = useState(false);

  const {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleDoubleClick,
    handleKeyDown,
    handleFocus
  } = useMobileCardGestures({
    onTap,
    onDoubleTap,
    onLongPress,
    cardTitle: card.title
  });

  const sizeClasses = {
    sm: 'w-32 h-40',
    md: 'w-48 h-60',
    lg: 'w-64 h-80'
  };

  const handlePointerDownWithState = (event: React.PointerEvent) => {
    setIsPressed(true);
    handlePointerDown(event);
  };

  const handlePointerUpWithState = (event: React.PointerEvent) => {
    setIsPressed(false);
    handlePointerUp(event);
  };

  return (
    <Card
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
      onPointerDown={handlePointerDownWithState}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUpWithState}
      onDoubleClick={handleDoubleClick}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
    >
      <MobileCardImage card={card} />
      <MobileCardInfo card={card} />
      
      {/* Touch target overlay for accessibility */}
      <div 
        className="absolute inset-0 min-h-[44px] min-w-[44px]"
        aria-hidden="true"
      />
    </Card>
  );
};

export default MobileOptimizedCard;
