import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Save, Upload } from 'lucide-react';
import { useCardCreationWizard } from '@/hooks/useCardCreationWizard';

interface WizardNavigationProps {
  wizard: ReturnType<typeof useCardCreationWizard>;
}

export const WizardNavigation = ({ wizard }: WizardNavigationProps) => {
  const { state, nextStep, prevStep, saveCard } = wizard;
  const isFirstStep = state.currentStep === 'templates';
  const isLastStep = state.currentStep === 'publish';

  const handleNext = () => {
    if (isLastStep) {
      saveCard(true); // Publish
    } else {
      nextStep();
    }
  };

  const handleSaveDraft = () => {
    saveCard(false); // Save as draft
  };

  const canProceed = () => {
    switch (state.currentStep) {
      case 'templates':
        return !!state.selectedTemplate;
      case 'upload':
        return !!state.images.main;
      case 'details':
        return !!state.cardDetails.title.trim();
      default:
        return true;
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border shadow-elevation">
      <div className="container mx-auto px-lg py-md">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            {!isFirstStep && (
              <Button
                variant="outline"
                onClick={prevStep}
                size="sm"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
            )}
            {state.currentStep !== 'templates' && (
              <Button
                variant="ghost"
                onClick={handleSaveDraft}
                disabled={wizard.isLoading}
                size="sm"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleNext}
              disabled={!canProceed() || wizard.isLoading}
              size="default"
              className="px-lg"
            >
              {isLastStep ? (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Publish Card
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};