
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface RarityFilterProps {
  selectedRarity: string;
  onRarityChange: (value: string) => void;
}

const RarityFilter = ({ selectedRarity, onRarityChange }: RarityFilterProps) => {
  return (
    <div className="space-y-3">
      <Label htmlFor="rarity-select" className="text-sm font-semibold">
        Rarity
      </Label>
      <Select value={selectedRarity} onValueChange={onRarityChange}>
        <SelectTrigger id="rarity-select" className="rounded-3xl border-0 bg-background/50 backdrop-blur-sm">
          <SelectValue placeholder="Any Rarity" />
        </SelectTrigger>
        <SelectContent className="rounded-3xl border-0 bg-card/90 backdrop-blur-xl">
          <SelectItem value="all" className="rounded-2xl">Any Rarity</SelectItem>
          <SelectItem value="common" className="rounded-2xl">Common</SelectItem>
          <SelectItem value="uncommon" className="rounded-2xl">Uncommon</SelectItem>
          <SelectItem value="rare" className="rounded-2xl">Rare</SelectItem>
          <SelectItem value="ultra_rare" className="rounded-2xl">Ultra Rare</SelectItem>
          <SelectItem value="legendary" className="rounded-2xl">Legendary</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default RarityFilter;
