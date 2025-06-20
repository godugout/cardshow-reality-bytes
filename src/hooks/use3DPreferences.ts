
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface ThreeDPreferences {
  enabled: boolean;
  quality: 'low' | 'medium' | 'high';
  animations: boolean;
  particles: boolean;
}

const DEFAULT_PREFERENCES: ThreeDPreferences = {
  enabled: true,
  quality: 'medium',
  animations: true,
  particles: true
};

export const use3DPreferences = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<ThreeDPreferences>(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadPreferences = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('preferences')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (data?.preferences?.threeDCard) {
          setPreferences({ ...DEFAULT_PREFERENCES, ...data.preferences.threeDCard });
        }
      } catch (error) {
        console.warn('Failed to load 3D preferences:', error);
      }
      setLoading(false);
    };

    loadPreferences();
  }, [user]);

  const updatePreferences = async (newPrefs: Partial<ThreeDPreferences>) => {
    if (!user) return;

    const updatedPrefs = { ...preferences, ...newPrefs };
    setPreferences(updatedPrefs);

    try {
      const { data: currentData } = await supabase
        .from('profiles')
        .select('preferences')
        .eq('id', user.id)
        .single();

      const currentPreferences = currentData?.preferences || {};
      
      await supabase
        .from('profiles')
        .update({
          preferences: {
            ...currentPreferences,
            threeDCard: updatedPrefs
          }
        })
        .eq('id', user.id);
    } catch (error) {
      console.error('Failed to save 3D preferences:', error);
    }
  };

  return {
    preferences,
    updatePreferences,
    loading
  };
};
