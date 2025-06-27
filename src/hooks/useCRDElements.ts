
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface CRDElement {
  id: string;
  creator_id: string;
  name: string;
  description?: string;
  element_type: 'frame' | 'background' | 'logo' | 'color_theme' | 'effect';
  category?: string;
  preview_image_url?: string;
  asset_urls?: any;
  config: any;
  is_public: boolean;
  is_free: boolean;
  price_cents: number;
  download_count: number;
  rating_average: number;
  rating_count: number;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface CRDFrame {
  id: string;
  creator_id: string;
  name: string;
  description?: string;
  category?: string;
  preview_image_url?: string;
  frame_config: any;
  included_elements: string[];
  is_public: boolean;
  price_cents: number;
  download_count: number;
  rating_average: number;
  rating_count: number;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateCRDElementInput {
  name: string;
  element_type: 'frame' | 'background' | 'logo' | 'color_theme' | 'effect';
  description?: string;
  category?: string;
  preview_image_url?: string;
  asset_urls?: any;
  config?: any;
  is_public?: boolean;
  is_free?: boolean;
  price_cents?: number;
  tags?: string[];
}

export const useCRDElements = (filters?: {
  element_type?: string;
  category?: string;
  is_public?: boolean;
  creator_id?: string;
}) => {
  const { data: elements = [], isLoading } = useQuery({
    queryKey: ['crd-elements', filters],
    queryFn: async () => {
      let query = supabase
        .from('crd_elements')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.element_type) {
        query = query.eq('element_type', filters.element_type);
      }
      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      if (filters?.is_public !== undefined) {
        query = query.eq('is_public', filters.is_public);
      }
      if (filters?.creator_id) {
        query = query.eq('creator_id', filters.creator_id);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as CRDElement[];
    }
  });

  return { elements, isLoading };
};

export const useCreateCRDElement = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (elementData: CreateCRDElementInput) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('crd_elements')
        .insert([{
          ...elementData,
          creator_id: user.id,
          config: elementData.config || {},
          is_public: elementData.is_public ?? false,
          is_free: elementData.is_free ?? true,
          price_cents: elementData.price_cents ?? 0,
          tags: elementData.tags ?? []
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crd-elements'] });
      toast({
        title: "Element created successfully",
        description: "Your CRD element has been saved."
      });
    },
    onError: (error) => {
      toast({
        title: "Error creating element",
        description: error.message,
        variant: "destructive"
      });
    }
  });
};

export const useCRDFrames = (filters?: {
  category?: string;
  is_public?: boolean;
  creator_id?: string;
}) => {
  const { data: frames = [], isLoading } = useQuery({
    queryKey: ['crd-frames', filters],
    queryFn: async () => {
      let query = supabase
        .from('crd_frames')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      if (filters?.is_public !== undefined) {
        query = query.eq('is_public', filters.is_public);
      }
      if (filters?.creator_id) {
        query = query.eq('creator_id', filters.creator_id);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as CRDFrame[];
    }
  });

  return { frames, isLoading };
};

export const useCreatorProgress = () => {
  const { user } = useAuth();
  
  const { data: progress, isLoading } = useQuery({
    queryKey: ['creator-progress', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('creator_progress')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user
  });

  const updateProgress = useMutation({
    mutationFn: async (updates: any) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('creator_progress')
        .upsert([{ user_id: user.id, ...updates }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creator-progress'] });
    }
  });

  const queryClient = useQueryClient();

  return { 
    progress, 
    isLoading, 
    updateProgress: updateProgress.mutate,
    isUpdating: updateProgress.isPending 
  };
};
