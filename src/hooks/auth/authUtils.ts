
import { supabase } from '@/integrations/supabase/client';
import { auditor } from '@/utils/integrationAudit';

export const signUp = async (email: string, password: string, userData?: any) => {
  try {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: userData
      }
    });

    if (error) {
      auditor.logIssue({
        system: 'auth',
        severity: 'medium',
        issue: `Sign up failed: ${error.message}`,
        location: 'authUtils.signUp',
        solution: 'Check email validity and auth configuration',
        tested: true
      });
    } else {
      auditor.logIssue({
        system: 'auth',
        severity: 'low',
        issue: 'Sign up successful',
        location: 'authUtils.signUp',
        solution: 'No action needed',
        tested: true
      });
    }

    return { error };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Sign up failed';
    auditor.logIssue({
      system: 'auth',
      severity: 'high',
      issue: `Sign up error: ${errorMessage}`,
      location: 'authUtils.signUp',
      solution: 'Check network connectivity and Supabase configuration',
      tested: true
    });
    return { error: new Error(errorMessage) };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      auditor.logIssue({
        system: 'auth',
        severity: 'medium',
        issue: `Sign in failed: ${error.message}`,
        location: 'authUtils.signIn',
        solution: 'Check credentials and auth configuration',
        tested: true
      });
    } else {
      auditor.logIssue({
        system: 'auth',
        severity: 'low',
        issue: 'Sign in successful',
        location: 'authUtils.signIn',
        solution: 'No action needed',
        tested: true
      });
    }

    return { error };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Sign in failed';
    auditor.logIssue({
      system: 'auth',
      severity: 'high',
      issue: `Sign in error: ${errorMessage}`,
      location: 'authUtils.signIn',
      solution: 'Check network connectivity and Supabase configuration',
      tested: true
    });
    return { error: new Error(errorMessage) };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      auditor.logIssue({
        system: 'auth',
        severity: 'medium',
        issue: `Sign out failed: ${error.message}`,
        location: 'authUtils.signOut',
        solution: 'Check auth configuration',
        tested: true
      });
    } else {
      auditor.logIssue({
        system: 'auth',
        severity: 'low',
        issue: 'Sign out successful',
        location: 'authUtils.signOut',
        solution: 'No action needed',
        tested: true
      });
    }

    return { error };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Sign out failed';
    auditor.logIssue({
      system: 'auth',
      severity: 'high',
      issue: `Sign out error: ${errorMessage}`,
      location: 'authUtils.signOut',
      solution: 'Check network connectivity',
      tested: true
    });
    return { error: new Error(errorMessage) };
  }
};
