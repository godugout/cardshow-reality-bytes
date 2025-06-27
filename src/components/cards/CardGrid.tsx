
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, X } from 'lucide-react';
import { useCards, useCardSets } from '@/hooks/useCards';
import CardDisplay from './CardDisplay';
import type { CardFilters, CardRarity, CardType } from '@/types/card';
import { RARITY_LABELS, CARD_TYPE_LABELS } from '@/types/card';

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="w-64 h-80 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Search and Filter Header */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Label htmlFor="card-search" className="sr-only">
            Search cards
          </Label>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" aria-hidden="true" />
          <Input
            id="card-search"
            placeholder="Search cards by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            aria-describedby="card-search-help"
          />
          <div id="card-search-help" className="sr-only">
            Search through available cards by name or description
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            aria-expanded={showFilters}
            aria-controls="filter-panel"
          >
            <Filter className="w-4 h-4 mr-2" aria-hidden="true" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
          
          {activeFilterCount > 0 && (
            <Button variant="ghost" onClick={clearFilters} size="sm">
              <X className="w-4 h-4 mr-1" aria-hidden="true" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div id="filter-panel" className="bg-card border border-border rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Rarity Filter */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Rarity</Label>
              <div className="flex flex-wrap gap-1" role="group" aria-label="Rarity filters">
                {Object.entries(RARITY_LABELS).map(([rarity, label]) => (
                  <Badge
                    key={rarity}
                    variant={filters.rarity?.includes(rarity as CardRarity) ? "default" : "outline"}
                    className="cursor-pointer hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    onClick={() => toggleRarity(rarity as CardRarity)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleRarity(rarity as CardRarity);
                      }
                    }}
                    aria-pressed={filters.rarity?.includes(rarity as CardRarity)}
                  >
                    {label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Card Type Filter */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Type</Label>
              <div className="flex flex-wrap gap-1" role="group" aria-label="Card type filters">
                {Object.entries(CARD_TYPE_LABELS).map(([type, label]) => (
                  <Badge
                    key={type}
                    variant={filters.card_type?.includes(type as CardType) ? "default" : "outline"}
                    className="cursor-pointer hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    onClick={() => toggleCardType(type as CardType)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleCardType(type as CardType);
                      }
                    }}
                    aria-pressed={filters.card_type?.includes(type as CardType)}
                  >
                    {label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Set Filter */}
            <div>
              <Label htmlFor="set-filter" className="text-sm font-medium mb-2 block">Set</Label>
              <Select value={filters.set_id || ""} onValueChange={(value) => updateFilter('set_id', value || undefined)}>
                <SelectTrigger id="set-filter">
                  <SelectValue placeholder="All Sets" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Sets</SelectItem>
                  {sets.map(set => (
                    <SelectItem key={set.id} value={set.id}>
                      {set.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price Range */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Price Range</Label>
              <div className="flex gap-2">
                <div>
                  <Label htmlFor="min-price" className="sr-only">Minimum price</Label>
                  <Input
                    id="min-price"
                    type="number"
                    placeholder="Min"
                    value={filters.min_price || ''}
                    onChange={(e) => updateFilter('min_price', e.target.value ? Number(e.target.value) : undefined)}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <Label htmlFor="max-price" className="sr-only">Maximum price</Label>
                  <Input
                    id="max-price"
                    type="number"
                    placeholder="Max"
                    value={filters.max_price || ''}
                    onChange={(e) => updateFilter('max_price', e.target.value ? Number(e.target.value) : undefined)}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="text-muted-foreground text-sm" aria-live="polite">
        {cards.length} card{cards.length !== 1 ? 's' : ''} found
      </div>

      {/* Card Grid */}
      <div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"
        role="grid"
        aria-label="Cards grid"
      >
        {cards.map((card, index) => (
          <div key={card.id} role="gridcell">
            <CardDisplay
              card={card}
              size="md"
              showStats={true}
            />
          </div>
        ))}
      </div>

      {/* Empty State */}
      {cards.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="text-muted-foreground text-lg mb-2">No cards found</div>
          <div className="text-muted-foreground text-sm">
            Try adjusting your search criteria or filters
          </div>
        </div>
      )}
    </div>
  );
};

export default CardGrid;
