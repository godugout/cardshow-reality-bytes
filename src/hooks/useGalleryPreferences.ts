
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export type GalleryLayoutType = 'circular' | 'gallery_wall' | 'spiral' | 'grid' | 'random_scatter';
export type EnvironmentTheme = 'auto' | 'dark' | 'light' | 'cosmic' | 'nature';

interface GalleryPreferences {
  layout_type: GalleryLayoutType;
  navigation_speed: number;
  auto_rotate: boolean;
  ambient_lighting: boolean;
  particle_effects: boolean;
  spatial_audio: boolean;
  accessibility_mode: boolean;
  reduced_motion: boolean;
  environment_theme: EnvironmentTheme;
}

const DEFAULT_PREFERENCES: GalleryPreferences = {
  layout_type: 'circular',
  navigation_speed: 1.0,
  auto_rotate: true,
  ambient_lighting: true,
  particle_effects: true,
  spatial_audio: false,
  accessibility_mode: false,
  reduced_motion: false,
  environment_theme: 'auto'
};

export const useGalleryPreferences = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<GalleryPreferences>(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadPreferences = async () => {
      try {
        const { data, error } = await supabase
          .from('gallery_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') throw error;

        if (data) {
          setPreferences({
            layout_type: data.layout_type as GalleryLayoutType,
            navigation_speed: data.navigation_speed,
            auto_rotate: data.auto_rotate,
            ambient_lighting: data.ambient_lighting,
            particle_effects: data.particle_effects,
            spatial_audio: data.spatial_audio,
            accessibility_mode: data.accessibility_mode,
            reduced_motion: data.reduced_motion,
            environment_theme: data.environment_theme as EnvironmentTheme
          });
        }
      } catch (error) {
        console.warn('Failed to load gallery preferences:', error);
      }
      setLoading(false);
    };

    loadPreferences();
  }, [user]);

  const updatePreferences = async (newPrefs: Partial<GalleryPreferences>) => {
    if (!user) return;

    const updatedPrefs = { ...preferences, ...newPrefs };
    setPreferences(updatedPrefs);

    try {
      await supabase
        .from('gallery_preferences')
        .upsert({
          user_id: user.id,
          ...updatedPrefs
        });
    } catch (error) {
      console.error('Failed to save gallery preferences:', error);
    }
  };

  return {
    preferences,
    updatePreferences,
    loading
  };
};
