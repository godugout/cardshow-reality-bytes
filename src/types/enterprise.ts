
export interface EnterpriseOrganization {
  id: string;
  name: string;
  domain?: string;
  custom_domain?: string;
  ssl_certificate_status: 'pending' | 'active' | 'failed';
  white_label_config: {
    logo_url?: string;
    primary_color?: string;
    secondary_color?: string;
    custom_css?: string;
    hide_branding?: boolean;
  };
  subscription_tier: string;
  billing_contact_id?: string;
  created_at: string;
  updated_at: string;
}

export interface PlatformAnalytics {
  id: string;
  date: string;
  metric_type: string;
  metric_value: number;
  metadata: Record<string, any>;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'pending' | 'resolved' | 'closed';
  assigned_agent_id?: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface KnowledgeBaseArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  author_id?: string;
  status: 'draft' | 'published' | 'archived';
  view_count: number;
  helpful_count: number;
  created_at: string;
  updated_at: string;
}

export interface ModerationItem {
  id: string;
  content_type: string;
  content_id: string;
  reporter_id?: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'escalated';
  assigned_moderator_id?: string;
  resolution_notes?: string;
  priority: number;
  created_at: string;
  resolved_at?: string;
}

export interface SystemHealth {
  id: string;
  metric_name: string;
  metric_value: number;
  threshold_warning?: number;
  threshold_critical?: number;
  status: 'healthy' | 'warning' | 'critical';
  metadata: Record<string, any>;
  recorded_at: string;
}

export interface GDPRRequest {
  id: string;
  user_id: string;
  request_type: 'export' | 'deletion';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  data_package_url?: string;
  processed_at?: string;
  expires_at?: string;
  created_at: string;
}
