
import { useState, useEffect } from 'react';
import { useCreatorOnboarding } from '@/hooks/useCreatorOnboarding';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import WelcomeStep from './steps/WelcomeStep';
import InspirationStep from './steps/InspirationStep';
import FirstCardStep from './steps/FirstCardStep';
import DesignToolsStep from './steps/DesignToolsStep';
import PublishStep from './steps/PublishStep';
import MonetizationStep from './steps/MonetizationStep';
import CommunityStep from './steps/CommunityStep';
import CompleteStep from './steps/CompleteStep';

const steps = [
  { id: 'welcome', title: 'Welcome', component: WelcomeStep },
  { id: 'inspiration', title: 'Get Inspired', component: InspirationStep },
  { id: 'first-card', title: 'Create Your First Card', component: FirstCardStep },
  { id: 'design-tools', title: 'Design Tools', component: DesignToolsStep },
  { id: 'publish', title: 'Publishing', component: PublishStep },
  { id: 'monetization', title: 'Monetization', component: MonetizationStep },
  { id: 'community', title: 'Community', component: CommunityStep },
  { id: 'complete', title: 'Complete', component: CompleteStep },
];

interface CreatorOnboardingFlowProps {
  onClose?: () => void;
  onComplete?: () => void;
}

const CreatorOnboardingFlow = ({ onClose, onComplete }: CreatorOnboardingFlowProps) => {
  const { progress, updateStep, completeOnboarding } = useCreatorOnboarding();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Safety check for progress data
  if (!progress) {
    console.log('CreatorOnboardingFlow: No progress data available');
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold mb-2">Loading...</div>
          <div className="text-muted-foreground">Setting up your onboarding experience</div>
        </div>
      </div>
    );
  }

  // Find current step index with safety checks
  const currentStepIndex = steps.findIndex(step => step.id === progress.currentStep);
  const actualStepIndex = currentStepIndex >= 0 ? currentStepIndex : 0;

  const handleNext = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('CreatorOnboardingFlow: Moving to next step');
      if (actualStepIndex < steps.length - 1) {
        const nextStep = steps[actualStepIndex + 1];
        await updateStep(nextStep.id as any);
      } else {
        await completeOnboarding();
        onComplete?.();
      }
    } catch (err) {
      console.error('CreatorOnboardingFlow: Error in handleNext:', err);
      setError('Failed to proceed to next step. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrev = async () => {
    if (actualStepIndex === 0 || isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('CreatorOnboardingFlow: Moving to previous step');
      const prevStep = steps[actualStepIndex - 1];
      await updateStep(prevStep.id as any);
    } catch (err) {
      console.error('CreatorOnboardingFlow: Error in handlePrev:', err);
      setError('Failed to go back. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const CurrentStepComponent = steps[actualStepIndex]?.component;
  const progressValue = ((actualStepIndex + 1) / steps.length) * 100;

  // Safety check for step component
  if (!CurrentStepComponent) {
    console.error('CreatorOnboardingFlow: No component found for step:', actualStepIndex);
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold mb-2 text-destructive">Something went wrong</div>
          <div className="text-muted-foreground mb-4">Unable to load the onboarding step</div>
          <Button onClick={onClose}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-4">Creator Onboarding</h1>
          <Progress value={progressValue} className="w-full mb-2" />
          <p className="text-center text-muted-foreground">
            Step {actualStepIndex + 1} of {steps.length}: {steps[actualStepIndex]?.title || 'Loading...'}
          </p>
        </div>

        {error && (
          <Card className="mb-4 border-destructive">
            <CardContent className="p-4">
              <div className="text-destructive text-sm">{error}</div>
            </CardContent>
          </Card>
        )}

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{steps[actualStepIndex]?.title || 'Loading...'}</CardTitle>
          </CardHeader>
          <CardContent>
            <CurrentStepComponent onNext={handleNext} />
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={actualStepIndex === 0 || isLoading}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <div className="flex gap-2">
            {onClose && (
              <Button variant="outline" onClick={onClose} disabled={isLoading}>
                Skip Tutorial
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : actualStepIndex === steps.length - 1 ? 'Complete' : 'Next'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorOnboardingFlow;
