
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
          <div key={i} className="w-64 h-80 bg-gray-800 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Search and Filter Header */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search cards by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-900 border-gray-700 text-white"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="border-gray-700 text-gray-300"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
          
          {activeFilterCount > 0 && (
            <Button variant="ghost" onClick={clearFilters} size="sm">
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Rarity Filter */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Rarity</label>
              <div className="flex flex-wrap gap-1">
                {Object.entries(RARITY_LABELS).map(([rarity, label]) => (
                  <Badge
                    key={rarity}
                    variant={filters.rarity?.includes(rarity as CardRarity) ? "default" : "outline"}
                    className="cursor-pointer hover:opacity-80"
                    onClick={() => toggleRarity(rarity as CardRarity)}
                  >
                    {label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Card Type Filter */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Type</label>
              <div className="flex flex-wrap gap-1">
                {Object.entries(CARD_TYPE_LABELS).map(([type, label]) => (
                  <Badge
                    key={type}
                    variant={filters.card_type?.includes(type as CardType) ? "default" : "outline"}
                    className="cursor-pointer hover:opacity-80"
                    onClick={() => toggleCardType(type as CardType)}
                  >
                    {label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Set Filter */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Set</label>
              <Select value={filters.set_id || ""} onValueChange={(value) => updateFilter('set_id', value || undefined)}>
                <SelectTrigger className="bg-gray-800 border-gray-700">
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
              <label className="text-sm font-medium text-gray-300 mb-2 block">Price Range</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.min_price || ''}
                  onChange={(e) => updateFilter('min_price', e.target.value ? Number(e.target.value) : undefined)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.max_price || ''}
                  onChange={(e) => updateFilter('max_price', e.target.value ? Number(e.target.value) : undefined)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="text-gray-400 text-sm">
        {cards.length} card{cards.length !== 1 ? 's' : ''} found
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {cards.map(card => (
          <CardDisplay
            key={card.id}
            card={card}
            size="md"
            showStats={true}
          />
        ))}
      </div>

      {/* Empty State */}
      {cards.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No cards found</div>
          <div className="text-gray-500 text-sm">
            Try adjusting your search criteria or filters
          </div>
        </div>
      )}
    </div>
  );
};

export default CardGrid;
