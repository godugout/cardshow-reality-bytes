
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, DollarSign, Package, Image, Box, Palette, Zap } from 'lucide-react';
import type { DesignAsset } from '@/types/advanced-creator';

interface AssetCardProps {
  asset: DesignAsset;
  onDownload: (assetId: string) => void;
  showRevenue?: boolean;
}

const AssetCard = ({ asset, onDownload, showRevenue = false }: AssetCardProps) => {
  const getAssetTypeIcon = (type: string) => {
    switch (type) {
      case 'texture': return <Image className="h-4 w-4" />;
      case 'shape': return <Box className="h-4 w-4" />;
      case 'animation': return <Zap className="h-4 w-4" />;
      case 'shader': return <Palette className="h-4 w-4" />;
      case 'template': return <Package className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Card className="bg-gray-800 border-gray-700 overflow-hidden">
      <div className="aspect-video bg-gray-700 relative">
        {asset.thumbnail_url ? (
          <img 
            src={asset.thumbnail_url} 
            alt={asset.asset_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {getAssetTypeIcon(asset.asset_type)}
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="text-xs">
            {asset.asset_type}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="text-white font-medium mb-2">{asset.asset_name}</h3>
        
        {asset.description && (
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">{asset.description}</p>
        )}
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Download className="h-3 w-3" />
            {asset.downloads_count}
          </div>
          <div className="flex items-center gap-1">
            {asset.price > 0 ? (
              <span className="text-green-400 font-medium">${asset.price}</span>
            ) : (
              <Badge variant="outline" className="text-xs">Free</Badge>
            )}
          </div>
        </div>

        {showRevenue && (
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-400 mb-3">
            <div className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              {asset.downloads_count}
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              ${asset.revenue_generated.toFixed(2)}
            </div>
          </div>
        )}

        <div className="flex gap-2 mb-3">
          {asset.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {showRevenue ? (
          <div className="flex items-center justify-between">
            <Badge 
              variant={asset.usage_rights === 'public' ? 'default' : 'secondary'}
              className="text-xs"
            >
              {asset.usage_rights}
            </Badge>
            <span className="text-xs text-gray-500">
              {formatFileSize(asset.file_size)}
            </span>
          </div>
        ) : (
          <Button 
            onClick={() => onDownload(asset.id)}
            size="sm" 
            className="w-full"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default AssetCard;
