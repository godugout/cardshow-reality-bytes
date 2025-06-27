
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface RarityFilterProps {
  selectedRarity: string;
  onRarityChange: (value: string) => void;
}

const RarityFilter = ({ selectedRarity, onRarityChange }: RarityFilterProps) => {
  return (
    <div>
      <Label htmlFor="rarity-select" className="text-sm font-medium mb-2 block">
        Rarity
      </Label>
      <Select value={selectedRarity} onValueChange={onRarityChange}>
        <SelectTrigger id="rarity-select">
          <SelectValue placeholder="Any Rarity" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Any Rarity</SelectItem>
          <SelectItem value="common">Common</SelectItem>
          <SelectItem value="uncommon">Uncommon</SelectItem>
          <SelectItem value="rare">Rare</SelectItem>
          <SelectItem value="ultra_rare">Ultra Rare</SelectItem>
          <SelectItem value="legendary">Legendary</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default RarityFilter;
