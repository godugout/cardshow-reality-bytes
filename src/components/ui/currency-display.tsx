
import * as React from "react";
import { cn } from "@/lib/utils";

interface CurrencyDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  amount: number;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const CurrencyDisplay = React.forwardRef<HTMLDivElement, CurrencyDisplayProps>(
  ({ className, amount, size = 'md', showIcon = true, ...props }, ref) => {
    // Display in tens as specified
    const displayAmount = Math.round(amount / 10);
    
    const sizeClasses = {
      sm: 'text-sm gap-1',
      md: 'text-base gap-1.5', 
      lg: 'text-lg gap-2'
    };

    return (
      <div
        className={cn(
          "inline-flex items-center font-semibold text-currency",
          sizeClasses[size],
          className
        )}
        ref={ref}
        {...props}
      >
        {showIcon && <span className="text-currency">🪙</span>}
        <span>{displayAmount.toLocaleString()}</span>
      </div>
    );
  }
);

CurrencyDisplay.displayName = "CurrencyDisplay";

export { CurrencyDisplay };
