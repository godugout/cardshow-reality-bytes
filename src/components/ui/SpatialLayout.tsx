
import React from 'react';
import { cn } from '@/lib/utils';

interface SpatialLayoutProps {
  children: React.ReactNode;
  variant?: 'grid' | 'stack' | 'spread' | 'cascade' | 'gallery';
  spacing?: 'tight' | 'normal' | 'loose' | 'scattered';
  perspective?: boolean;
  className?: string;
}

const SpatialLayout = ({ 
  children, 
  variant = 'grid',
  spacing = 'normal',
  perspective = false,
  className 
}: SpatialLayoutProps) => {
  const layoutClasses = {
    grid: 'grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
    stack: 'flex flex-col space-y-4',
    spread: 'flex flex-wrap justify-center gap-6',
    cascade: 'relative',
    gallery: 'grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
  };

  const spacingClasses = {
    tight: variant === 'grid' ? 'gap-2' : 'space-y-2',
    normal: variant === 'grid' ? 'gap-4' : 'space-y-4', 
    loose: variant === 'grid' ? 'gap-8' : 'space-y-8',
    scattered: variant === 'grid' ? 'gap-6' : 'space-y-6'
  };

  return (
    <div 
      className={cn(
        'w-full',
        layoutClasses[variant],
        spacingClasses[spacing],
        perspective && 'perspective-1000',
        className
      )}
      style={{
        transformStyle: perspective ? 'preserve-3d' : undefined
      }}
    >
      {variant === 'cascade' ? (
        React.Children.map(children, (child, index) => (
          <div
            key={index}
            className="absolute"
            style={{
              transform: `translate(${index * 8}px, ${index * 8}px) rotateZ(${index * 2 - 4}deg)`,
              zIndex: React.Children.count(children) - index
            }}
          >
            {child}
          </div>
        ))
      ) : (
        children
      )}
    </div>
  );
};

export default SpatialLayout;
