
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Filter, X, Sparkles } from 'lucide-react';
import type { CardRarity, CardType } from '@/types/card';
import { RARITY_LABELS, CARD_TYPE_LABELS } from '@/types/card';

interface SmartFiltersProps {
  onFiltersChange: (filters: any) => void;
  initialFilters?: any;
}

const SmartFilters = ({ onFiltersChange, initialFilters = {} }: SmartFiltersProps) => {
  const [filters, setFilters] = useState({
    rarities: initialFilters.rarities || [],
    cardTypes: initialFilters.cardTypes || [],
    priceRange: initialFilters.priceRange || [0, 1000],
    onlyNew: initialFilters.onlyNew || false,
    onlyTrending: initialFilters.onlyTrending || false,
    minRating: initialFilters.minRating || 0,
    ...initialFilters
  });

  const updateFilter = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const toggleRarity = (rarity: CardRarity) => {
    const current = filters.rarities;
    const updated = current.includes(rarity)
      ? current.filter(r => r !== rarity)
      : [...current, rarity];
    updateFilter('rarities', updated);
  };

  const toggleCardType = (cardType: CardType) => {
    const current = filters.cardTypes;
    const updated = current.includes(cardType)
      ? current.filter(t => t !== cardType)
      : [...current, cardType];
    updateFilter('cardTypes', updated);
  };

  const clearFilters = () => {
    const emptyFilters = {
      rarities: [],
      cardTypes: [],
      priceRange: [0, 1000],
      onlyNew: false,
      onlyTrending: false,
      minRating: 0
    };
    setFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const activeFilterCount = Object.values(filters).flat().filter(Boolean).length;

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#00C851]" />
            Smart Discovery
          </CardTitle>
          {activeFilterCount > 0 && (
            <Button
              onClick={clearFilters}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4 mr-1" />
              Clear ({activeFilterCount})
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Toggles */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-300">Quick Filters</Label>
          <div className="flex items-center justify-between">
            <Label htmlFor="only-new" className="text-sm text-gray-400">
              New This Week
            </Label>
            <Switch
              id="only-new"
              checked={filters.onlyNew}
              onCheckedChange={(checked) => updateFilter('onlyNew', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="only-trending" className="text-sm text-gray-400">
              Trending Only
            </Label>
            <Switch
              id="only-trending"
              checked={filters.onlyTrending}
              onCheckedChange={(checked) => updateFilter('onlyTrending', checked)}
            />
          </div>
        </div>

        {/* Rarity Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-300">Rarity</Label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(RARITY_LABELS).map(([rarity, label]) => (
              <Badge
                key={rarity}
                variant={filters.rarities.includes(rarity) ? "default" : "outline"}
                className="cursor-pointer hover:opacity-80"
                onClick={() => toggleRarity(rarity as CardRarity)}
              >
                {label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Card Type Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-300">Type</Label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(CARD_TYPE_LABELS).map(([type, label]) => (
              <Badge
                key={type}
                variant={filters.cardTypes.includes(type) ? "default" : "outline"}
                className="cursor-pointer hover:opacity-80"
                onClick={() => toggleCardType(type as CardType)}
              >
                {label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-300">
            Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
          </Label>
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => updateFilter('priceRange', value)}
            max={1000}
            min={0}
            step={10}
            className="w-full"
          />
        </div>

        {/* Minimum Rating */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-300">
            Minimum Rating: {filters.minRating}/5
          </Label>
          <Slider
            value={[filters.minRating]}
            onValueChange={(value) => updateFilter('minRating', value[0])}
            max={5}
            min={0}
            step={0.5}
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartFilters;
