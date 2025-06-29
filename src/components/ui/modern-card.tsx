
import * as React from "react";
import { cn } from "@/lib/utils";

interface ModernCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'elevated' | 'glow';
  interactive?: boolean;
}

const ModernCard = React.forwardRef<HTMLDivElement, ModernCardProps>(
  ({ className, variant = 'default', interactive = false, ...props }, ref) => {
    const variantClasses = {
      default: 'modern-card',
      glass: 'glass-card rounded-3xl',
      elevated: 'modern-card-elevated',
      glow: 'modern-card glow-subtle'
    };

    return (
      <div
        ref={ref}
        className={cn(
          variantClasses[variant],
          interactive && 'floating cursor-pointer',
          className
        )}
        {...props}
      />
    );
  }
);

ModernCard.displayName = "ModernCard";

const ModernCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-3 p-8 pb-6", className)}
    {...props}
  />
));
ModernCardHeader.displayName = "ModernCardHeader";

const ModernCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-2xl font-bold leading-tight", className)}
    {...props}
  />
));
ModernCardTitle.displayName = "ModernCardTitle";

const ModernCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-base text-muted-foreground leading-relaxed", className)}
    {...props}
  />
));
ModernCardDescription.displayName = "ModernCardDescription";

const ModernCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-8 pt-0", className)} {...props} />
));
ModernCardContent.displayName = "ModernCardContent";

export { 
  ModernCard, 
  ModernCardHeader, 
  ModernCardTitle, 
  ModernCardDescription, 
  ModernCardContent 
};
