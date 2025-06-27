
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PriceRangeFilterProps {
  priceRange: { min: string; max: string };
  onPriceChange: (type: 'min' | 'max', value: string) => void;
}

const PriceRangeFilter = ({ priceRange, onPriceChange }: PriceRangeFilterProps) => {
  return (
    <div>
      <Label className="text-sm font-medium mb-2 block">Price Range</Label>
      <div className="flex gap-2">
        <div>
          <Label htmlFor="min-price" className="sr-only">Minimum price</Label>
          <Input
            id="min-price"
            type="number"
            placeholder="Min $"
            value={priceRange.min}
            onChange={(e) => onPriceChange('min', e.target.value)}
            className="text-sm"
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <Label htmlFor="max-price" className="sr-only">Maximum price</Label>
          <Input
            id="max-price"
            type="number"
            placeholder="Max $"
            value={priceRange.max}
            onChange={(e) => onPriceChange('max', e.target.value)}
            className="text-sm"
            min="0"
            step="0.01"
          />
        </div>
      </div>
    </div>
  );
};

export default PriceRangeFilter;
