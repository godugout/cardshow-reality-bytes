
import * as React from "react";
import { cn } from "@/lib/utils";

type ContextType = 'collections' | 'cards' | 'marketplace' | 'currency' | 'default';

interface ContextualButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  context?: ContextType;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const getContextualClasses = (context: ContextType, variant: string) => {
  const contextMap = {
    collections: {
      primary: 'bg-collections text-white hover:bg-collections/90',
      secondary: 'bg-collections/10 text-collections hover:bg-collections/20',
      outline: 'border-collections text-collections hover:bg-collections hover:text-white',
      ghost: 'text-collections hover:bg-collections/10'
    },
    cards: {
      primary: 'bg-cards text-white hover:bg-cards/90',
      secondary: 'bg-cards/10 text-cards hover:bg-cards/20',
      outline: 'border-cards text-cards hover:bg-cards hover:text-white',
      ghost: 'text-cards hover:bg-cards/10'
    },
    marketplace: {
      primary: 'bg-marketplace text-white hover:bg-marketplace/90',
      secondary: 'bg-marketplace/10 text-marketplace hover:bg-marketplace/20',
      outline: 'border-marketplace text-marketplace hover:bg-marketplace hover:text-white',
      ghost: 'text-marketplace hover:bg-marketplace/10'
    },
    currency: {
      primary: 'bg-currency text-black hover:bg-currency/90',
      secondary: 'bg-currency/10 text-currency hover:bg-currency/20',
      outline: 'border-currency text-currency hover:bg-currency hover:text-black',
      ghost: 'text-currency hover:bg-currency/10'
    },
    default: {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      outline: 'border-border text-foreground hover:bg-accent hover:text-accent-foreground',
      ghost: 'text-foreground hover:bg-accent hover:text-accent-foreground'
    }
  };

  return contextMap[context]?.[variant] || contextMap.default[variant];
};

const getSizeClasses = (size: string) => {
  const sizeMap = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-6 text-base',
    lg: 'h-12 px-8 text-lg'
  };
  return sizeMap[size] || sizeMap.md;
};

const ContextualButton = React.forwardRef<HTMLButtonElement, ContextualButtonProps>(
  ({ className, context = 'default', variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          getContextualClasses(context, variant),
          getSizeClasses(size),
          variant === 'outline' && 'border border-input bg-background',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

ContextualButton.displayName = "ContextualButton";

export { ContextualButton };
export type { ContextType };
