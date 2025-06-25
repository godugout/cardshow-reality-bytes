
-- Performance monitoring tables
CREATE TABLE public.performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_type TEXT NOT NULL, -- 'database', 'realtime', '3d_rendering', 'payment', 'user_engagement'
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metadata JSONB DEFAULT '{}',
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Database query performance tracking
CREATE TABLE public.database_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_hash TEXT NOT NULL,
  query_type TEXT NOT NULL, -- 'SELECT', 'INSERT', 'UPDATE', 'DELETE'
  table_name TEXT,
  execution_time_ms INTEGER NOT NULL,
  rows_affected INTEGER,
  is_slow_query BOOLEAN DEFAULT FALSE,
  error_message TEXT,
  user_id UUID REFERENCES auth.users(id),
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Real-time connection monitoring
CREATE TABLE public.realtime_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id TEXT NOT NULL,
  channel_name TEXT,
  event_type TEXT, -- 'connect', 'disconnect', 'message', 'error'
  latency_ms INTEGER,
  payload_size_bytes INTEGER,
  error_details JSONB,
  user_id UUID REFERENCES auth.users(id),
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3D rendering performance
CREATE TABLE public.rendering_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT NOT NULL,
  fps_average NUMERIC(5,2),
  fps_min NUMERIC(5,2),
  fps_max NUMERIC(5,2),
  memory_used_mb NUMERIC(8,2),
  gpu_memory_mb NUMERIC(8,2),
  webgl_version INTEGER,
  device_info JSONB,
  card_count INTEGER,
  quality_preset TEXT,
  rendering_errors INTEGER DEFAULT 0,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment performance tracking
CREATE TABLE public.payment_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_intent_id TEXT,
  payment_method TEXT,
  amount_cents INTEGER,
  processing_time_ms INTEGER,
  status TEXT, -- 'success', 'failed', 'cancelled', 'pending'
  error_code TEXT,
  error_message TEXT,
  stripe_fee_cents INTEGER,
  user_id UUID REFERENCES auth.users(id),
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User engagement and conversion tracking
CREATE TABLE public.engagement_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL, -- 'page_view', 'card_view', 'purchase', 'signup', 'conversion'
  event_data JSONB DEFAULT '{}',
  page_url TEXT,
  referrer TEXT,
  device_type TEXT,
  browser_type TEXT,
  session_duration_ms INTEGER,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_performance_metrics_type_time ON public.performance_metrics(metric_type, recorded_at DESC);
CREATE INDEX idx_database_performance_slow ON public.database_performance(is_slow_query, recorded_at DESC) WHERE is_slow_query = true;
CREATE INDEX idx_realtime_performance_user ON public.realtime_performance(user_id, recorded_at DESC);
CREATE INDEX idx_rendering_performance_session ON public.rendering_performance(session_id, recorded_at DESC);
CREATE INDEX idx_payment_performance_status ON public.payment_performance(status, recorded_at DESC);
CREATE INDEX idx_engagement_metrics_user_session ON public.engagement_metrics(user_id, session_id, recorded_at DESC);

-- Enable RLS
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.database_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.realtime_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rendering_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.engagement_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies (allow inserts from authenticated users, admin read access)
CREATE POLICY "Users can insert their own performance metrics" ON public.performance_metrics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all performance metrics" ON public.performance_metrics
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can insert their own database performance" ON public.database_performance
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all database performance" ON public.database_performance
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can insert their own realtime performance" ON public.realtime_performance
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all realtime performance" ON public.realtime_performance
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can insert their own rendering performance" ON public.rendering_performance
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all rendering performance" ON public.rendering_performance
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Service can insert payment performance" ON public.payment_performance
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all payment performance" ON public.payment_performance
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can insert their own engagement metrics" ON public.engagement_metrics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all engagement metrics" ON public.engagement_metrics
  FOR SELECT USING (public.is_admin(auth.uid()));

-- Function to get performance summary
CREATE OR REPLACE FUNCTION public.get_performance_summary(
  start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW() - INTERVAL '24 hours',
  end_time TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
RETURNS TABLE(
  metric_category TEXT,
  total_events BIGINT,
  avg_value NUMERIC,
  min_value NUMERIC,
  max_value NUMERIC,
  error_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pm.metric_type as metric_category,
    COUNT(*) as total_events,
    AVG(pm.metric_value) as avg_value,
    MIN(pm.metric_value) as min_value,
    MAX(pm.metric_value) as max_value,
    COUNT(*) FILTER (WHERE pm.metadata->>'error' IS NOT NULL) as error_count
  FROM public.performance_metrics pm
  WHERE pm.recorded_at BETWEEN start_time AND end_time
  GROUP BY pm.metric_type
  ORDER BY pm.metric_type;
END;
$$;

-- Function to detect slow queries
CREATE OR REPLACE FUNCTION public.get_slow_queries(
  threshold_ms INTEGER DEFAULT 1000,
  hours_back INTEGER DEFAULT 24
)
RETURNS TABLE(
  query_hash TEXT,
  query_type TEXT,
  table_name TEXT,
  avg_execution_time NUMERIC,
  max_execution_time INTEGER,
  occurrence_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    dp.query_hash,
    dp.query_type,
    dp.table_name,
    AVG(dp.execution_time_ms) as avg_execution_time,
    MAX(dp.execution_time_ms) as max_execution_time,
    COUNT(*) as occurrence_count
  FROM public.database_performance dp
  WHERE dp.recorded_at > NOW() - INTERVAL '1 hour' * hours_back
    AND dp.execution_time_ms > threshold_ms
  GROUP BY dp.query_hash, dp.query_type, dp.table_name
  ORDER BY avg_execution_time DESC;
END;
$$;
