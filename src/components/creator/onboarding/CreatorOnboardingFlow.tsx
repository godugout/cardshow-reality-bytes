
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useCreatorOnboarding, OnboardingStep } from '@/hooks/useCreatorOnboarding';
import { WelcomeStep } from './steps/WelcomeStep';
import { InspirationStep } from './steps/InspirationStep';
import { FirstCardStep } from './steps/FirstCardStep';
import { DesignToolsStep } from './steps/DesignToolsStep';
import { PublishStep } from './steps/PublishStep';
import { MonetizationStep } from './steps/MonetizationStep';
import { CommunityStep } from './steps/CommunityStep';
import { CompleteStep } from './steps/CompleteStep';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface CreatorOnboardingFlowProps {
  onClose: () => void;
  onComplete: () => void;
}

const stepOrder: OnboardingStep[] = [
  'welcome',
  'inspiration', 
  'first-card',
  'design-tools',
  'publish',
  'monetization',
  'community',
  'complete'
];

export const CreatorOnboardingFlow = ({ onClose, onComplete }: CreatorOnboardingFlowProps) => {
  const { progress, updateStep, completeOnboarding } = useCreatorOnboarding();
  const [isSkipping, setIsSkipping] = useState(false);

  const currentStepIndex = stepOrder.indexOf(progress.currentStep);
  const progressPercentage = ((currentStepIndex + 1) / stepOrder.length) * 100;

  const handleNext = async () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < stepOrder.length) {
      await updateStep(stepOrder[nextIndex]);
    } else {
      await completeOnboarding();
      onComplete();
    }
  };

  const handlePrevious = async () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      await updateStep(stepOrder[prevIndex]);
    }
  };

  const handleSkip = async () => {
    setIsSkipping(true);
    await completeOnboarding();
    onComplete();
  };

  const renderCurrentStep = () => {
    const stepProps = {
      onNext: handleNext,
      onPrevious: handlePrevious,
      canGoNext: true,
      canGoPrevious: currentStepIndex > 0,
    };

    switch (progress.currentStep) {
      case 'welcome':
        return <WelcomeStep {...stepProps} />;
      case 'inspiration':
        return <InspirationStep {...stepProps} />;
      case 'first-card':
        return <FirstCardStep {...stepProps} />;
      case 'design-tools':
        return <DesignToolsStep {...stepProps} />;
      case 'publish':
        return <PublishStep {...stepProps} />;
      case 'monetization':
        return <MonetizationStep {...stepProps} />;
      case 'community':
        return <CommunityStep {...stepProps} />;
      case 'complete':
        return <CompleteStep onFinish={onComplete} />;
      default:
        return <WelcomeStep {...stepProps} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Creator Journey</h1>
              <p className="text-muted-foreground">
                Step {currentStepIndex + 1} of {stepOrder.length}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {Math.round(progressPercentage)}% Complete
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="hover:bg-muted"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Content */}
        <CardContent className="p-0 max-h-[calc(90vh-200px)] overflow-y-auto">
          {renderCurrentStep()}
        </CardContent>

        {/* Footer */}
        <div className="p-6 border-t bg-card flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleSkip}
            disabled={isSkipping}
            className="text-muted-foreground hover:text-foreground"
          >
            Skip for now
          </Button>
          
          <div className="flex items-center gap-2">
            {currentStepIndex > 0 && (
              <Button
                variant="outline"
                onClick={handlePrevious}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
            )}
            
            {progress.currentStep !== 'complete' && (
              <Button
                onClick={handleNext}
                className="flex items-center gap-2"
              >
                {currentStepIndex === stepOrder.length - 2 ? 'Complete' : 'Continue'}
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
