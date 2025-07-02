import { useState, useCallback } from 'react';
import { CardCreationState, CreationStep, defaultCreationState, Template } from '@/types/cardCreation';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useCardCreationWizard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [state, setState] = useState<CardCreationState>(defaultCreationState);
  const [isLoading, setIsLoading] = useState(false);

  const updateState = useCallback((updates: Partial<CardCreationState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const goToStep = useCallback((step: CreationStep) => {
    setState(prev => ({ ...prev, currentStep: step }));
  }, []);

  const nextStep = useCallback(() => {
    const steps: CreationStep[] = ['templates', 'upload', 'details', 'effects', 'preview', 'publish'];
    const currentIndex = steps.indexOf(state.currentStep);
    if (currentIndex < steps.length - 1) {
      goToStep(steps[currentIndex + 1]);
    }
  }, [state.currentStep, goToStep]);

  const prevStep = useCallback(() => {
    const steps: CreationStep[] = ['templates', 'upload', 'details', 'effects', 'preview', 'publish'];
    const currentIndex = steps.indexOf(state.currentStep);
    if (currentIndex > 0) {
      goToStep(steps[currentIndex - 1]);
    }
  }, [state.currentStep, goToStep]);

  const selectTemplate = useCallback((template: Template) => {
    setState(prev => ({ 
      ...prev, 
      selectedTemplate: template,
      currentStep: 'upload'
    }));
  }, []);

  const uploadImage = useCallback(async (file: File, type: 'main' | 'background' | 'overlay' = 'main') => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to upload images",
        variant: "destructive",
      });
      return null;
    }

    try {
      setIsLoading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}_${type}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('card-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('card-images')
        .getPublicUrl(data.path);

      setState(prev => ({
        ...prev,
        images: {
          ...prev.images,
          [type]: file
        }
      }));

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
      setIsLoading(false);
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

    if (!state.cardDetails.title.trim()) {
      toast({
        title: "Missing title",
        description: "Please enter a title for your card",
        variant: "destructive",
      });
      return null;
    }

    try {
      setIsLoading(true);

      // Upload main image if exists
      let imageUrl = null;
      if (state.images.main) {
        imageUrl = await uploadImage(state.images.main);
        if (!imageUrl) return null;
      }

      const cardInsert = {
        title: state.cardDetails.title,
        description: state.cardDetails.description || null,
        image_url: imageUrl,
        creator_id: user.id,
        template_id: state.selectedTemplate?.id,
        design_metadata: {
          effects: state.visualEffects,
          colors: state.colors,
          textStyles: state.textStyles,
        },
        rarity: state.cardDetails.rarity as any,
        card_type: state.cardDetails.cardType as any,
        is_public: publish && state.isPublic,
        price: state.price,
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
        setState(defaultCreationState);
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
  }, [user, state, toast, uploadImage]);

  const resetWizard = useCallback(() => {
    setState(defaultCreationState);
  }, []);

  return {
    state,
    updateState,
    goToStep,
    nextStep,
    prevStep,
    selectTemplate,
    uploadImage,
    saveCard,
    resetWizard,
    isLoading,
  };
};