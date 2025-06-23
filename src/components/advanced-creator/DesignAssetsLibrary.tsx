
import { useState } from 'react';
import { useDesignAssets } from '@/hooks/advanced-creator/useDesignAssets';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  Download, 
  Search, 
  Filter, 
  Package, 
  DollarSign,
  Eye,
  Star,
  Plus,
  Image,
  Cube,
  Palette,
  Zap
} from 'lucide-react';
import type { DesignAsset } from '@/types/advanced-creator';

export const DesignAssetsLibrary = () => {
  const [activeTab, setActiveTab] = useState('browse');
  const [assetTypeFilter, setAssetTypeFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  
  const { 
    assets, 
    myAssets, 
    isLoading, 
    uploadAsset, 
    downloadAsset,
    isUploading 
  } = useDesignAssets(assetTypeFilter);

  const [newAsset, setNewAsset] = useState<Partial<DesignAsset>>({
    asset_type: 'texture',
    usage_rights: 'creator_only',
    price: 0,
    tags: [],
    categories: [],
    metadata: {}
  });

  const filteredAssets = assets.filter(asset => 
    asset.asset_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getAssetTypeIcon = (type: string) => {
    switch (type) {
      case 'texture': return <Image className="h-4 w-4" />;
      case 'shape': return <Cube className="h-4 w-4" />;
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

  const handleUpload = () => {
    if (newAsset.asset_name && newAsset.file_url && newAsset.asset_type) {
      uploadAsset(newAsset as any);
      setShowUploadDialog(false);
      setNewAsset({
        asset_type: 'texture',
        usage_rights: 'creator_only',
        price: 0,
        tags: [],
        categories: [],
        metadata: {}
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Design Assets Library</h2>
          <p className="text-gray-400">Manage and discover reusable design components</p>
        </div>
        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload Asset
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Upload Design Asset</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Asset Name</Label>
                <Input
                  className="bg-gray-700 border-gray-600 text-white"
                  value={newAsset.asset_name || ''}
                  onChange={(e) => setNewAsset({...newAsset, asset_name: e.target.value})}
                  placeholder="Enter asset name"
                />
              </div>
              
              <div>
                <Label className="text-gray-300">Asset Type</Label>
                <Select 
                  value={newAsset.asset_type} 
                  onValueChange={(value) => setNewAsset({...newAsset, asset_type: value as any})}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="texture">Texture</SelectItem>
                    <SelectItem value="shape">3D Shape</SelectItem>
                    <SelectItem value="animation">Animation</SelectItem>
                    <SelectItem value="shader">Shader</SelectItem>
                    <SelectItem value="template">Template</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-gray-300">File URL</Label>
                <Input
                  className="bg-gray-700 border-gray-600 text-white"
                  value={newAsset.file_url || ''}
                  onChange={(e) => setNewAsset({...newAsset, file_url: e.target.value})}
                  placeholder="https://..."
                />
              </div>

              <div>
                <Label className="text-gray-300">Usage Rights</Label>
                <Select 
                  value={newAsset.usage_rights} 
                  onValueChange={(value) => setNewAsset({...newAsset, usage_rights: value as any})}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="creator_only">Creator Only</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2">
                <Label className="text-gray-300">Description</Label>
                <Textarea
                  className="bg-gray-700 border-gray-600 text-white"
                  value={newAsset.description || ''}
                  onChange={(e) => setNewAsset({...newAsset, description: e.target.value})}
                  placeholder="Describe your asset..."
                />
              </div>

              <div>
                <Label className="text-gray-300">Price ($)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  className="bg-gray-700 border-gray-600 text-white"
                  value={newAsset.price || 0}
                  onChange={(e) => setNewAsset({...newAsset, price: parseFloat(e.target.value)})}
                />
              </div>

              <div>
                <Label className="text-gray-300">Tags (comma-separated)</Label>
                <Input
                  className="bg-gray-700 border-gray-600 text-white"
                  value={newAsset.tags?.join(', ') || ''}
                  onChange={(e) => setNewAsset({...newAsset, tags: e.target.value.split(',').map(t => t.trim())})}
                  placeholder="texture, metal, seamless"
                />
              </div>

              <div className="col-span-2">
                <Button 
                  onClick={handleUpload} 
                  disabled={isUploading}
                  className="w-full"
                >
                  {isUploading ? 'Uploading...' : 'Upload Asset'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 bg-gray-900">
          <TabsTrigger value="browse">Browse Assets</TabsTrigger>
          <TabsTrigger value="my-assets">My Assets</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
        </TabsList>

        {/* Filters */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              className="pl-10 bg-gray-800 border-gray-700 text-white"
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={assetTypeFilter} onValueChange={setAssetTypeFilter}>
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

        <TabsContent value="browse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAssets.map((asset) => (
              <Card key={asset.id} className="bg-gray-800 border-gray-700 overflow-hidden">
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
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">{asset.description}</p>
                  
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

                  <div className="flex gap-2 mb-3">
                    {asset.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Button 
                    onClick={() => downloadAsset(asset.id)}
                    size="sm" 
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my-assets">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {myAssets.map((asset) => (
              <Card key={asset.id} className="bg-gray-800 border-gray-700 overflow-hidden">
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
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="featured">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {assets.filter(asset => asset.is_featured).map((asset) => (
              <Card key={asset.id} className="bg-gray-800 border-gray-700 overflow-hidden border-yellow-500/50">
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
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-yellow-600 text-xs">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  </div>
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="text-xs">
                      {asset.asset_type}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="text-white font-medium mb-2">{asset.asset_name}</h3>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">{asset.description}</p>
                  
                  <Button 
                    onClick={() => downloadAsset(asset.id)}
                    size="sm" 
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
