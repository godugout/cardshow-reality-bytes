
import { useState, useCallback } from 'react';
import { auditor } from '@/utils/integrationAudit';

interface ErrorInfo {
  error: Error;
  errorInfo?: any;
  timestamp: Date;
  userId?: string;
  route?: string;
  userAgent?: string;
}

export const useErrorBoundary = () => {
  const [errors, setErrors] = useState<ErrorInfo[]>([]);

  const logError = useCallback((error: Error, errorInfo?: any, context?: string) => {
    const errorRecord: ErrorInfo = {
      error,
      errorInfo,
      timestamp: new Date(),
      userId: undefined, // TODO: Get from auth context
      route: window.location.pathname,
      userAgent: navigator.userAgent
    };

    setErrors(prev => [...prev, errorRecord]);

    // Log to integration auditor
    auditor.logIssue({
      system: context || 'frontend',
      severity: 'high',
      issue: error.message,
      location: error.stack?.split('\n')[1] || 'Unknown location',
      solution: 'Check error details and fix underlying issue',
      tested: false
    });

    // Log to console for development
    console.error('Error caught by boundary:', {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: errorRecord.timestamp,
      route: errorRecord.route
    });

    // TODO: Send to error reporting service in production
    
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  return {
    errors,
    logError,
    clearErrors,
    hasErrors: errors.length > 0
  };
};
