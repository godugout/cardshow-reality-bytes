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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="text-slate-300 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Studio
              </Button>
              <div className="h-6 w-px bg-slate-600" />
              <h1 className="text-xl font-bold text-white">
                Create New Card
              </h1>
              {wizard.hasCachedData && (
                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs text-green-400 font-medium">Draft Saved</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-4">
              {wizard.hasCachedData && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={wizard.clearCache}
                  className="text-slate-400 hover:text-slate-300 text-xs"
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
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {renderCurrentStep()}
        </div>
      </div>

      {/* Navigation */}
      <WizardNavigation wizard={wizard} />
    </div>
  );
};