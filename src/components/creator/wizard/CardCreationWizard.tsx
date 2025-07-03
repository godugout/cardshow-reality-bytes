import { useState } from 'react';
import { useCardCreationWizard } from '@/hooks/useCardCreationWizard';
import { TemplateSelection } from './steps/TemplateSelection';
import { ImageUpload } from './steps/ImageUpload';
import { CardDetails } from './steps/CardDetails';
import { VisualEffects } from './steps/VisualEffects';
import { CardPreview } from './steps/CardPreview';
import { PublishCard } from './steps/PublishCard';
import { WizardNavigation } from './WizardNavigation';
import { WizardProgress } from './WizardProgress';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CardCreationWizardProps {
  onBack: () => void;
}

export const CardCreationWizard = ({ onBack }: CardCreationWizardProps) => {
  const wizard = useCardCreationWizard();

  const renderCurrentStep = () => {
    switch (wizard.state.currentStep) {
      case 'templates':
        return <TemplateSelection wizard={wizard} />;
      case 'upload':
        return <ImageUpload wizard={wizard} />;
      case 'details':
        return <CardDetails wizard={wizard} />;
      case 'effects':
        return <VisualEffects wizard={wizard} />;
      case 'preview':
        return <CardPreview wizard={wizard} />;
      case 'publish':
        return <PublishCard wizard={wizard} />;
      default:
        return <TemplateSelection wizard={wizard} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/80 backdrop-blur-xl shadow-card">
        <div className="container mx-auto px-lg py-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-md">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Studio
              </Button>
              <div className="h-6 w-px bg-border" />
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-brand-cards to-brand-cards/80 flex items-center justify-center text-white font-bold text-sm">
                  C
                </div>
                Create New Card
              </h1>
              {wizard.hasCachedData && (
                <div className="flex items-center gap-2 px-3 py-1 bg-success/10 border border-success/30 rounded-lg">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                  <span className="text-xs text-success font-medium">Draft Saved</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-md">
              {wizard.hasCachedData && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={wizard.clearCache}
                >
                  Clear Cache
                </Button>
              )}
              <WizardProgress currentStep={wizard.state.currentStep} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-lg py-xl">
        <div className="max-w-6xl mx-auto">
          {renderCurrentStep()}
        </div>
      </div>

      {/* Navigation */}
      <WizardNavigation wizard={wizard} />
    </div>
  );
};