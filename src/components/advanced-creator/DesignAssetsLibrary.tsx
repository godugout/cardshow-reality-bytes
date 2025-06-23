
import { useState } from 'react';
import { useDesignAssets } from '@/hooks/advanced-creator/useDesignAssets';
import AssetUploadDialog from './design-assets/AssetUploadDialog';
import AssetFilters from './design-assets/AssetFilters';
import AssetTabs from './design-assets/AssetTabs';

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

  const filteredAssets = assets.filter(asset => 
    asset.asset_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleUpload = (assetData: any) => {
    uploadAsset(assetData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Design Assets Library</h2>
          <p className="text-gray-400">Manage and discover reusable design components</p>
        </div>
        <AssetUploadDialog
          open={showUploadDialog}
          onOpenChange={setShowUploadDialog}
          onUpload={handleUpload}
          isUploading={isUploading}
        />
      </div>

      {/* Filters */}
      <AssetFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        assetTypeFilter={assetTypeFilter}
        onAssetTypeChange={setAssetTypeFilter}
      />

      {/* Tabs with Asset Grids */}
      <AssetTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        filteredAssets={filteredAssets}
        myAssets={myAssets}
        onDownload={downloadAsset}
      />
    </div>
  );
};
