
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSupabaseErrorHandler } from '@/hooks/useSupabaseErrorHandler';
import { auditor } from '@/utils/integrationAudit';
import { supabase } from '@/integrations/supabase/client';

interface AuthFlowState {
  isLoading: boolean;
  step: 'idle' | 'signing_in' | 'signing_up' | 'verifying_email' | 'authenticated';
  error: string | null;
}

export const useAuthFlow = () => {
  const { user, session, signIn, signUp, signOut } = useAuth();
  const { handleError } = useSupabaseErrorHandler();
  const [flowState, setFlowState] = useState<AuthFlowState>({
    isLoading: false,
    step: 'idle',
    error: null
  });

  // Monitor auth state changes
  useEffect(() => {
    if (user && session) {
      setFlowState(prev => ({ ...prev, step: 'authenticated', error: null }));
      
      // Log successful authentication
      auditor.logIssue({
        system: 'auth',
        severity: 'low',
        issue: 'User authenticated successfully',
        location: 'useAuthFlow',
        solution: 'No action needed',
        tested: true
      });
    } else {
      setFlowState(prev => ({ ...prev, step: 'idle' }));
    }
  }, [user, session]);

  const handleSignIn = useCallback(async (email: string, password: string) => {
    setFlowState({ isLoading: true, step: 'signing_in', error: null });
    
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        handleError(error, { operation: 'sign_in' });
        setFlowState({ 
          isLoading: false, 
          step: 'idle', 
          error: error.message 
        });
        return { success: false, error };
      }

      setFlowState({ isLoading: false, step: 'authenticated', error: null });
      return { success: true };
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign in failed';
      handleError(new Error(errorMessage), { operation: 'sign_in' });
      setFlowState({ 
        isLoading: false, 
        step: 'idle', 
        error: errorMessage 
      });
      return { success: false, error: errorMessage };
    }
  }, [signIn, handleError]);

  const handleSignUp = useCallback(async (email: string, password: string, userData?: any) => {
    setFlowState({ isLoading: true, step: 'signing_up', error: null });
    
    try {
      const { error } = await signUp(email, password, userData);
      
      if (error) {
        handleError(error, { operation: 'sign_up' });
        setFlowState({ 
          isLoading: false, 
          step: 'idle', 
          error: error.message 
        });
        return { success: false, error };
      }

      setFlowState({ isLoading: false, step: 'verifying_email', error: null });
      return { success: true };
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign up failed';
      handleError(new Error(errorMessage), { operation: 'sign_up' });
      setFlowState({ 
        isLoading: false, 
        step: 'idle', 
        error: errorMessage 
      });
      return { success: false, error: errorMessage };
    }
  }, [signUp, handleError]);

  const handleSignOut = useCallback(async () => {
    setFlowState({ isLoading: true, step: 'idle', error: null });
    
    try {
      const { error } = await signOut();
      
      if (error) {
        handleError(error, { operation: 'sign_out' });
        setFlowState({ 
          isLoading: false, 
          step: 'authenticated', 
          error: error.message 
        });
        return { success: false, error };
      }

      setFlowState({ isLoading: false, step: 'idle', error: null });
      return { success: true };
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign out failed';
      handleError(new Error(errorMessage), { operation: 'sign_out' });
      setFlowState({ 
        isLoading: false, 
        step: 'authenticated', 
        error: errorMessage 
      });
      return { success: false, error: errorMessage };
    }
  }, [signOut, handleError]);

  const testDatabaseConnection = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id')
        .limit(1);
      
      if (error) {
        auditor.logIssue({
          system: 'database',
          severity: 'critical',
          issue: `Database connection test failed: ${error.message}`,
          location: 'useAuthFlow.testDatabaseConnection',
          solution: 'Check Supabase configuration and network connectivity',
          tested: true
        });
        return false;
      }
      
      return true;
    } catch (error) {
      auditor.logIssue({
        system: 'database',
        severity: 'critical',
        issue: `Database connection test failed: ${error}`,
        location: 'useAuthFlow.testDatabaseConnection',
        solution: 'Check Supabase configuration and network connectivity',
        tested: true
      });
      return false;
    }
  }, []);

  return {
    flowState,
    handleSignIn,
    handleSignUp,
    handleSignOut,
    testDatabaseConnection,
    isAuthenticated: !!user && !!session,
    user,
    session
  };
};
