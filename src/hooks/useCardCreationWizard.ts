import { useState, useCallback, useEffect } from 'react';
import { CardCreationState, CreationStep, defaultCreationState, Template } from '@/types/cardCreation';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const CACHE_KEY = 'cardCreationWizard_cache';

export const useCardCreationWizard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [state, setState] = useState<CardCreationState>(defaultCreationState);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<Record<string, string>>({});

  // Load cached data on mount
  useEffect(() => {
    const loadCachedData = () => {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsedCache = JSON.parse(cached);
          if (parsedCache.userId === user?.id) {
            setState(parsedCache.state);
            setUploadedImageUrls(parsedCache.uploadedImageUrls || {});
            console.log('Loaded cached card creation data');
          }
        }
      } catch (error) {
        console.error('Error loading cached data:', error);
      }
    };

    if (user) {
      loadCachedData();
    }
  }, [user]);

  // Cache data whenever state changes
  useEffect(() => {
    if (user && state.currentStep !== 'templates') {
      try {
        const cacheData = {
          userId: user.id,
          state,
          uploadedImageUrls,
          timestamp: Date.now()
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
        console.log('Cached card creation data');
      } catch (error) {
        console.error('Error caching data:', error);
      }
    }
  }, [state, uploadedImageUrls, user]);

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

      console.log('Uploading image:', fileName);

      const { data, error } = await supabase.storage
        .from('card-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('card-images')
        .getPublicUrl(data.path);

      console.log('Upload successful, URL:', publicUrl);

      // Store both the file AND the uploaded URL
      setState(prev => ({
        ...prev,
        images: {
          ...prev.images,
          [type]: file
        }
      }));

      // Store the uploaded URL separately for preview
      setUploadedImageUrls(prev => ({
        ...prev,
        [type]: publicUrl
      }));

      toast({
        title: "Image uploaded successfully",
        description: "Your image is ready for preview",
      });

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: `Failed to upload image: ${error.message}`,
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

      // Use already uploaded image URL instead of re-uploading
      const imageUrl = uploadedImageUrls.main || null;
      
      if (!imageUrl && state.images.main) {
        // Fallback: upload if we somehow don't have the URL
        console.log('No cached URL found, uploading image...');
        const uploadedUrl = await uploadImage(state.images.main);
        if (!uploadedUrl) {
          toast({
            title: "Image upload failed",
            description: "Please try uploading your image again",
            variant: "destructive",
          });
          return null;
        }
      }

      console.log('Saving card with image URL:', imageUrl);

      // Ensure template_id is a valid UUID or null
      let templateId = state.selectedTemplate?.id || null;
      if (templateId && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(templateId)) {
        console.warn('Invalid template ID format, setting to null:', templateId);
        templateId = null;
      }

      const cardInsert = {
        title: state.cardDetails.title,
        description: state.cardDetails.description || null,
        image_url: imageUrl,
        creator_id: user.id,
        template_id: templateId,
        design_metadata: {
          effects: state.visualEffects,
          colors: state.colors,
          textStyles: state.textStyles,
        },
        rarity: state.cardDetails.rarity as any,
        card_type: state.cardDetails.cardType as any,
        is_public: publish,
        price: state.price,
      };

      console.log('Card insert data:', cardInsert);

      const { data, error } = await supabase
        .from('cards')
        .insert([cardInsert])
        .select('*, series_one_number')
        .single();

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      console.log('Card saved successfully:', data);

      if (publish && data.series_one_number) {
        toast({
          title: "Card Published!",
          description: `Your card has been published as CRD Series One #${data.series_one_number}`,
        });
      } else if (publish) {
        toast({
          title: "Card Published!",
          description: "Your card has been published successfully",
        });
      } else {
        toast({
          title: "Draft Saved!",
          description: "Your card has been saved as a draft",
        });
      }

      // Clear cache after successful save
      if (publish) {
        localStorage.removeItem(CACHE_KEY);
        setState(defaultCreationState);
        setUploadedImageUrls({});
      }
      
      return data.id;
    } catch (error) {
      console.error('Error saving card:', error);
      toast({
        title: "Save failed",
        description: `Failed to save card: ${error.message}. Your work is cached locally.`,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, state, toast, uploadedImageUrls, uploadImage]);

  const resetWizard = useCallback(() => {
    localStorage.removeItem(CACHE_KEY);
    setState(defaultCreationState);
    setUploadedImageUrls({});
  }, []);

  const clearCache = useCallback(() => {
    localStorage.removeItem(CACHE_KEY);
    toast({
      title: "Cache cleared",
      description: "Local cached data has been removed",
    });
  }, [toast]);

  const getImagePreviewUrl = useCallback((type: 'main' | 'background' | 'overlay' = 'main') => {
    // Return the uploaded URL for preview, or create object URL from file as fallback
    if (uploadedImageUrls[type]) {
      return uploadedImageUrls[type];
    }
    if (state.images[type]) {
      return URL.createObjectURL(state.images[type]);
    }
    return null;
  }, [uploadedImageUrls, state.images]);

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
    clearCache,
    getImagePreviewUrl,
    isLoading,
    hasCachedData: Object.keys(uploadedImageUrls).length > 0 || state.currentStep !== 'templates',
  };
};