
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { auditor } from '@/utils/integrationAudit';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userData?: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Log auth initialization
    auditor.logIssue({
      system: 'auth',
      severity: 'low',
      issue: 'Auth provider initializing',
      location: 'AuthProvider.useEffect',
      solution: 'No action needed',
      tested: true
    });

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        // Log auth events
        auditor.logIssue({
          system: 'auth',
          severity: 'low',
          issue: `Auth event: ${event}`,
          location: 'AuthProvider.onAuthStateChange',
          solution: 'No action needed',
          tested: true
        });

        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Test database connection after successful auth
        if (session?.user && event === 'SIGNED_IN') {
          setTimeout(async () => {
            try {
              const { data, error } = await supabase
                .from('user_profiles')
                .select('id')
                .eq('id', session.user.id)
                .single();
              
              if (error && error.code !== 'PGRST116') {
                auditor.logIssue({
                  system: 'database',
                  severity: 'high',
                  issue: `Post-auth database test failed: ${error.message}`,
                  location: 'AuthProvider.postAuthTest',
                  solution: 'Check user_profiles table and RLS policies',
                  tested: true
                });
              }
            } catch (error) {
              auditor.logIssue({
                system: 'database',
                severity: 'high',
                issue: `Post-auth database test error: ${error}`,
                location: 'AuthProvider.postAuthTest',
                solution: 'Check database connectivity and configuration',
                tested: true
              });
            }
          }, 100);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        auditor.logIssue({
          system: 'auth',
          severity: 'high',
          issue: `Session retrieval failed: ${error.message}`,
          location: 'AuthProvider.getSession',
          solution: 'Check Supabase configuration and network connectivity',
          tested: true
        });
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData?: any) => {
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
          location: 'AuthProvider.signUp',
          solution: 'Check email validity and auth configuration',
          tested: true
        });
      } else {
        auditor.logIssue({
          system: 'auth',
          severity: 'low',
          issue: 'Sign up successful',
          location: 'AuthProvider.signUp',
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
        location: 'AuthProvider.signUp',
        solution: 'Check network connectivity and Supabase configuration',
        tested: true
      });
      return { error: new Error(errorMessage) };
    }
  };

  const signIn = async (email: string, password: string) => {
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
          location: 'AuthProvider.signIn',
          solution: 'Check credentials and auth configuration',
          tested: true
        });
      } else {
        auditor.logIssue({
          system: 'auth',
          severity: 'low',
          issue: 'Sign in successful',
          location: 'AuthProvider.signIn',
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
        location: 'AuthProvider.signIn',
        solution: 'Check network connectivity and Supabase configuration',
        tested: true
      });
      return { error: new Error(errorMessage) };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        auditor.logIssue({
          system: 'auth',
          severity: 'medium',
          issue: `Sign out failed: ${error.message}`,
          location: 'AuthProvider.signOut',
          solution: 'Check auth configuration',
          tested: true
        });
      } else {
        auditor.logIssue({
          system: 'auth',
          severity: 'low',
          issue: 'Sign out successful',
          location: 'AuthProvider.signOut',
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
        location: 'AuthProvider.signOut',
        solution: 'Check network connectivity',
        tested: true
      });
      return { error: new Error(errorMessage) };
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
