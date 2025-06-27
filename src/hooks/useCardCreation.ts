
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface CardCreationData {
  title: string;
  description: string;
  imageFile: File | null;
  imageUrl: string;
  templateId: string | null;
  designConfig: {
    backgroundColor: string;
    titleColor: string;
    subtitleColor: string;
    borderRadius: number;
    textPosition: 'top' | 'center' | 'bottom';
    effects: {
      holographic: boolean;
      foil: boolean;
      chrome: boolean;
      intensity: number;
    };
  };
  creationMode: 'basic' | 'studio';
  isDraft: boolean;
}

const defaultCardData: CardCreationData = {
  title: '',
  description: '',
  imageFile: null,
  imageUrl: '',
  templateId: null,
  designConfig: {
    backgroundColor: '#1a1a1a',
    titleColor: '#ffffff',
    subtitleColor: '#cccccc',
    borderRadius: 12,
    textPosition: 'bottom',
    effects: {
      holographic: false,
      foil: false,
      chrome: false,
      intensity: 0.5,
    },
  },
  creationMode: 'basic',
  isDraft: true,
};

export const useCardCreation = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [cardData, setCardData] = useState<CardCreationData>(defaultCardData);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const updateCardData = useCallback((updates: Partial<CardCreationData>) => {
    setCardData(prev => ({ ...prev, ...updates }));
  }, []);

  const updateDesignConfig = useCallback((updates: Partial<CardCreationData['designConfig']>) => {
    setCardData(prev => ({
      ...prev,
      designConfig: { ...prev.designConfig, ...updates }
    }));
  }, []);

  const uploadImage = useCallback(async (file: File): Promise<string | null> => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to upload images",
        variant: "destructive",
      });
      return null;
    }

    try {
      setUploadProgress(10);
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      setUploadProgress(50);
      const { data, error } = await supabase.storage
        .from('card-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      setUploadProgress(80);
      const { data: { publicUrl } } = supabase.storage
        .from('card-images')
        .getPublicUrl(data.path);

      setUploadProgress(100);
      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setTimeout(() => setUploadProgress(0), 1000);
    }
  }, [user, toast]);

  const saveCard = useCallback(async (publish = false): Promise<string | null> => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save cards",
        variant: "destructive",
      });
      return null;
    }

    if (!cardData.title.trim()) {
      toast({
        title: "Missing title",
        description: "Please enter a title for your card",
        variant: "destructive",
      });
      return null;
    }

    try {
      setIsLoading(true);

      // Upload image if there's a file
      let finalImageUrl = cardData.imageUrl;
      if (cardData.imageFile && !cardData.imageUrl) {
        finalImageUrl = await uploadImage(cardData.imageFile);
        if (!finalImageUrl) return null;
      }

      const cardInsert = {
        title: cardData.title,
        description: cardData.description || null,
        image_url: finalImageUrl || null,
        creator_id: user.id,
        template_id: cardData.templateId,
        design_metadata: cardData.designConfig,
        is_public: publish,
        rarity: 'common' as const,
      };

      const { data, error } = await supabase
        .from('cards')
        .insert([cardInsert])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: publish ? "Card published!" : "Card saved!",
        description: publish 
          ? "Your card has been published successfully" 
          : "Your card has been saved as a draft",
      });

      // Reset form after successful save
      if (publish) {
        setCardData(defaultCardData);
      }
      
      return data.id;
    } catch (error) {
      console.error('Error saving card:', error);
      toast({
        title: "Save failed",
        description: "Failed to save card. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, cardData, toast, uploadImage]);

  const loadTemplate = useCallback(async (templateId: string) => {
    try {
      const { data, error } = await supabase
        .from('card_templates')
        .select('*')
        .eq('id', templateId)
        .single();

      if (error) throw error;

      // Safely handle template_data - ensure it's an object before spreading
      const templateData = data.template_data && typeof data.template_data === 'object' ? data.template_data : {};

      setCardData(prev => ({
        ...prev,
        templateId: data.id,
        designConfig: {
          ...prev.designConfig,
          ...templateData,
        }
      }));

      toast({
        title: "Template loaded",
        description: `Applied "${data.name}" template`,
      });
    } catch (error) {
      console.error('Error loading template:', error);
      toast({
        title: "Template load failed",
        description: "Failed to load template. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const resetCard = useCallback(() => {
    setCardData(defaultCardData);
    setUploadProgress(0);
  }, []);

  return {
    cardData,
    isLoading,
    uploadProgress,
    updateCardData,
    updateDesignConfig,
    uploadImage,
    saveCard,
    loadTemplate,
    resetCard,
  };
};
