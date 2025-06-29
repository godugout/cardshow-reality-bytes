
import React from 'react';
import Header from '@/components/Header';
import { cn } from '@/lib/utils';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  showBackgroundEffects?: boolean;
  context?: 'collections' | 'cards' | 'marketplace' | 'currency' | 'default';
}

const PageLayout = ({ 
  children, 
  className, 
  showBackgroundEffects = true,
  context = 'default'
}: PageLayoutProps) => {
  const getContextualBackgroundEffects = () => {
    if (!showBackgroundEffects) return null;
    
    switch (context) {
      case 'collections':
        return (
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-collections/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-collections/3 rounded-full blur-3xl" />
          </div>
        );
      case 'cards':
        return (
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cards/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-cards/3 rounded-full blur-3xl" />
          </div>
        );
      case 'marketplace':
        return (
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-marketplace/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-marketplace/3 rounded-full blur-3xl" />
          </div>
        );
      case 'currency':
        return (
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-currency/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
          </div>
        );
      default:
        return (
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-primary/3 rounded-full blur-3xl" />
          </div>
        );
    }
  };

  return (
    <div className={cn("min-h-screen bg-background transition-colors duration-300", className)}>
      {getContextualBackgroundEffects()}
      
      <Header />
      
      <main className="relative z-10">
        {children}
      </main>
    </div>
  );
};

export default PageLayout;
