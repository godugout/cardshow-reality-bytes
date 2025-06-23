
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';

interface AssetFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  assetTypeFilter: string;
  onAssetTypeChange: (type: string) => void;
}

const AssetFilters = ({ 
  searchTerm, 
  onSearchChange, 
  assetTypeFilter, 
  onAssetTypeChange 
}: AssetFiltersProps) => {
  return (
    <div className="flex gap-4 items-center">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          className="pl-10 bg-gray-800 border-gray-700 text-white"
          placeholder="Search assets..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <Select value={assetTypeFilter} onValueChange={onAssetTypeChange}>
        <SelectTrigger className="w-48 bg-gray-800 border-gray-700">
          <Filter className="h-4 w-4 mr-2" />
          <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Types</SelectItem>
          <SelectItem value="texture">Textures</SelectItem>
          <SelectItem value="shape">3D Shapes</SelectItem>
          <SelectItem value="animation">Animations</SelectItem>
          <SelectItem value="shader">Shaders</SelectItem>
          <SelectItem value="template">Templates</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default AssetFilters;
