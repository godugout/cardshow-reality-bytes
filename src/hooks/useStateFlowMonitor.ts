import { useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface StateFlowEvent {
  timestamp: number;
  flow: string;
  step: string;
  userId?: string;
  data?: any;
  error?: any;
}

interface StateFlowMetrics {
  flowCompletion: Record<string, number>;
  errorRates: Record<string, number>;
  averageFlowTime: Record<string, number>;
  concurrentUsers: number;
}

export const useStateFlowMonitor = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const flowEvents = useRef<StateFlowEvent[]>([]);
  const flowTimers = useRef<Map<string, number>>(new Map());

  // Critical user flow definitions
  const criticalFlows = {
    USER_ONBOARDING: ['registration', 'profile_setup', 'first_card', 'collection_creation'],
    CARD_CREATION: ['template_selection', 'customization', 'save', 'share'],
    TRADING: ['initiate_trade', 'negotiate', 'accept', 'complete'],
    MARKETPLACE: ['list_card', 'receive_purchase', 'transfer_ownership', 'payment'],
    COLLECTION_MANAGEMENT: ['create_collection', 'add_cards', 'organize', 'share_public']
  };

  const logFlowEvent = useCallback((flow: string, step: string, data?: any, error?: any) => {
    const event: StateFlowEvent = {
      timestamp: Date.now(),
      flow,
      step,
      userId: user?.id,
      data,
      error
    };

    flowEvents.current.push(event);
    
    // Keep only last 1000 events to prevent memory issues
    if (flowEvents.current.length > 1000) {
      flowEvents.current = flowEvents.current.slice(-1000);
    }

    console.log(`[StateFlow] ${flow}:${step}`, { data, error });
  }, [user?.id]);

  const startFlow = useCallback((flowId: string) => {
    flowTimers.current.set(flowId, Date.now());
    logFlowEvent(flowId, 'start');
  }, [logFlowEvent]);

  const completeFlow = useCallback((flowId: string, success: boolean = true) => {
    const startTime = flowTimers.current.get(flowId);
    const duration = startTime ? Date.now() - startTime : 0;
    
    logFlowEvent(flowId, success ? 'completed' : 'failed', { duration });
    flowTimers.current.delete(flowId);
  }, [logFlowEvent]);

  const getFlowMetrics = useCallback((): StateFlowMetrics => {
    const now = Date.now();
    const recentEvents = flowEvents.current.filter(e => now - e.timestamp < 3600000); // Last hour

    const flowCompletion: Record<string, number> = {};
    const errorRates: Record<string, number> = {};
    const averageFlowTime: Record<string, number> = {};

    Object.keys(criticalFlows).forEach(flow => {
      const flowStartEvents = recentEvents.filter(e => e.flow === flow && e.step === 'start');
      const flowCompleteEvents = recentEvents.filter(e => e.flow === flow && e.step === 'completed');
      const flowErrorEvents = recentEvents.filter(e => e.flow === flow && e.error);

      flowCompletion[flow] = flowStartEvents.length > 0 
        ? (flowCompleteEvents.length / flowStartEvents.length) * 100 
        : 0;

      errorRates[flow] = flowStartEvents.length > 0 
        ? (flowErrorEvents.length / flowStartEvents.length) * 100 
        : 0;

      const completedFlowsWithDuration = flowCompleteEvents.filter(e => e.data?.duration);
      averageFlowTime[flow] = completedFlowsWithDuration.length > 0
        ? completedFlowsWithDuration.reduce((sum, e) => sum + e.data.duration, 0) / completedFlowsWithDuration.length
        : 0;
    });

    const uniqueUsers = new Set(recentEvents.map(e => e.userId).filter(Boolean));
    
    return {
      flowCompletion,
      errorRates,
      averageFlowTime,
      concurrentUsers: uniqueUsers.size
    };
  }, []);

  // Monitor real-time subscriptions health
  const monitorRealtimeHealth = useCallback(() => {
    const channelStates = supabase.getChannels().map(channel => ({
      topic: channel.topic,
      state: channel.state
    }));

    logFlowEvent('REALTIME_HEALTH', 'check', { channelStates });
  }, [logFlowEvent]);

  // Test data consistency across components
  const testDataConsistency = useCallback(async () => {
    try {
      if (!user) return;

      // Test card count consistency - Fix: Use proper table name
      const [cardsCount, collectionsWithCards] = await Promise.all([
        supabase.from('cards').select('id', { count: 'exact' }).eq('creator_id', user.id),
        supabase.from('collections').select('id, title').eq('user_id', user.id)
      ]);

      let totalCardsInCollections = 0;
      if (collectionsWithCards.data) {
        for (const collection of collectionsWithCards.data) {
          const { count } = await supabase
            .from('collection_cards')
            .select('*', { count: 'exact' })
            .eq('collection_id', collection.id);
          totalCardsInCollections += count || 0;
        }
      }

      const consistencyData = {
        totalCards: cardsCount.count,
        collectionsCount: collectionsWithCards.data?.length,
        totalCardsInCollections,
        isConsistent: (cardsCount.count || 0) >= totalCardsInCollections
      };

      logFlowEvent('DATA_CONSISTENCY', 'check', consistencyData);
      
      return consistencyData;
    } catch (error) {
      logFlowEvent('DATA_CONSISTENCY', 'error', null, error);
      return null;
    }
  }, [user, logFlowEvent]);

  // Verify optimistic updates
  const verifyOptimisticUpdate = useCallback(async (table: string, id: string, expectedData: any) => {
    try {
      // Fix: Use proper table name with type assertion
      const { data } = await (supabase as any).from(table).select('*').eq('id', id).single();
      
      const isConsistent = Object.keys(expectedData).every(key => 
        data && data[key] === expectedData[key]
      );

      logFlowEvent('OPTIMISTIC_UPDATE', 'verify', { 
        table, 
        id, 
        isConsistent,
        expected: expectedData,
        actual: data 
      });

      return isConsistent;
    } catch (error) {
      logFlowEvent('OPTIMISTIC_UPDATE', 'error', { table, id }, error);
      return false;
    }
  }, [logFlowEvent]);

  // Monitor query cache health
  useEffect(() => {
    const interval = setInterval(() => {
      const queryCache = queryClient.getQueryCache();
      const queries = queryCache.getAll();
      
      const cacheMetrics = {
        totalQueries: queries.length,
        staleQueries: queries.filter(q => q.isStale()).length,
        errorQueries: queries.filter(q => q.state.error).length,
        pendingQueries: queries.filter(q => q.state.status === 'pending').length
      };

      logFlowEvent('QUERY_CACHE', 'health_check', cacheMetrics);
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [queryClient, logFlowEvent]);

  // Real-time connection monitoring
  useEffect(() => {
    const interval = setInterval(monitorRealtimeHealth, 60000); // Every minute
    return () => clearInterval(interval);
  }, [monitorRealtimeHealth]);

  return {
    logFlowEvent,
    startFlow,
    completeFlow,
    getFlowMetrics,
    testDataConsistency,
    verifyOptimisticUpdate,
    criticalFlows
  };
};
