
import { useState } from 'react';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';
import { useAccessibilityFeatures } from '@/hooks/useAccessibilityFeatures';
import { cn } from '@/lib/utils';
import type { Card } from '@/types/card';

interface MobileCardImageProps {
  card: Card;
  className?: string;
}

const MobileCardImage = ({ card, className }: MobileCardImageProps) => {
  const { getOptimizedImageUrl, config } = useMobileOptimization();
  const { a11yState } = useAccessibilityFeatures();
  const [imageLoaded, setImageLoaded] = useState(false);

  const imageUrl = getOptimizedImageUrl(card.image_url || '/placeholder.svg', 400, 500);

  return (
    <div className={cn('relative h-3/4 overflow-hidden', className)}>
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
  );
};

export default MobileCardImage;
