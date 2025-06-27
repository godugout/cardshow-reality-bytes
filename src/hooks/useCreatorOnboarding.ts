
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCards } from '@/hooks/useCards';
import { supabase } from '@/integrations/supabase/client';

export type OnboardingStep = 
  | 'welcome'
  | 'inspiration'
  | 'first-card'
  | 'design-tools'
  | 'publish'
  | 'monetization'
  | 'community'
  | 'complete';

interface OnboardingProgress {
  currentStep: OnboardingStep;
  completedSteps: OnboardingStep[];
  isOnboardingComplete: boolean;
  hasCreatedCard: boolean;
  hasPublishedCard: boolean;
}

const isValidOnboardingStep = (step: string): step is OnboardingStep => {
  const validSteps: OnboardingStep[] = [
    'welcome', 'inspiration', 'first-card', 'design-tools', 
    'publish', 'monetization', 'community', 'complete'
  ];
  return validSteps.includes(step as OnboardingStep);
};

const defaultProgress: OnboardingProgress = {
  currentStep: 'welcome',
  completedSteps: [],
  isOnboardingComplete: false,
  hasCreatedCard: false,
  hasPublishedCard: false,
};

export const useCreatorOnboarding = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<OnboardingProgress>(defaultProgress);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Only fetch cards if user exists and is authenticated
  const shouldFetchCards = Boolean(user?.id);
  const cardsFilters = useMemo(() => 
    shouldFetchCards ? { creator_id: user!.id } : {}, 
    [shouldFetchCards, user?.id]
  );
  
  // Use empty filters object when user is not available to prevent hook violations
  const { cards } = useCards(shouldFetchCards ? cardsFilters : {});

  // Load onboarding progress from database
  useEffect(() => {
    if (!user?.id) {
      console.log('useCreatorOnboarding: No user available, using defaults');
      setIsLoading(false);
      setProgress(defaultProgress);
      setError(null);
      return;
    }

    console.log('useCreatorOnboarding: Loading progress for user:', user.id);
    
    const loadProgress = async () => {
      try {
        setError(null);
        const { data, error } = await supabase
          .from('creator_profiles')
          .select('onboarding_step, onboarding_completed')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') { // Not found error is OK
          console.error('useCreatorOnboarding: Error loading progress:', error);
          setError(error.message);
          return;
        }

        if (data) {
          const stepFromDb = data.onboarding_step || 'welcome';
          const validStep = isValidOnboardingStep(stepFromDb) ? stepFromDb : 'welcome';
          
          console.log('useCreatorOnboarding: Loaded progress:', {
            step: validStep,
            completed: data.onboarding_completed
          });
          
          setProgress(prev => ({
            ...prev,
            currentStep: validStep,
            isOnboardingComplete: data.onboarding_completed || false,
          }));
        } else {
          // No existing progress, use defaults
          setProgress(defaultProgress);
        }
      } catch (err) {
        console.error('useCreatorOnboarding: Failed to load progress:', err);
        setError(err instanceof Error ? err.message : 'Failed to load progress');
        setProgress(defaultProgress);
      } finally {
        setIsLoading(false);
      }
    };

    loadProgress();
  }, [user?.id]);

  // Update progress based on user actions - only if we have cards data
  useEffect(() => {
    if (!shouldFetchCards || !cards || !Array.isArray(cards)) {
      return;
    }

    const hasCreated = cards.length > 0;
    const hasPublished = cards.some(card => card.is_public);

    setProgress(prev => ({
      ...prev,
      hasCreatedCard: hasCreated,
      hasPublishedCard: hasPublished,
    }));
  }, [cards, shouldFetchCards]);

  const updateStep = useCallback(async (step: OnboardingStep) => {
    if (!user?.id) {
      console.error('useCreatorOnboarding: No user available for updateStep');
      throw new Error('User not authenticated');
    }

    console.log('useCreatorOnboarding: Updating step to:', step);

    try {
      setError(null);
      
      // Optimistically update UI first
      setProgress(prev => ({
        ...prev,
        currentStep: step,
        completedSteps: [...new Set([...prev.completedSteps, prev.currentStep])],
      }));

      const { error } = await supabase
        .from('creator_profiles')
        .upsert({
          user_id: user.id,
          onboarding_step: step,
          onboarding_completed: step === 'complete',
        }, { onConflict: 'user_id' });

      if (error) {
        console.error('useCreatorOnboarding: Error updating step:', error);
        // Revert optimistic update on error
        setProgress(prev => ({
          ...prev,
          currentStep: prev.completedSteps[prev.completedSteps.length - 1] || 'welcome',
        }));
        throw error;
      }
    } catch (err) {
      console.error('useCreatorOnboarding: Failed to save step:', err);
      setError(err instanceof Error ? err.message : 'Failed to update step');
      throw err;
    }
  }, [user?.id]);

  const completeOnboarding = useCallback(async () => {
    console.log('useCreatorOnboarding: Completing onboarding');
    await updateStep('complete');
    setProgress(prev => ({
      ...prev,
      isOnboardingComplete: true,
    }));
  }, [updateStep]);

  const resetOnboarding = useCallback(async () => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    console.log('useCreatorOnboarding: Resetting onboarding');

    try {
      setError(null);
      setProgress(defaultProgress);

      await supabase
        .from('creator_profiles')
        .upsert({
          user_id: user.id,
          onboarding_step: 'welcome',
          onboarding_completed: false,
        }, { onConflict: 'user_id' });
    } catch (err) {
      console.error('useCreatorOnboarding: Failed to reset onboarding:', err);
      setError(err instanceof Error ? err.message : 'Failed to reset onboarding');
      throw err;
    }
  }, [user?.id]);

  // Memoize the return value to prevent unnecessary re-renders
  const returnValue = useMemo(() => ({
    progress,
    updateStep,
    completeOnboarding,
    resetOnboarding,
    isLoading,
    error,
  }), [progress, updateStep, completeOnboarding, resetOnboarding, isLoading, error]);

  return returnValue;
};
