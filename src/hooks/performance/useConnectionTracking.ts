
import { useRef, useCallback } from 'react';

interface ConnectionMetrics {
  connectionId: string;
  connectTime: number;
  messageCount: number;
  totalLatency: number;
  errors: number;
}

export const useConnectionTracking = () => {
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

    return connectionId;
  }, [generateConnectionId]);

  // Track message timestamps
  const trackMessage = useCallback((connectionId: string, payloadSize?: number) => {
    const messageId = `${connectionId}_${Date.now()}`;
    const timestamp = performance.now();
    
    messageTimestampsRef.current.set(messageId, timestamp);

    // Update connection metrics
    const connection = connectionsRef.current.get(connectionId);
    if (connection) {
      connection.messageCount++;
      connectionsRef.current.set(connectionId, connection);
    }

    return messageId;
  }, []);

  // Track message response (for latency calculation)
  const trackMessageResponse = useCallback((messageId: string, connectionId: string) => {
    const sentTime = messageTimestampsRef.current.get(messageId);
    if (sentTime) {
      const latency = performance.now() - sentTime;
      
      // Update connection metrics
      const connection = connectionsRef.current.get(connectionId);
      if (connection) {
        connection.totalLatency += latency;
        connectionsRef.current.set(connectionId, connection);
      }

      messageTimestampsRef.current.delete(messageId);
      return latency;
    }
    return null;
  }, []);

  // Track connection errors
  const trackError = useCallback((connectionId: string) => {
    const connection = connectionsRef.current.get(connectionId);
    if (connection) {
      connection.errors++;
      connectionsRef.current.set(connectionId, connection);
    }
  }, []);

  // Track disconnection
  const trackDisconnection = useCallback((connectionId: string) => {
    const connection = connectionsRef.current.get(connectionId);
    if (connection) {
      const sessionDuration = performance.now() - connection.connectTime;
      const avgLatency = connection.messageCount > 0 ? connection.totalLatency / connection.messageCount : 0;

      connectionsRef.current.delete(connectionId);
      
      return {
        sessionDuration,
        messageCount: connection.messageCount,
        errorCount: connection.errors,
        avgLatency
      };
    }
    return null;
  }, []);

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
