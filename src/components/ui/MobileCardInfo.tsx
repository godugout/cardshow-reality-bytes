
import { useAccessibilityFeatures } from '@/hooks/useAccessibilityFeatures';
import { cn } from '@/lib/utils';
import type { Card } from '@/types/card';

interface MobileCardInfoProps {
  card: Card;
  className?: string;
}

const MobileCardInfo = ({ card, className }: MobileCardInfoProps) => {
  const { a11yState } = useAccessibilityFeatures();

  return (
    <div className={cn('p-3 h-1/4 flex flex-col justify-between', className)}>
      <h3 
        className={cn(
          'font-bold text-white text-sm truncate',
          a11yState.fontSize === 'large' && 'text-base',
          a11yState.fontSize === 'xl' && 'text-lg',
          a11yState.highContrastMode && 'text-white drop-shadow-lg'
        )}
        title={card.title}
      >
        {card.title}
      </h3>
      
      {card.description && (
        <p 
          className={cn(
            'text-xs text-gray-400 line-clamp-2 mt-1',
            a11yState.fontSize === 'large' && 'text-sm',
            a11yState.fontSize === 'xl' && 'text-base',
            a11yState.highContrastMode && 'text-gray-200'
          )}
        >
          {card.description}
        </p>
      )}
    </div>
  );
};

export default MobileCardInfo;
