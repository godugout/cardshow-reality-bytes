
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';
import { useCards, useCardSets } from '@/hooks/useCards';
import CardDisplay from './CardDisplay';
import type { CardFilters, CardRarity, CardType } from '@/types/card';
import { RARITY_LABELS, CARD_TYPE_LABELS } from '@/types/card';
import { Card, CardContent } from '@/components/ui/card';

const CardGrid = () => {
  const [filters, setFilters] = useState<CardFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const { cards, isLoading, searchTerm, setSearchTerm } = useCards(filters);
  const { sets } = useCardSets();

  const updateFilter = <K extends keyof CardFilters>(key: K, value: CardFilters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleRarity = (rarity: CardRarity) => {
    const current = filters.rarity || [];
    const updated = current.includes(rarity)
      ? current.filter(r => r !== rarity)
      : [...current, rarity];
    updateFilter('rarity', updated.length ? updated : undefined);
  };

  const toggleCardType = (cardType: CardType) => {
    const current = filters.card_type || [];
    const updated = current.includes(cardType)
      ? current.filter(t => t !== cardType)
      : [...current, cardType];
    updateFilter('card_type', updated.length ? updated : undefined);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid-cards stagger-children">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="trading-card skeleton rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Search and Filter Header */}
      <Card variant="glass" className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Label htmlFor="card-search" className="sr-only">
              Search cards
            </Label>
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              id="card-search"
              placeholder="Search for cards, creators, or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 text-base bg-background/50 border-border/30 focus:border-primary/50 focus:bg-background"
            />
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="h-12 gap-2 min-w-[120px]"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
            
            {activeFilterCount > 0 && (
              <Button variant="ghost" onClick={clearFilters} className="h-12 gap-2">
                <X className="w-4 h-4" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Enhanced Filter Panel */}
        {showFilters && (
          <CardContent className="pt-6 space-y-6 animate-slide-in-down">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Rarity Filter */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Rarity</Label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(RARITY_LABELS).map(([rarity, label]) => (
                    <Badge
                      key={rarity}
                      variant={filters.rarity?.includes(rarity as CardRarity) ? "default" : "outline"}
                      className="cursor-pointer hover:scale-105 transition-transform focus-ring"
                      onClick={() => toggleRarity(rarity as CardRarity)}
                      role="button"
                      tabIndex={0}
                    >
                      {label}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Card Type Filter */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Type</Label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(CARD_TYPE_LABELS).map(([type, label]) => (
                    <Badge
                      key={type}
                      variant={filters.card_type?.includes(type as CardType) ? "default" : "outline"}
                      className="cursor-pointer hover:scale-105 transition-transform focus-ring"
                      onClick={() => toggleCardType(type as CardType)}
                      role="button"
                      tabIndex={0}
                    >
                      {label}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Set Filter */}
              <div className="space-y-3">
                <Label htmlFor="set-filter" className="text-sm font-semibold">Collection</Label>
                <Select value={filters.set_id || "all"} onValueChange={(value) => updateFilter('set_id', value === "all" ? undefined : value)}>
                  <SelectTrigger id="set-filter" className="h-10">
                    <SelectValue placeholder="All Collections" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Collections</SelectItem>
                    {sets.map(set => (
                      <SelectItem key={set.id} value={set.id}>
                        {set.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Price Range</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="min-price" className="sr-only">Minimum price</Label>
                    <Input
                      id="min-price"
                      type="number"
                      placeholder="Min $"
                      value={filters.min_price || ''}
                      onChange={(e) => updateFilter('min_price', e.target.value ? Number(e.target.value) : undefined)}
                      min="0"
                      step="0.01"
                      className="h-10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="max-price" className="sr-only">Maximum price</Label>
                    <Input
                      id="max-price"
                      type="number"
                      placeholder="Max $"
                      value={filters.max_price || ''}
                      onChange={(e) => updateFilter('max_price', e.target.value ? Number(e.target.value) : undefined)}
                      min="0"
                      step="0.01"
                      className="h-10"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="text-muted-foreground text-lg">
          <span className="font-semibold text-foreground">{cards.length}</span> card{cards.length !== 1 ? 's' : ''} found
        </div>
        
        <Select defaultValue="newest">
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Enhanced Card Grid */}
      <div className="grid-cards stagger-children">
        {cards.map((card, index) => (
          <div key={card.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <CardDisplay
              card={card}
              size="md"
              showStats={true}
            />
          </div>
        ))}
      </div>

      {/* Enhanced Empty State */}
      {cards.length === 0 && !isLoading && (
        <Card variant="glass" className="text-center py-16">
          <CardContent className="space-y-4">
            <div className="w-24 h-24 mx-auto bg-muted/20 rounded-full flex items-center justify-center mb-6">
              <Search className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-display-xs text-foreground">No cards found</h3>
            <p className="text-body-md text-muted-foreground max-w-md mx-auto">
              We couldn't find any cards matching your search criteria. 
              Try adjusting your filters or search terms.
            </p>
            <Button onClick={clearFilters} className="mt-6">
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CardGrid;
