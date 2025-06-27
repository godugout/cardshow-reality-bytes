
import { useState, useEffect } from 'react';
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

export const useCreatorOnboarding = () => {
  const { user } = useAuth();
  const { cards } = useCards({ creator_id: user?.id });
  const [progress, setProgress] = useState<OnboardingProgress>({
    currentStep: 'welcome',
    completedSteps: [],
    isOnboardingComplete: false,
    hasCreatedCard: false,
    hasPublishedCard: false,
  });

  // Load onboarding progress from database
  useEffect(() => {
    if (!user) return;

    const loadProgress = async () => {
      const { data, error } = await supabase
        .from('creator_profiles')
        .select('onboarding_step, onboarding_completed')
        .eq('user_id', user.id)
        .single();

      if (data && !error) {
        const stepFromDb = data.onboarding_step || 'welcome';
        const validStep = isValidOnboardingStep(stepFromDb) ? stepFromDb : 'welcome';
        
        setProgress(prev => ({
          ...prev,
          currentStep: validStep,
          isOnboardingComplete: data.onboarding_completed || false,
        }));
      }
    };

    loadProgress();
  }, [user]);

  // Update progress based on user actions
  useEffect(() => {
    if (!cards) return;

    const hasCreated = cards.length > 0;
    const hasPublished = cards.some(card => card.is_public);

    setProgress(prev => ({
      ...prev,
      hasCreatedCard: hasCreated,
      hasPublishedCard: hasPublished,
    }));
  }, [cards]);

  const updateStep = async (step: OnboardingStep) => {
    if (!user) return;

    setProgress(prev => ({
      ...prev,
      currentStep: step,
      completedSteps: [...new Set([...prev.completedSteps, prev.currentStep])],
    }));

    // Save to database
    await supabase
      .from('creator_profiles')
      .upsert({
        user_id: user.id,
        onboarding_step: step,
        onboarding_completed: step === 'complete',
      }, { onConflict: 'user_id' });
  };

  const completeOnboarding = async () => {
    await updateStep('complete');
    setProgress(prev => ({
      ...prev,
      isOnboardingComplete: true,
    }));
  };

  const resetOnboarding = async () => {
    if (!user) return;

    setProgress({
      currentStep: 'welcome',
      completedSteps: [],
      isOnboardingComplete: false,
      hasCreatedCard: false,
      hasPublishedCard: false,
    });

    await supabase
      .from('creator_profiles')
      .upsert({
        user_id: user.id,
        onboarding_step: 'welcome',
        onboarding_completed: false,
      }, { onConflict: 'user_id' });
  };

  return {
    progress,
    updateStep,
    completeOnboarding,
    resetOnboarding,
  };
};
