
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { DesignAsset } from '@/types/advanced-creator';

export const useDesignAssets = (assetType?: string, creatorId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: assets = [], isLoading } = useQuery({
    queryKey: ['design-assets', assetType, creatorId],
    queryFn: async () => {
      let query = supabase
        .from('design_assets_library')
        .select('*')
        .order('created_at', { ascending: false });

      if (assetType) {
        query = query.eq('asset_type', assetType);
      }

      if (creatorId) {
        query = query.eq('creator_id', creatorId);
      } else {
        // Show public assets if not filtering by creator
        query = query.in('usage_rights', ['public', 'commercial']);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as DesignAsset[];
    }
  });

  const { data: myAssets = [], isLoading: isLoadingMyAssets } = useQuery({
    queryKey: ['my-design-assets', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data: creatorProfile } = await supabase
        .from('creator_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!creatorProfile) return [];

      const { data, error } = await supabase
        .from('design_assets_library')
        .select('*')
        .eq('creator_id', creatorProfile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as DesignAsset[];
    },
    enabled: !!user
  });

  const uploadAsset = useMutation({
    mutationFn: async (assetData: Omit<DesignAsset, 'id' | 'creator_id' | 'downloads_count' | 'revenue_generated' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('Must be logged in');

      const { data: creatorProfile } = await supabase
        .from('creator_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!creatorProfile) throw new Error('Creator profile required');

      const { data, error } = await supabase
        .from('design_assets_library')
        .insert({
          ...assetData,
          creator_id: creatorProfile.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['design-assets'] });
      queryClient.invalidateQueries({ queryKey: ['my-design-assets'] });
      toast({
        title: 'Asset uploaded',
        description: 'Your design asset has been uploaded successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Upload failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  const downloadAsset = useMutation({
    mutationFn: async (assetId: string) => {
      // First get current downloads count
      const { data: currentAsset, error: fetchError } = await supabase
        .from('design_assets_library')
        .select('downloads_count, file_url, asset_name')
        .eq('id', assetId)
        .single();

      if (fetchError) throw fetchError;

      // Update download count manually
      const { error } = await supabase
        .from('design_assets_library')
        .update({ downloads_count: (currentAsset.downloads_count || 0) + 1 })
        .eq('id', assetId);

      if (error) throw error;

      return {
        file_url: currentAsset.file_url,
        asset_name: currentAsset.asset_name
      };
    },
    onSuccess: (asset) => {
      queryClient.invalidateQueries({ queryKey: ['design-assets'] });
      
      // Trigger download
      const link = document.createElement('a');
      link.href = asset.file_url;
      link.download = asset.asset_name;
      link.click();
      
      toast({
        title: 'Download started',
        description: 'Asset download has begun.',
      });
    }
  });

  return {
    assets,
    myAssets,
    isLoading,
    isLoadingMyAssets,
    uploadAsset: uploadAsset.mutate,
    downloadAsset: downloadAsset.mutate,
    isUploading: uploadAsset.isPending,
    isDownloading: downloadAsset.isPending
  };
};
