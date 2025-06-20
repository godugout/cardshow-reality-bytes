
import { useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface PerformanceData {
  fps: number;
  renderTime: number;
  shaderType: string;
}

export const usePerformanceMonitor = () => {
  const { user } = useAuth();

  const getDeviceInfo = useCallback(() => {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      memory: (navigator as any).deviceMemory || null,
      cores: navigator.hardwareConcurrency || null,
      screen: {
        width: screen.width,
        height: screen.height,
        pixelRatio: window.devicePixelRatio
      }
    };
  }, []);

  const logPerformance = useCallback(async (data: PerformanceData) => {
    if (!user) return;

    try {
      await supabase
        .from('shader_performance_logs')
        .insert({
          user_id: user.id,
          device_info: getDeviceInfo(),
          shader_type: data.shaderType,
          render_time_ms: Math.round(data.renderTime),
          fps_average: Math.round(data.fps * 100) / 100,
          quality_preset: 'auto' // This could be read from preferences
        });
    } catch (error) {
      console.warn('Failed to log performance data:', error);
    }
  }, [user, getDeviceInfo]);

  return {
    logPerformance,
    getDeviceInfo
  };
};
