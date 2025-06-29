
// TODO: Realtime performance monitoring temporarily disabled
// This file contained hooks for tracking realtime performance metrics
// Will be re-enabled when realtime subscriptions are restored

/*
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
*/

// Temporary no-op implementation
export const useRealtimePerformance = () => {
  console.log('Realtime performance monitoring temporarily disabled');
  
  return {
    trackConnection: () => {},
    trackMessage: () => {},
    trackMessageResponse: () => {},
    trackError: () => {},
    trackDisconnection: () => {},
    getConnectionStats: () => ({})
  };
};
