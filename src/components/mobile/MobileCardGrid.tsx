
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileOptimizedCard from '@/components/ui/MobileOptimizedCard';
import MobileCardViewer from './MobileCardViewer';
import { cn } from '@/lib/utils';
import type { Card } from '@/types/card';

interface MobileCardGridProps {
  cards: Card[];
  onCardSelect?: (card: Card, index: number) => void;
  onFavorite?: (card: Card) => void;
  onShare?: (card: Card) => void;
  className?: string;
}

const MobileCardGrid = ({
  cards,
  onCardSelect,
  onFavorite,
  onShare,
  className
}: MobileCardGridProps) => {
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredCards = useMemo(() => {
    if (!searchTerm) return cards;
    
    return cards.filter(card =>
      card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [cards, searchTerm]);

  if (!isMobile) return null;

  // Show full-screen card viewer when a card is selected
  if (selectedCardIndex !== null) {
    return (
      <MobileCardViewer
        cards={filteredCards}
        currentIndex={selectedCardIndex}
        onCardChange={setSelectedCardIndex}
        onFavorite={onFavorite}
        onShare={onShare}
        className={className}
      />
    );
  }

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      {/* Mobile Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="p-4 space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search cards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-12 h-12 text-base"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 w-10 p-0"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </Button>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{filteredCards.length} cards</span>
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchTerm('')}
                className="text-xs"
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Card Grid */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {filteredCards.map((card, index) => (
            <MobileOptimizedCard
              key={card.id}
              card={card}
              size="sm"
              onTap={() => {
                setSelectedCardIndex(index);
                onCardSelect?.(card, index);
              }}
              onDoubleTap={() => onFavorite?.(card)}
              className="aspect-[3/4]"
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredCards.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-lg flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No cards found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'Try adjusting your search' : 'No cards available'}
            </p>
          </div>
        )}
      </div>

      {/* Bottom spacing for safe area */}
      <div className="h-20" />
    </div>
  );
};

export default MobileCardGrid;
