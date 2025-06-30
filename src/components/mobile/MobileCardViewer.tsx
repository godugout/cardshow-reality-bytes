
import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Share2, MoreVertical, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileOptimizedCard from '@/components/ui/MobileOptimizedCard';
import type { Card as CardType } from '@/types/card';

interface MobileCardViewerProps {
  cards: CardType[];
  currentIndex?: number;
  onCardChange?: (index: number) => void;
  onFavorite?: (card: CardType) => void;
  onShare?: (card: CardType) => void;
  className?: string;
}

const MobileCardViewer = ({
  cards,
  currentIndex = 0,
  onCardChange,
  onFavorite,
  onShare,
  className
}: MobileCardViewerProps) => {
  const isMobile = useIsMobile();
  const [activeIndex, setActiveIndex] = useState(currentIndex);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!isMobile || !cards.length) return null;

  const currentCard = cards[activeIndex];

  const handleSwipe = (direction: 'left' | 'right') => {
    let newIndex = activeIndex;
    
    if (direction === 'left' && activeIndex < cards.length - 1) {
      newIndex = activeIndex + 1;
    } else if (direction === 'right' && activeIndex > 0) {
      newIndex = activeIndex - 1;
    }
    
    setActiveIndex(newIndex);
    onCardChange?.(newIndex);
  };

  const handleCardTap = () => {
    // Simple tap action - could expand card or show details
    console.log('Card tapped:', currentCard.title);
  };

  const handleDoubleTap = () => {
    onFavorite?.(currentCard);
  };

  return (
    <div className={cn('h-screen bg-background overflow-hidden', className)}>
      {/* Card Display Area */}
      <div className="flex-1 flex items-center justify-center p-4 pt-16">
        <div className="relative w-full max-w-sm">
          <MobileOptimizedCard
            card={currentCard}
            size="lg"
            onTap={handleCardTap}
            onDoubleTap={handleDoubleTap}
            className="mx-auto shadow-2xl"
          />
          
          {/* Card Navigation Dots */}
          {cards.length > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              {cards.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setActiveIndex(index);
                    onCardChange?.(index);
                  }}
                  className={cn(
                    'w-2 h-2 rounded-full transition-all',
                    index === activeIndex 
                      ? 'bg-[#00C851] w-6' 
                      : 'bg-gray-600 hover:bg-gray-500'
                  )}
                  aria-label={`Go to card ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card Info Panel */}
      <div className="bg-card border-t border-border p-4 space-y-3">
        <div>
          <h2 className="text-xl font-bold text-foreground line-clamp-1">
            {currentCard.title}
          </h2>
          {currentCard.description && (
            <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
              {currentCard.description}
            </p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFavorite?.(currentCard)}
              className="flex items-center gap-2 px-3"
            >
              <Heart 
                className={cn(
                  'w-4 h-4',
                  currentCard.is_favorited ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
                )}
              />
              <span className="text-sm">
                {currentCard.favorite_count || 0}
              </span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onShare?.(currentCard)}
              className="px-3"
            >
              <Share2 className="w-4 h-4 text-muted-foreground" />
            </Button>

            <Button variant="ghost" size="sm" className="px-3">
              <MoreVertical className="w-4 h-4 text-muted-foreground" />
            </Button>
          </div>

          <Button variant="ghost" size="sm" className="px-3">
            <Maximize2 className="w-4 h-4 text-muted-foreground" />
          </Button>
        </div>

        {/* Swipe Hint */}
        {cards.length > 1 && (
          <div className="text-center text-xs text-muted-foreground pt-2">
            Swipe or tap dots to browse cards
          </div>
        )}
      </div>

      {/* Swipe Areas (invisible) */}
      {cards.length > 1 && (
        <>
          <button
            className="absolute left-0 top-16 bottom-20 w-16 z-10"
            onClick={() => handleSwipe('right')}
            aria-label="Previous card"
          />
          <button
            className="absolute right-0 top-16 bottom-20 w-16 z-10"
            onClick={() => handleSwipe('left')}
            aria-label="Next card"
          />
        </>
      )}
    </div>
  );
};

export default MobileCardViewer;
