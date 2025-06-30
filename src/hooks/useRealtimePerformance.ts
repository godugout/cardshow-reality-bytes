
import { useConnectionTracking } from './performance/useConnectionTracking';
import { useSupabaseMonitoring } from './performance/useSupabaseMonitoring';

export const useRealtimePerformance = () => {
  const {
    trackConnection,
    trackMessage,
    trackMessageResponse,
    trackError,
    trackDisconnection,
    getConnectionStats
  } = useConnectionTracking();

  // Auto-monitor Supabase realtime connections
  useSupabaseMonitoring();

  return {
    trackConnection,
    trackMessage,
    trackMessageResponse,
    trackError,
    trackDisconnection,
    getConnectionStats
  };
};
