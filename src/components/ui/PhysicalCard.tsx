
import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import type { CardRarity } from '@/types/card';

interface PhysicalCardProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  rarity?: CardRarity;
  surface?: 'matte' | 'satin' | 'gloss' | 'foil' | 'holographic';
  state?: 'resting' | 'hovered' | 'active' | 'floating' | 'premium';
  interactive?: boolean;
  children: React.ReactNode;
}

const PhysicalCard = forwardRef<HTMLDivElement, PhysicalCardProps>(({
  size = 'md',
  rarity = 'common',
  surface,
  state = 'resting',
  interactive = true,
  className,
  children,
  ...props
}, ref) => {
  // Determine surface finish from rarity if not explicitly set
  const cardSurface = surface || {
    'common': 'matte',
    'uncommon': 'satin', 
    'rare': 'gloss',
    'epic': 'foil',
    'legendary': 'holographic',
    'mythic': 'holographic'
  }[rarity] as 'matte' | 'satin' | 'gloss' | 'foil' | 'holographic';

  return (
    <div
      ref={ref}
      className={cn(
        // Base physical card classes
        'card-physical',
        `card-${size}`,
        `card-rarity-${rarity}`,
        `card-surface-${cardSurface}`,
        `card-${state}`,
        // Interactive behavior
        interactive && 'cursor-pointer select-none',
        // Accessibility
        'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2',
        className
      )}
      tabIndex={interactive ? 0 : undefined}
      role={interactive ? 'button' : undefined}
      {...props}
    >
      {children}
    </div>
  );
});

PhysicalCard.displayName = 'PhysicalCard';

export default PhysicalCard;
