import { CreationStep } from '@/types/cardCreation';
import { cn } from '@/lib/utils';

interface WizardProgressProps {
  currentStep: CreationStep;
}

const steps = [
  { key: 'templates', label: 'Template', number: 1 },
  { key: 'upload', label: 'Upload', number: 2 },
  { key: 'details', label: 'Details', number: 3 },
  { key: 'effects', label: 'Effects', number: 4 },
  { key: 'preview', label: 'Preview', number: 5 },
  { key: 'publish', label: 'Publish', number: 6 },
] as const;

export const WizardProgress = ({ currentStep }: WizardProgressProps) => {
  const currentStepIndex = steps.findIndex(step => step.key === currentStep);

  return (
    <div className="flex items-center gap-2">
      {steps.map((step, index) => {
        const isActive = index === currentStepIndex;
        const isCompleted = index < currentStepIndex;
        const isUpcoming = index > currentStepIndex;

        return (
          <div key={step.key} className="flex items-center gap-2">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200 border-2",
              isActive && "bg-primary text-primary-foreground border-primary scale-110 shadow-lg shadow-primary/25",
              isCompleted && "bg-success text-success-foreground border-success",
              isUpcoming && "bg-muted text-muted-foreground border-border"
            )}>
              {step.number}
            </div>
            <span className={cn(
              "text-sm font-medium transition-colors duration-200 hidden sm:block",
              isActive && "text-foreground font-semibold",
              isCompleted && "text-success",
              isUpcoming && "text-muted-foreground"
            )}>
              {step.label}
            </span>
            {index < steps.length - 1 && (
              <div className={cn(
                "w-6 h-0.5 transition-colors duration-200 hidden sm:block rounded-full",
                index < currentStepIndex ? "bg-success" : "bg-border"
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
};