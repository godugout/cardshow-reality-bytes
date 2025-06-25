
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useRealtimeMonitoring } from './useRealtimeMonitoring';
import { useConnectionTracking } from './useConnectionTracking';

export const useSupabaseMonitoring = () => {
  const { logRealtimeEvent } = useRealtimeMonitoring();
  const {
    trackConnection,
    trackMessage,
    trackMessageResponse,
    trackError,
    trackDisconnection
  } = useConnectionTracking();

  useEffect(() => {
    const originalChannel = supabase.channel;
    const activeChannels = new Map<string, string>(); // channelName -> connectionId

    // Override channel creation to monitor
    supabase.channel = function(this: typeof supabase, name: string, opts?: any) {
      const channel = originalChannel.call(this, name, opts);
      const connectionId = trackConnection(name);
      activeChannels.set(name, connectionId);

      // Log connection event
      logRealtimeEvent({
        connectionId,
        channelName: name,
        eventType: 'connect'
      });

      // Monitor channel events
      const originalOn = channel.on;
      channel.on = function(this: typeof channel, event: string, filter: any, callback: Function) {
        const wrappedCallback = (...args: any[]) => {
          const messageId = trackMessage(connectionId, JSON.stringify(args).length);
          
          // Log message event
          logRealtimeEvent({
            connectionId,
            channelName: name,
            eventType: 'message',
            payloadSizeBytes: JSON.stringify(args).length
          });
          
          try {
            const result = callback.apply(this, args);
            const latency = trackMessageResponse(messageId, connectionId);
            
            if (latency) {
              logRealtimeEvent({
                connectionId,
                channelName: name,
                eventType: 'message',
                latencyMs: latency
              });
            }
            
            return result;
          } catch (error) {
            trackError(connectionId);
            logRealtimeEvent({
              connectionId,
              channelName: name,
              eventType: 'error',
              errorDetails: { event, error: error.message }
            });
            throw error;
          }
        };

        return originalOn.call(this, event, filter, wrappedCallback);
      };

      // Monitor subscription
      const originalSubscribe = channel.subscribe;
      channel.subscribe = function(this: typeof channel, callback?: Function) {
        try {
          return originalSubscribe.call(this, (status: string, err?: Error) => {
            if (err) {
              trackError(connectionId);
              logRealtimeEvent({
                connectionId,
                channelName: name,
                eventType: 'error',
                errorDetails: { status, error: err.message }
              });
            }
            if (callback) callback(status, err);
          });
        } catch (error) {
          trackError(connectionId);
          logRealtimeEvent({
            connectionId,
            channelName: name,
            eventType: 'error',
            errorDetails: { error: error.message }
          });
          throw error;
        }
      };

      // Monitor unsubscribe
      const originalUnsubscribe = channel.unsubscribe;
      channel.unsubscribe = function(this: typeof channel) {
        const disconnectionData = trackDisconnection(connectionId);
        
        if (disconnectionData) {
          logRealtimeEvent({
            connectionId,
            channelName: name,
            eventType: 'disconnect',
            latencyMs: disconnectionData.avgLatency,
            errorDetails: {
              sessionDuration: disconnectionData.sessionDuration,
              messageCount: disconnectionData.messageCount,
              errorCount: disconnectionData.errorCount
            }
          });
        }
        
        activeChannels.delete(name);
        return originalUnsubscribe.call(this);
      };

      return channel;
    };

    // Cleanup on unmount
    return () => {
      activeChannels.forEach((connectionId, channelName) => {
        const disconnectionData = trackDisconnection(connectionId);
        
        if (disconnectionData) {
          logRealtimeEvent({
            connectionId,
            channelName,
            eventType: 'disconnect',
            latencyMs: disconnectionData.avgLatency,
            errorDetails: {
              sessionDuration: disconnectionData.sessionDuration,
              messageCount: disconnectionData.messageCount,
              errorCount: disconnectionData.errorCount
            }
          });
        }
      });
      supabase.channel = originalChannel;
    };
  }, [logRealtimeEvent, trackConnection, trackMessage, trackMessageResponse, trackError, trackDisconnection]);
};
