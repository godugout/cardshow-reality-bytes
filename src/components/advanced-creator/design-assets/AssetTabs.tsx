
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import AssetCard from './AssetCard';
import type { DesignAsset } from '@/types/advanced-creator';

interface AssetTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  filteredAssets: DesignAsset[];
  myAssets: DesignAsset[];
  onDownload: (assetId: string) => void;
}

const AssetTabs = ({ 
  activeTab, 
  onTabChange, 
  filteredAssets, 
  myAssets, 
  onDownload 
}: AssetTabsProps) => {
  const featuredAssets = filteredAssets.filter(asset => asset.is_featured);

  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className="grid w-full grid-cols-3 bg-gray-900">
        <TabsTrigger value="browse">Browse Assets</TabsTrigger>
        <TabsTrigger value="my-assets">My Assets</TabsTrigger>
        <TabsTrigger value="featured">Featured</TabsTrigger>
      </TabsList>

      <TabsContent value="browse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAssets.map((asset) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              onDownload={onDownload}
            />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="my-assets">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {myAssets.map((asset) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              onDownload={onDownload}
              showRevenue={true}
            />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="featured">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredAssets.map((asset) => (
            <div key={asset.id} className="relative">
              <AssetCard
                asset={asset}
                onDownload={onDownload}
              />
              <div className="absolute top-2 left-2">
                <Badge className="bg-yellow-600 text-xs">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default AssetTabs;
