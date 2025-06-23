
-- Enterprise Organizations table
CREATE TABLE public.enterprise_organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  domain TEXT UNIQUE,
  custom_domain TEXT,
  ssl_certificate_status TEXT DEFAULT 'pending',
  white_label_config JSONB DEFAULT '{}',
  subscription_tier TEXT DEFAULT 'enterprise',
  billing_contact_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enterprise Users junction table
CREATE TABLE public.enterprise_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.enterprise_organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member',
  permissions JSONB DEFAULT '{}',
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

-- Admin Dashboard Analytics
CREATE TABLE public.platform_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  metric_type TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(date, metric_type)
);

-- Content Moderation Queue
CREATE TABLE public.moderation_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL,
  content_id UUID NOT NULL,
  reporter_id UUID REFERENCES auth.users(id),
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  assigned_moderator_id UUID REFERENCES auth.users(id),
  resolution_notes TEXT,
  priority INTEGER DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Support Tickets
CREATE TABLE public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'open',
  assigned_agent_id UUID REFERENCES auth.users(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Support Messages
CREATE TABLE public.support_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id),
  message TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT false,
  attachments JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Knowledge Base Articles
CREATE TABLE public.knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  author_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'draft',
  view_count INTEGER DEFAULT 0,
  helpful_count INTEGER DEFAULT 0,
  search_vector TSVECTOR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API Usage Tracking
CREATE TABLE public.api_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  response_status INTEGER,
  response_time_ms INTEGER,
  request_size_bytes INTEGER,
  response_size_bytes INTEGER,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit Logs
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- GDPR Data Requests
CREATE TABLE public.gdpr_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  request_type TEXT NOT NULL, -- 'export' or 'deletion'
  status TEXT DEFAULT 'pending',
  data_package_url TEXT,
  processed_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System Health Metrics
CREATE TABLE public.system_health (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  threshold_warning NUMERIC,
  threshold_critical NUMERIC,
  status TEXT DEFAULT 'healthy',
  metadata JSONB DEFAULT '{}',
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business Intelligence Reports
CREATE TABLE public.bi_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  report_type TEXT NOT NULL,
  config JSONB NOT NULL,
  schedule TEXT,
  last_run_at TIMESTAMP WITH TIME ZONE,
  next_run_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_platform_analytics_date_type ON public.platform_analytics(date, metric_type);
CREATE INDEX idx_moderation_queue_status ON public.moderation_queue(status);
CREATE INDEX idx_support_tickets_user_status ON public.support_tickets(user_id, status);
CREATE INDEX idx_api_usage_user_endpoint ON public.api_usage(user_id, endpoint);
CREATE INDEX idx_audit_logs_user_action ON public.audit_logs(user_id, action);
CREATE INDEX idx_system_health_metric_time ON public.system_health(metric_name, recorded_at);

-- Create full-text search index for knowledge base
CREATE INDEX idx_knowledge_base_search ON public.knowledge_base USING GIN(search_vector);

-- Enable RLS on all tables
ALTER TABLE public.enterprise_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enterprise_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gdpr_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bi_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin access
CREATE POLICY "Admins can manage everything" ON public.platform_analytics
  FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage moderation" ON public.moderation_queue
  FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can view their tickets" ON public.support_tickets
  FOR SELECT USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Users can create tickets" ON public.support_tickets
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Public can read published articles" ON public.knowledge_base
  FOR SELECT USING (status = 'published' OR public.is_admin(auth.uid()));

CREATE POLICY "Users can view their GDPR requests" ON public.gdpr_requests
  FOR SELECT USING (user_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Users can create GDPR requests" ON public.gdpr_requests
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Functions for enterprise features
CREATE OR REPLACE FUNCTION public.get_platform_metrics(days_back INTEGER DEFAULT 30)
RETURNS TABLE(
  metric_type TEXT,
  current_value NUMERIC,
  previous_value NUMERIC,
  change_percentage NUMERIC
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pa.metric_type,
    pa.metric_value as current_value,
    LAG(pa.metric_value) OVER (PARTITION BY pa.metric_type ORDER BY pa.date) as previous_value,
    CASE 
      WHEN LAG(pa.metric_value) OVER (PARTITION BY pa.metric_type ORDER BY pa.date) > 0
      THEN ((pa.metric_value - LAG(pa.metric_value) OVER (PARTITION BY pa.metric_type ORDER BY pa.date)) / LAG(pa.metric_value) OVER (PARTITION BY pa.metric_type ORDER BY pa.date)) * 100
      ELSE 0
    END as change_percentage
  FROM public.platform_analytics pa
  WHERE pa.date >= CURRENT_DATE - INTERVAL '1 day' * days_back
  ORDER BY pa.metric_type, pa.date DESC;
END;
$$;

-- Function to log audit events
CREATE OR REPLACE FUNCTION public.log_audit_event(
  p_action TEXT,
  p_resource_type TEXT,
  p_resource_id UUID DEFAULT NULL,
  p_old_values JSONB DEFAULT NULL,
  p_new_values JSONB DEFAULT NULL
) RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  audit_id UUID;
BEGIN
  INSERT INTO public.audit_logs (
    user_id, action, resource_type, resource_id, old_values, new_values,
    ip_address, user_agent
  ) VALUES (
    auth.uid(), p_action, p_resource_type, p_resource_id, p_old_values, p_new_values,
    inet_client_addr(), current_setting('request.headers', true)::json->>'user-agent'
  ) RETURNING id INTO audit_id;
  
  RETURN audit_id;
END;
$$;

-- Function to update knowledge base search vector
CREATE OR REPLACE FUNCTION public.update_knowledge_base_search()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', NEW.title || ' ' || NEW.content);
  RETURN NEW;
END;
$$;

-- Trigger for knowledge base search
CREATE TRIGGER update_kb_search_vector
  BEFORE INSERT OR UPDATE ON public.knowledge_base
  FOR EACH ROW EXECUTE FUNCTION public.update_knowledge_base_search();

-- Function for GDPR data export
CREATE OR REPLACE FUNCTION public.process_gdpr_export(user_uuid UUID)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  user_data JSONB;
BEGIN
  SELECT jsonb_build_object(
    'profile', (SELECT to_jsonb(up.*) FROM public.user_profiles up WHERE up.id = user_uuid),
    'cards', (SELECT jsonb_agg(to_jsonb(c.*)) FROM public.cards c WHERE c.creator_id = user_uuid),
    'collections', (SELECT jsonb_agg(to_jsonb(col.*)) FROM public.collections col WHERE col.user_id = user_uuid),
    'activities', (SELECT jsonb_agg(to_jsonb(sa.*)) FROM public.social_activities sa WHERE sa.user_id = user_uuid),
    'export_date', NOW()
  ) INTO user_data;
  
  RETURN user_data;
END;
$$;
