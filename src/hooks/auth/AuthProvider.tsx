
import { useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { auditor } from '@/utils/integrationAudit';
import { AuthContext } from './AuthContext';
import { signUp, signIn, signOut } from './authUtils';

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
                .maybeSingle();
              
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
