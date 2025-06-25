
export interface PerformanceMetric {
  metricType: 'database' | 'realtime' | '3d_rendering' | 'payment' | 'user_engagement';
  metricName: string;
  metricValue: number;
  metadata?: Record<string, any>;
  sessionId?: string;
}

export interface DatabaseQuery {
  queryHash: string;
  queryType: string;
  tableName?: string;
  executionTimeMs: number;
  rowsAffected?: number;
  errorMessage?: string;
}

export interface RealtimeEvent {
  connectionId: string;
  channelName?: string;
  eventType: 'connect' | 'disconnect' | 'message' | 'error';
  latencyMs?: number;
  payloadSizeBytes?: number;
  errorDetails?: Record<string, any>;
}

export interface RenderingMetrics {
  sessionId: string;
  fpsAverage: number;
  fpsMin: number;
  fpsMax: number;
  memoryUsedMb: number;
  gpuMemoryMb?: number;
  webglVersion: number;
  deviceInfo: Record<string, any>;
  cardCount: number;
  qualityPreset: string;
  renderingErrors: number;
}

export interface PaymentMetrics {
  paymentIntentId?: string;
  paymentMethod: string;
  amountCents: number;
  processingTimeMs: number;
  status: 'success' | 'failed' | 'cancelled' | 'pending';
  errorCode?: string;
  errorMessage?: string;
  stripeFeeCents?: number;
}

export interface EngagementEvent {
  sessionId: string;
  eventType: 'page_view' | 'card_view' | 'purchase' | 'signup' | 'conversion';
  eventData?: Record<string, any>;
  pageUrl?: string;
  referrer?: string;
  deviceType?: string;
  browserType?: string;
  sessionDurationMs?: number;
}
