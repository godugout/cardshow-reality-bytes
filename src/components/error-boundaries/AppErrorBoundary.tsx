
import React from 'react';
import AppErrorFallback from '@/components/error-boundaries/AppErrorFallback';

interface AppErrorBoundaryProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const AppErrorBoundary = ({ error, resetErrorBoundary }: AppErrorBoundaryProps) => {
  return <AppErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} />;
};

export default AppErrorBoundary;
