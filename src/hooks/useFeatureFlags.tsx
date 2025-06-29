
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  category: string;
  is_enabled: boolean;
  rollout_percentage: number;
  target_users: string[];
  metadata: Record<string, any>;
}

interface FeatureFlagsContextType {
  flags: Record<string, boolean>;
  isLoading: boolean;
  isFeatureEnabled: (flagName: string) => boolean;
  refreshFlags: () => Promise<void>;
}

const FeatureFlagsContext = createContext<FeatureFlagsContextType | undefined>(undefined);

export const FeatureFlagsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);

  const checkFeatureFlag = async (flagName: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { data, error } = await supabase.rpc('is_feature_enabled', {
        flag_name: flagName,
        user_uuid: user.id
      });
      
      if (error) {
        console.error('Error checking feature flag:', error);
        return false;
      }
      
      return data || false;
    } catch (error) {
      console.error('Error checking feature flag:', error);
      return false;
    }
  };

  const refreshFlags = async () => {
    if (!user) {
      setFlags({});
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    try {
      // Get all feature flags
      const { data: flagData, error } = await supabase
        .from('feature_flags')
        .select('name');

      if (error) {
        console.error('Error fetching flags:', error);
        return;
      }

      // Check each flag
      const flagChecks = await Promise.all(
        flagData.map(async (flag) => {
          const isEnabled = await checkFeatureFlag(flag.name);
          return [flag.name, isEnabled];
        })
      );

      const flagsObject = Object.fromEntries(flagChecks);
      setFlags(flagsObject);
    } catch (error) {
      console.error('Error refreshing flags:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshFlags();
  }, [user?.id]);

  // Subscribe to flag changes
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('feature_flags_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'feature_flags'
        },
        () => {
          refreshFlags();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'feature_flag_user_overrides',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          refreshFlags();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const isFeatureEnabled = (flagName: string): boolean => {
    return flags[flagName] || false;
  };

  return (
    <FeatureFlagsContext.Provider value={{
      flags,
      isLoading,
      isFeatureEnabled,
      refreshFlags
    }}>
      {children}
    </FeatureFlagsContext.Provider>
  );
};

export const useFeatureFlags = () => {
  const context = useContext(FeatureFlagsContext);
  if (context === undefined) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagsProvider');
  }
  return context;
};
