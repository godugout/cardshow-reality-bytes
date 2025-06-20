
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface Advanced3DPreferences {
  qualityPreset: 'ultra' | 'high' | 'medium' | 'low' | 'auto';
  enableShaders: boolean;
  enableParticles: boolean;
  enableAnimations: boolean;
  enableSound: boolean;
  enableHaptics: boolean;
  batteryOptimization: boolean;
  accessibilityMode: boolean;
  customSettings: Record<string, any>;
}

const DEFAULT_PREFERENCES: Advanced3DPreferences = {
  qualityPreset: 'auto',
  enableShaders: true,
  enableParticles: true,
  enableAnimations: true,
  enableSound: true,
  enableHaptics: true,
  batteryOptimization: true,
  accessibilityMode: false,
  customSettings: {}
};

// Auto-detect device capabilities
const getAutoQualityPreset = (): 'ultra' | 'high' | 'medium' | 'low' => {
  // Check for mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Check GPU capabilities
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  
  if (!gl) return 'low';
  
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : '';
  
  // Check memory
  const memory = (navigator as any).deviceMemory || 4;
  
  // Check for high-end GPUs
  const isHighEndGPU = /RTX|GTX 1[6-9]|GTX 2[0-9]|GTX 3[0-9]|RTX [2-4][0-9]|Radeon RX [5-7][0-9]|Apple M[1-2]|Mali-G[7-9][0-9]/i.test(renderer);
  
  if (isMobile) {
    return memory >= 6 ? 'medium' : 'low';
  }
  
  if (isHighEndGPU && memory >= 8) return 'ultra';
  if (memory >= 8) return 'high';
  if (memory >= 4) return 'medium';
  return 'low';
};

export const useAdvanced3DPreferences = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<Advanced3DPreferences>(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPreferences = async () => {
      if (!user) {
        // Apply auto-detection for non-authenticated users
        const autoQuality = getAutoQualityPreset();
        setPreferences(prev => ({ ...prev, qualityPreset: autoQuality }));
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_3d_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') throw error;

        if (data) {
          const loadedPrefs: Advanced3DPreferences = {
            qualityPreset: data.quality_preset === 'auto' ? getAutoQualityPreset() : data.quality_preset as Advanced3DPreferences['qualityPreset'],
            enableShaders: data.enable_shaders,
            enableParticles: data.enable_particles,
            enableAnimations: data.enable_animations,
            enableSound: data.enable_sound,
            enableHaptics: data.enable_haptics,
            batteryOptimization: data.battery_optimization,
            accessibilityMode: data.accessibility_mode,
            customSettings: (data.custom_settings as Record<string, any>) || {}
          };
          setPreferences(loadedPrefs);
        } else {
          // Create default preferences for new user
          const autoQuality = getAutoQualityPreset();
          const defaultPrefs = { ...DEFAULT_PREFERENCES, qualityPreset: autoQuality };
          await updatePreferences(defaultPrefs);
        }
      } catch (error) {
        console.warn('Failed to load 3D preferences:', error);
        const autoQuality = getAutoQualityPreset();
        setPreferences(prev => ({ ...prev, qualityPreset: autoQuality }));
      }
      setLoading(false);
    };

    loadPreferences();
  }, [user]);

  const updatePreferences = async (newPrefs: Partial<Advanced3DPreferences>) => {
    const updatedPrefs = { ...preferences, ...newPrefs };
    setPreferences(updatedPrefs);

    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_3d_preferences')
        .upsert({
          user_id: user.id,
          quality_preset: updatedPrefs.qualityPreset,
          enable_shaders: updatedPrefs.enableShaders,
          enable_particles: updatedPrefs.enableParticles,
          enable_animations: updatedPrefs.enableAnimations,
          enable_sound: updatedPrefs.enableSound,
          enable_haptics: updatedPrefs.enableHaptics,
          battery_optimization: updatedPrefs.batteryOptimization,
          accessibility_mode: updatedPrefs.accessibilityMode,
          custom_settings: updatedPrefs.customSettings
        });

      if (error) throw error;
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
