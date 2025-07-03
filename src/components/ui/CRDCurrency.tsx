import { cn } from '@/lib/utils';

interface CRDCurrencyProps {
  amount: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showIcon?: boolean;
}

export const CRDCurrency = ({ 
  amount, 
  size = 'md', 
  className,
  showIcon = true 
}: CRDCurrencyProps) => {
  // Display amount in tens (divide by 10)
  const displayAmount = (amount / 10).toFixed(1);
  
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <span className={cn(
      'currency-display inline-flex items-center gap-1 font-semibold',
      sizeClasses[size],
      className
    )}>
      {showIcon && <span className="text-brand-currency">🪙</span>}
      <span className="text-brand-currency">{displayAmount}</span>
      <span className="text-muted-foreground text-xs">CRD</span>
    </span>
  );
};

export default CRDCurrency;