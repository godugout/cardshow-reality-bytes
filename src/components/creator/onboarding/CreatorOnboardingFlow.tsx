
import { useState } from 'react';
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

const CreatorOnboardingFlow = () => {
  const { currentStep, nextStep, prevStep, completeOnboarding, isLoading } = useCreatorOnboarding();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      nextStep();
    } else {
      completeOnboarding();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      prevStep();
    }
  };

  const CurrentStepComponent = steps[currentStepIndex].component;
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-4">Creator Onboarding</h1>
          <Progress value={progress} className="w-full mb-2" />
          <p className="text-center text-muted-foreground">
            Step {currentStepIndex + 1} of {steps.length}: {steps[currentStepIndex].title}
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{steps[currentStepIndex].title}</CardTitle>
          </CardHeader>
          <CardContent>
            <CurrentStepComponent onNext={handleNext} />
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={isLoading}
          >
            {currentStepIndex === steps.length - 1 ? 'Complete' : 'Next'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatorOnboardingFlow;
