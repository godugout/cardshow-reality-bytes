
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { 
  Image, 
  Upload, 
  Search, 
  Filter,
  Trash2,
  Download,
  Settings
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ImageAsset {
  id: string;
  name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  category: string;
  alt_text: string;
  tags: string[];
  is_optimized: boolean;
  cdn_url: string;
  created_at: string;
}

const ImageAssetManager = () => {
  const [assets, setAssets] = useState<ImageAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const { toast } = useToast();

  const categories = ['all', 'general', 'logos', 'backgrounds', 'icons', 'cards', 'avatars'];

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const { data, error } = await supabase
        .from('image_assets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssets(data || []);
    } catch (error) {
      console.error('Error fetching assets:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch image assets',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteAsset = async (id: string) => {
    if (!confirm('Are you sure you want to delete this asset?')) return;

    try {
      const { error } = await supabase
        .from('image_assets')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAssets(prev => prev.filter(asset => asset.id !== id));

      toast({
        title: 'Success',
        description: 'Asset deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting asset:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete asset',
        variant: 'destructive'
      });
    }
  };

  const optimizeAsset = async (id: string) => {
    try {
      const { error } = await supabase
        .from('image_assets')
        .update({ is_optimized: true })
        .eq('id', id);

      if (error) throw error;

      setAssets(prev => prev.map(asset => 
        asset.id === id ? { ...asset, is_optimized: true } : asset
      ));

      toast({
        title: 'Success',
        description: 'Asset optimized successfully',
      });
    } catch (error) {
      console.error('Error optimizing asset:', error);
      toast({
        title: 'Error',
        description: 'Failed to optimize asset',
        variant: 'destructive'
      });
    }
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || asset.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <Card className="bg-gray-900 border-gray-700">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-32 bg-gray-800 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Image Asset Management</h2>
          <p className="text-gray-400">Manage your platform's image assets and media</p>
        </div>
        <Button className="bg-primary text-black">
          <Upload className="w-4 h-4 mr-2" />
          Upload Assets
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-gray-900 border-gray-700">
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search assets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-600 text-white"
                />
              </div>
            </div>
            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="p-2 bg-gray-800 border border-gray-600 rounded text-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Asset Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredAssets.map((asset) => (
          <Card key={asset.id} className="bg-gray-900 border-gray-700 overflow-hidden">
            <div className="aspect-square bg-gray-800 flex items-center justify-center">
              {asset.file_path ? (
                <img
                  src={asset.cdn_url || asset.file_path}
                  alt={asset.alt_text}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className="hidden flex-col items-center text-gray-500">
                <Image className="w-12 h-12 mb-2" />
                <span className="text-sm">No Preview</span>
              </div>
            </div>
            
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="text-white font-medium truncate">{asset.name}</h3>
                  <div className="flex gap-1">
                    <Badge variant={asset.is_optimized ? 'default' : 'secondary'} className="text-xs">
                      {asset.is_optimized ? 'Optimized' : 'Raw'}
                    </Badge>
                  </div>
                </div>
                
                <div className="text-xs text-gray-400 space-y-1">
                  <div>Category: {asset.category}</div>
                  <div>Size: {formatFileSize(asset.file_size)}</div>
                  <div>Type: {asset.mime_type}</div>
                </div>

                {asset.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {asset.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {asset.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{asset.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                <div className="flex gap-1 pt-2">
                  {!asset.is_optimized && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => optimizeAsset(asset.id)}
                      className="flex-1"
                    >
                      <Settings className="w-3 h-3" />
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="flex-1">
                    <Download className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteAsset(asset.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAssets.length === 0 && (
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-12 text-center">
            <Image className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No Assets Found</h3>
            <p className="text-gray-400">
              {searchTerm || categoryFilter !== 'all' 
                ? 'No assets match your search criteria' 
                : 'Upload your first asset to get started'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImageAssetManager;
