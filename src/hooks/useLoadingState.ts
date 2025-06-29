
import { useState, useCallback, useRef } from 'react';

interface LoadingState {
  [key: string]: boolean;
}

export const useLoadingState = () => {
  const [loadingStates, setLoadingStates] = useState<LoadingState>({});
  const loadingTimeouts = useRef<{ [key: string]: NodeJS.Timeout }>({});

  const setLoading = useCallback((key: string, isLoading: boolean, timeout?: number) => {
    // Clear existing timeout if any
    if (loadingTimeouts.current[key]) {
      clearTimeout(loadingTimeouts.current[key]);
      delete loadingTimeouts.current[key];
    }

    setLoadingStates(prev => ({
      ...prev,
      [key]: isLoading
    }));

    // Set automatic timeout to prevent stuck loading states
    if (isLoading && timeout) {
      loadingTimeouts.current[key] = setTimeout(() => {
        console.warn(`Loading state for '${key}' timed out after ${timeout}ms`);
        setLoadingStates(prev => ({
          ...prev,
          [key]: false
        }));
        delete loadingTimeouts.current[key];
      }, timeout);
    }
  }, []);

  const isLoading = useCallback((key: string) => {
    return loadingStates[key] || false;
  }, [loadingStates]);

  const isAnyLoading = useCallback(() => {
    return Object.values(loadingStates).some(loading => loading);
  }, [loadingStates]);

  const clearAll = useCallback(() => {
    // Clear all timeouts
    Object.values(loadingTimeouts.current).forEach(timeout => {
      clearTimeout(timeout);
    });
    loadingTimeouts.current = {};
    
    // Clear all loading states
    setLoadingStates({});
  }, []);

  return {
    setLoading,
    isLoading,
    isAnyLoading,
    clearAll,
    loadingStates
  };
};
