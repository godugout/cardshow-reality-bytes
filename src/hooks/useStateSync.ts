
import { useEffect, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface SyncStatus {
  isOnline: boolean;
  lastSync: number;
  pendingOperations: number;
  conflicts: number;
}

interface PendingOperation {
  id: string;
  table: string;
  operation: 'insert' | 'update' | 'delete';
  data: any;
  timestamp: number;
  retries: number;
}

export const useStateSync = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const pendingOps = useRef<PendingOperation[]>([]);
  const syncStatus = useRef<SyncStatus>({
    isOnline: navigator.onLine,
    lastSync: Date.now(),
    pendingOperations: 0,
    conflicts: 0
  });

  // Queue operation for offline sync
  const queueOperation = useCallback((
    table: string,
    operation: 'insert' | 'update' | 'delete',
    data: any
  ) => {
    const op: PendingOperation = {
      id: crypto.randomUUID(),
      table,
      operation,
      data,
      timestamp: Date.now(),
      retries: 0
    };

    pendingOps.current.push(op);
    syncStatus.current.pendingOperations = pendingOps.current.length;
    
    console.log(`[StateSync] Queued ${operation} on ${table}:`, data);
  }, []);

  // Execute pending operations when back online
  const executePendingOperations = useCallback(async () => {
    if (!syncStatus.current.isOnline || pendingOps.current.length === 0) {
      return;
    }

    const operations = [...pendingOps.current];
    pendingOps.current = [];

    for (const op of operations) {
      try {
        let result;
        
        switch (op.operation) {
          case 'insert':
            result = await supabase.from(op.table).insert(op.data);
            break;
          case 'update':
            result = await supabase.from(op.table).update(op.data).eq('id', op.data.id);
            break;
          case 'delete':
            result = await supabase.from(op.table).delete().eq('id', op.data.id);
            break;
        }

        if (result?.error) {
          throw result.error;
        }

        console.log(`[StateSync] Executed ${op.operation} on ${op.table}`);
        
        // Invalidate related queries
        queryClient.invalidateQueries([op.table] as const);
        
      } catch (error) {
        console.error(`[StateSync] Failed to execute ${op.operation} on ${op.table}:`, error);
        
        // Retry logic
        op.retries++;
        if (op.retries < 3) {
          pendingOps.current.push(op);
        } else {
          console.error(`[StateSync] Max retries exceeded for operation:`, op);
        }
      }
    }

    syncStatus.current.pendingOperations = pendingOps.current.length;
    syncStatus.current.lastSync = Date.now();
  }, [queryClient]);

  // Handle connection state changes
  const handleOnline = useCallback(() => {
    syncStatus.current.isOnline = true;
    console.log('[StateSync] Connection restored, executing pending operations');
    executePendingOperations();
  }, [executePendingOperations]);

  const handleOffline = useCallback(() => {
    syncStatus.current.isOnline = false;
    console.log('[StateSync] Connection lost, operations will be queued');
  }, []);

  // Conflict resolution for concurrent modifications
  const resolveConflict = useCallback(async (
    table: string,
    localData: any,
    serverData: any
  ) => {
    console.log(`[StateSync] Conflict detected in ${table}:`, { localData, serverData });
    
    // Simple last-write-wins strategy
    const localTimestamp = new Date(localData.updated_at || localData.created_at).getTime();
    const serverTimestamp = new Date(serverData.updated_at || serverData.created_at).getTime();
    
    if (localTimestamp > serverTimestamp) {
      // Local data is newer, push to server
      const { error } = await supabase
        .from(table)
        .update(localData)
        .eq('id', localData.id);
      
      if (!error) {
        console.log(`[StateSync] Conflict resolved: local data pushed to server`);
        return localData;
      }
    }
    
    // Server data is newer or push failed, use server data
    console.log(`[StateSync] Conflict resolved: using server data`);
    syncStatus.current.conflicts++;
    return serverData;
  }, []);

  // Set up real-time subscriptions with conflict handling
  const setupRealtimeSync = useCallback((table: string) => {
    if (!user) return null;

    const channel = supabase
      .channel(`sync-${table}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
        },
        async (payload) => {
          console.log(`[StateSync] Real-time update for ${table}:`, payload);
          
          // Check for conflicts with pending operations
          const conflictingOp = pendingOps.current.find(
            op => op.table === table && 
                  op.data.id === payload.new?.id &&
                  op.timestamp > Date.now() - 5000 // Within last 5 seconds
          );

          if (conflictingOp) {
            const resolved = await resolveConflict(table, conflictingOp.data, payload.new);
            
            // Remove resolved operation from pending
            pendingOps.current = pendingOps.current.filter(op => op.id !== conflictingOp.id);
            syncStatus.current.pendingOperations = pendingOps.current.length;
            
            // Update query cache with resolved data
            queryClient.setQueryData([table], (oldData: any) => {
              if (!Array.isArray(oldData)) return oldData;
              return oldData.map((item: any) => 
                item.id === resolved.id ? resolved : item
              );
            });
          } else {
            // No conflict, invalidate queries to refresh
            queryClient.invalidateQueries([table] as const);
          }
        }
      )
      .subscribe();

    return channel;
  }, [user, queryClient, resolveConflict]);

  // Batch query invalidation to reduce re-renders
  const batchInvalidateQueries = useCallback((queryKeys: string[]) => {
    // Debounce invalidations
    const timeoutId = setTimeout(() => {
      queryKeys.forEach(key => {
        queryClient.invalidateQueries([key] as const);
      });
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [queryClient]);

  // Set up connection monitoring
  useEffect(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleOnline, handleOffline]);

  // Periodic sync health check
  useEffect(() => {
    const interval = setInterval(() => {
      if (syncStatus.current.isOnline && pendingOps.current.length > 0) {
        executePendingOperations();
      }
    }, 10000); // Every 10 seconds

    return () => clearInterval(interval);
  }, [executePendingOperations]);

  return {
    queueOperation,
    executePendingOperations,
    setupRealtimeSync,
    batchInvalidateQueries,
    resolveConflict,
    getSyncStatus: () => syncStatus.current,
    getPendingOperations: () => pendingOps.current
  };
};
