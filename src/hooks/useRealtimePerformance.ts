
import { useEffect, useRef, useCallback } from 'react';
import { usePerformanceMonitoring } from './usePerformanceMonitoring';
import { supabase } from '@/integrations/supabase/client';

interface ConnectionMetrics {
  connectionId: string;
  connectTime: number;
  messageCount: number;
  totalLatency: number;
  errors: number;
}

export const useRealtimePerformance = () => {
  const { logRealtimeEvent } = usePerformanceMonitoring();
  const connectionsRef = useRef<Map<string, ConnectionMetrics>>(new Map());
  const messageTimestampsRef = useRef<Map<string, number>>(new Map());

  // Generate connection ID
  const generateConnectionId = useCallback(() => {
    return `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Track connection establishment
  const trackConnection = useCallback((channelName: string) => {
    const connectionId = generateConnectionId();
    const connectTime = performance.now();
    
    connectionsRef.current.set(connectionId, {
      connectionId,
      connectTime,
      messageCount: 0,
      totalLatency: 0,
      errors: 0
    });

    logRealtimeEvent({
      connectionId,
      channelName,
      eventType: 'connect'
    });

    return connectionId;
  }, [logRealtimeEvent, generateConnectionId]);

  // Track message latency
  const trackMessage = useCallback((connectionId: string, channelName: string, payloadSize?: number) => {
    const messageId = `${connectionId}_${Date.now()}`;
    const timestamp = performance.now();
    
    messageTimestampsRef.current.set(messageId, timestamp);

    // Update connection metrics
    const connection = connectionsRef.current.get(connectionId);
    if (connection) {
      connection.messageCount++;
      connectionsRef.current.set(connectionId, connection);
    }

    logRealtimeEvent({
      connectionId,
      channelName,
      eventType: 'message',
      payloadSizeBytes: payloadSize
    });

    return messageId;
  }, [logRealtimeEvent]);

  // Track message response (for latency calculation)
  const trackMessageResponse = useCallback((messageId: string, connectionId: string, channelName: string) => {
    const sentTime = messageTimestampsRef.current.get(messageId);
    if (sentTime) {
      const latency = performance.now() - sentTime;
      
      // Update connection metrics
      const connection = connectionsRef.current.get(connectionId);
      if (connection) {
        connection.totalLatency += latency;
        connectionsRef.current.set(connectionId, connection);
      }

      logRealtimeEvent({
        connectionId,
        channelName,
        eventType: 'message',
        latencyMs: latency
      });

      messageTimestampsRef.current.delete(messageId);
    }
  }, [logRealtimeEvent]);

  // Track connection errors
  const trackError = useCallback((connectionId: string, channelName: string, errorDetails: any) => {
    const connection = connectionsRef.current.get(connectionId);
    if (connection) {
      connection.errors++;
      connectionsRef.current.set(connectionId, connection);
    }

    logRealtimeEvent({
      connectionId,
      channelName,
      eventType: 'error',
      errorDetails
    });
  }, [logRealtimeEvent]);

  // Track disconnection
  const trackDisconnection = useCallback((connectionId: string, channelName: string) => {
    const connection = connectionsRef.current.get(connectionId);
    if (connection) {
      const sessionDuration = performance.now() - connection.connectTime;
      const avgLatency = connection.messageCount > 0 ? connection.totalLatency / connection.messageCount : 0;

      logRealtimeEvent({
        connectionId,
        channelName,
        eventType: 'disconnect',
        latencyMs: avgLatency,
        errorDetails: {
          sessionDuration,
          messageCount: connection.messageCount,
          errorCount: connection.errors
        }
      });

      connectionsRef.current.delete(connectionId);
    }
  }, [logRealtimeEvent]);

  // Auto-monitor Supabase realtime connections
  useEffect(() => {
    const originalChannel = supabase.channel;
    const activeChannels = new Map<string, string>(); // channelName -> connectionId

    // Override channel creation to monitor
    supabase.channel = function(this: typeof supabase, name: string, opts?: any) {
      const channel = originalChannel.call(this, name, opts);
      const connectionId = trackConnection(name);
      activeChannels.set(name, connectionId);

      // Monitor channel events
      const originalOn = channel.on;
      channel.on = function(this: typeof channel, event: string, filter: any, callback: Function) {
        const wrappedCallback = (...args: any[]) => {
          const messageId = trackMessage(connectionId, name, JSON.stringify(args).length);
          
          try {
            const result = callback.apply(this, args);
            trackMessageResponse(messageId, connectionId, name);
            return result;
          } catch (error) {
            trackError(connectionId, name, { event, error: error.message });
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
              trackError(connectionId, name, { status, error: err.message });
            }
            if (callback) callback(status, err);
          });
        } catch (error) {
          trackError(connectionId, name, { error: error.message });
          throw error;
        }
      };

      // Monitor unsubscribe
      const originalUnsubscribe = channel.unsubscribe;
      channel.unsubscribe = function(this: typeof channel) {
        trackDisconnection(connectionId, name);
        activeChannels.delete(name);
        return originalUnsubscribe.call(this);
      };

      return channel;
    };

    // Cleanup on unmount
    return () => {
      activeChannels.forEach((connectionId, channelName) => {
        trackDisconnection(connectionId, channelName);
      });
      supabase.channel = originalChannel;
    };
  }, [trackConnection, trackMessage, trackMessageResponse, trackError, trackDisconnection]);

  // Get current connection stats
  const getConnectionStats = useCallback(() => {
    const connections = Array.from(connectionsRef.current.values());
    return {
      activeConnections: connections.length,
      totalMessages: connections.reduce((sum, conn) => sum + conn.messageCount, 0),
      totalErrors: connections.reduce((sum, conn) => sum + conn.errors, 0),
      averageLatency: connections.length > 0 
        ? connections.reduce((sum, conn) => sum + (conn.totalLatency / Math.max(conn.messageCount, 1)), 0) / connections.length 
        : 0
    };
  }, []);

  return {
    trackConnection,
    trackMessage,
    trackMessageResponse,
    trackError,
    trackDisconnection,
    getConnectionStats
  };
};
