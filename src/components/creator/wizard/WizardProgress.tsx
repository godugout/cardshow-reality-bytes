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
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200",
              isActive && "bg-primary text-white scale-110",
              isCompleted && "bg-green-500 text-white",
              isUpcoming && "bg-slate-700 text-slate-400"
            )}>
              {step.number}
            </div>
            <span className={cn(
              "text-sm font-medium transition-colors duration-200 hidden sm:block",
              isActive && "text-white",
              isCompleted && "text-green-400",
              isUpcoming && "text-slate-400"
            )}>
              {step.label}
            </span>
            {index < steps.length - 1 && (
              <div className={cn(
                "w-8 h-0.5 transition-colors duration-200 hidden sm:block",
                index < currentStepIndex ? "bg-green-500" : "bg-slate-700"
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
};