
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { X } from 'lucide-react';
import type { ListingFilters } from '@/types/marketplace';

interface DiscoveryFiltersProps {
  filters: ListingFilters;
  onFiltersChange: (filters: Partial<ListingFilters>) => void;
  onClose: () => void;
}

const DiscoveryFilters = ({ filters, onFiltersChange, onClose }: DiscoveryFiltersProps) => {
  const [priceRange, setPriceRange] = useState([
    filters.min_price || 0,
    filters.max_price || 1000
  ]);

  const rarityOptions = [
    { value: 'common', label: 'Common' },
    { value: 'uncommon', label: 'Uncommon' },
    { value: 'rare', label: 'Rare' },
    { value: 'epic', label: 'Epic' },
    { value: 'legendary', label: 'Legendary' },
  ];

  const conditionOptions = [
    { value: 'mint', label: 'Mint' },
    { value: 'near_mint', label: 'Near Mint' },
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'played', label: 'Played' },
  ];

  const listingTypeOptions = [
    { value: 'buy_now', label: 'Buy Now' },
    { value: 'auction', label: 'Auction' },
    { value: 'offer', label: 'Best Offer' },
  ];

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange(value);
    onFiltersChange({
      min_price: value[0] || undefined,
      max_price: value[1] || undefined
    });
  };

  const handleConditionChange = (condition: string, checked: boolean) => {
    const currentConditions = filters.condition || [];
    const newConditions = checked
      ? [...currentConditions, condition]
      : currentConditions.filter(c => c !== condition);
    
    onFiltersChange({
      condition: newConditions.length > 0 ? newConditions : undefined
    });
  };

  const handleListingTypeChange = (type: string, checked: boolean) => {
    const currentTypes = filters.listing_type || [];
    const newTypes = checked
      ? [...currentTypes, type]
      : currentTypes.filter(t => t !== type);
    
    onFiltersChange({
      listing_type: newTypes.length > 0 ? newTypes : undefined
    });
  };

  return (
    <Card className="border-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Advanced Filters</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price Range */}
        <div className="space-y-3">
          <Label>Price Range</Label>
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={handlePriceRangeChange}
              max={1000}
              step={10}
              className="w-full"
            />
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}+</span>
          </div>
        </div>

        {/* Rarity */}
        <div className="space-y-3">
          <Label>Rarity</Label>
          <div className="grid grid-cols-2 gap-2">
            {rarityOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={option.value}
                  checked={filters.rarity === option.value}
                  onCheckedChange={(checked) => 
                    onFiltersChange({
                      rarity: checked ? option.value : undefined
                    })
                  }
                />
                <Label htmlFor={option.value} className="text-sm">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Condition */}
        <div className="space-y-3">
          <Label>Condition</Label>
          <div className="grid grid-cols-2 gap-2">
            {conditionOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`condition-${option.value}`}
                  checked={filters.condition?.includes(option.value) || false}
                  onCheckedChange={(checked) => 
                    handleConditionChange(option.value, checked as boolean)
                  }
                />
                <Label htmlFor={`condition-${option.value}`} className="text-sm">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Listing Type */}
        <div className="space-y-3">
          <Label>Listing Type</Label>
          <div className="grid grid-cols-2 gap-2">
            {listingTypeOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`type-${option.value}`}
                  checked={filters.listing_type?.includes(option.value) || false}
                  onCheckedChange={(checked) => 
                    handleListingTypeChange(option.value, checked as boolean)
                  }
                />
                <Label htmlFor={`type-${option.value}`} className="text-sm">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="space-y-3">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="Enter city or zip code"
            value={filters.location || ''}
            onChange={(e) => onFiltersChange({ location: e.target.value || undefined })}
          />
        </div>

        {/* Seller Rating */}
        <div className="space-y-3">
          <Label>Minimum Seller Rating</Label>
          <div className="space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <Checkbox
                  id={`rating-${rating}`}
                  checked={filters.seller_rating === rating}
                  onCheckedChange={(checked) => 
                    onFiltersChange({
                      seller_rating: checked ? rating : undefined
                    })
                  }
                />
                <Label htmlFor={`rating-${rating}`} className="text-sm">
                  {rating}+ Stars
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DiscoveryFilters;
