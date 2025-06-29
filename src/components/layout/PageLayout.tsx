
import React from 'react';
import Header from '@/components/Header';
import { cn } from '@/lib/utils';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  showBackgroundEffects?: boolean;
}

const PageLayout = ({ children, className, showBackgroundEffects = true }: PageLayoutProps) => {
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {/* Background Effects */}
      {showBackgroundEffects && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-primary/3 rounded-full blur-3xl" />
        </div>
      )}
      
      <Header />
      
      <main className="relative z-10">
        {children}
      </main>
    </div>
  );
};

export default PageLayout;
