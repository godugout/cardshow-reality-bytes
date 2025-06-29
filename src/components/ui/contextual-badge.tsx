
import * as React from "react";
import { cn } from "@/lib/utils";
import type { ContextType } from "./contextual-button";

interface ContextualBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  context?: ContextType;
  variant?: 'primary' | 'secondary' | 'outline';
  children: React.ReactNode;
}

const getContextualClasses = (context: ContextType, variant: string) => {
  const contextMap = {
    collections: {
      primary: 'bg-collections text-white',
      secondary: 'bg-collections/10 text-collections border-collections/20',
      outline: 'border-collections text-collections'
    },
    cards: {
      primary: 'bg-cards text-white',
      secondary: 'bg-cards/10 text-cards border-cards/20',
      outline: 'border-cards text-cards'
    },
    marketplace: {
      primary: 'bg-marketplace text-white',
      secondary: 'bg-marketplace/10 text-marketplace border-marketplace/20',
      outline: 'border-marketplace text-marketplace'
    },
    currency: {
      primary: 'bg-currency text-black',
      secondary: 'bg-currency/10 text-currency border-currency/20',
      outline: 'border-currency text-currency'
    },
    default: {
      primary: 'bg-primary text-primary-foreground',
      secondary: 'bg-secondary text-secondary-foreground border-border',
      outline: 'border-border text-foreground'
    }
  };

  return contextMap[context]?.[variant] || contextMap.default[variant];
};

const ContextualBadge = React.forwardRef<HTMLDivElement, ContextualBadgeProps>(
  ({ className, context = 'default', variant = 'primary', ...props }, ref) => {
    return (
      <div
        className={cn(
          "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          getContextualClasses(context, variant),
          variant === 'outline' && 'border bg-background',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

ContextualBadge.displayName = "ContextualBadge";

export { ContextualBadge };
