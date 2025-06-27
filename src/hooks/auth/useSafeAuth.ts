
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface SafeAuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;
}

export function useSafeAuth() {
  const [authState, setAuthState] = useState<SafeAuthState>({
    user: null,
    session: null,
    loading: true,
    initialized: false,
    error: null
  });

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Set up auth state listener first
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            if (!mounted) return;
            
            console.log('Safe auth state changed:', event, session?.user?.email);
            
            setAuthState(prev => ({
              ...prev,
              session,
              user: session?.user ?? null,
              loading: false,
              initialized: true,
              error: null
            }));
          }
        );

        // Then check for existing session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (error) {
          console.error('Safe auth session error:', error);
          setAuthState(prev => ({
            ...prev,
            loading: false,
            initialized: true,
            error: error.message
          }));
        } else {
          setAuthState(prev => ({
            ...prev,
            session,
            user: session?.user ?? null,
            loading: false,
            initialized: true,
            error: null
          }));
        }

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        if (!mounted) return;
        
        console.error('Safe auth initialization error:', error);
        setAuthState(prev => ({
          ...prev,
          loading: false,
          initialized: true,
          error: error instanceof Error ? error.message : 'Authentication failed'
        }));
      }
    };

    const cleanup = initializeAuth();

    return () => {
      mounted = false;
      cleanup?.then?.(cleanupFn => cleanupFn?.());
    };
  }, []);

  return authState;
}
