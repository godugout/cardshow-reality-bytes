
import { ReactNode } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface MobileLayoutProps {
  children: ReactNode;
  className?: string;
}

const MobileLayout = ({ children, className }: MobileLayoutProps) => {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <div className={cn(
      'min-h-screen bg-background',
      'safe-area-inset-top safe-area-inset-bottom',
      'overflow-hidden',
      className
    )}>
      {children}
    </div>
  );
};

export default MobileLayout;
