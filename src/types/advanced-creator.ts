
export interface CreatorAutomationRule {
  id: string;
  creator_id: string;
  rule_type: 'pricing_optimization' | 'design_assistance' | 'quality_check' | 'promotion';
  conditions: Record<string, any>;
  actions: Record<string, any>;
  is_active: boolean;
  execution_count: number;
  success_rate: number;
  last_executed?: string;
  created_at: string;
  updated_at: string;
}

export interface DesignAsset {
  id: string;
  creator_id: string;
  asset_type: 'texture' | 'shape' | 'animation' | 'shader' | 'template';
  file_url: string;
  thumbnail_url?: string;
  asset_name: string;
  description?: string;
  usage_rights: 'creator_only' | 'public' | 'commercial' | 'premium';
  price: number;
  downloads_count: number;
  revenue_generated: number;
  tags: string[];
  categories: string[];
  file_size?: number;
  file_format?: string;
  dimensions?: Record<string, any>;
  metadata: Record<string, any>;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreatorAnalytics {
  id: string;
  creator_id: string;
  metric_type: 'views' | 'downloads' | 'revenue' | 'engagement' | 'conversion';
  metric_value: number;
  period_start: string;
  period_end: string;
  aggregation_level: 'hourly' | 'daily' | 'weekly' | 'monthly';
  metadata: Record<string, any>;
  created_at: string;
}

export interface MarketplaceSEO {
  id: string;
  listing_id: string;
  meta_title?: string;
  meta_description?: string;
  keywords: string[];
  og_image_url?: string;
  structured_data: Record<string, any>;
  seo_score: number;
  last_optimized: string;
  auto_optimization_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreatorBrand {
  id: string;
  creator_id: string;
  brand_name: string;
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  custom_domain?: string;
  brand_description?: string;
  social_links: Record<string, any>;
  custom_css?: string;
  white_label_enabled: boolean;
  brand_verification_status: string;
  created_at: string;
  updated_at: string;
}

export interface CreatorIntegration {
  id: string;
  creator_id: string;
  integration_type: 'adobe_cc' | 'figma' | 'shopify' | 'social_media' | 'print_on_demand';
  config: Record<string, any>;
  is_active: boolean;
  last_sync?: string;
  sync_status: string;
  error_log?: string;
  created_at: string;
  updated_at: string;
}

export interface ContentModeration {
  id: string;
  content_id: string;
  content_type: 'card' | 'template' | 'asset';
  moderation_type: 'automated' | 'community' | 'professional';
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  confidence_score?: number;
  flags: Record<string, any>;
  reviewer_id?: string;
  review_notes?: string;
  automated_checks: Record<string, any>;
  community_votes: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CreatorSubscriptionTier {
  id: string;
  tier_name: string;
  description?: string;
  monthly_price: number;
  features: Record<string, any>;
  limits: Record<string, any>;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CreatorToken {
  id: string;
  creator_id: string;
  token_type: 'reward' | 'achievement' | 'privilege' | 'beta_access';
  token_value: number;
  source: string;
  metadata: Record<string, any>;
  expires_at?: string;
  used_at?: string;
  created_at: string;
}

export interface PerformanceMetric {
  id: string;
  creator_id?: string;
  metric_name: string;
  metric_value: number;
  metric_unit?: string;
  measurement_context?: string;
  timestamp: string;
  metadata: Record<string, any>;
}
