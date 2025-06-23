
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Upload } from 'lucide-react';
import type { DesignAsset } from '@/types/advanced-creator';

interface AssetUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (asset: Partial<DesignAsset>) => void;
  isUploading: boolean;
}

const AssetUploadDialog = ({ open, onOpenChange, onUpload, isUploading }: AssetUploadDialogProps) => {
  const [newAsset, setNewAsset] = useState<Partial<DesignAsset>>({
    asset_type: 'texture',
    usage_rights: 'creator_only',
    price: 0,
    tags: [],
    categories: [],
    metadata: {}
  });

  const handleUpload = () => {
    if (newAsset.asset_name && newAsset.file_url && newAsset.asset_type) {
      onUpload(newAsset);
      onOpenChange(false);
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
    <Dialog open={open} onOpenChange={onOpenChange}>
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
  );
};

export default AssetUploadDialog;
