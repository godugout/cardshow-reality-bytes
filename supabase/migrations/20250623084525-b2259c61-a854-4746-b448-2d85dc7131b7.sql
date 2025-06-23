
-- Creator automation rules for AI-powered assistance
CREATE TABLE public.creator_automation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
  rule_type TEXT NOT NULL, -- 'pricing_optimization', 'design_assistance', 'quality_check', 'promotion'
  conditions JSONB NOT NULL DEFAULT '{}',
  actions JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  execution_count INTEGER DEFAULT 0,
  success_rate NUMERIC(5,2) DEFAULT 0.00,
  last_executed TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Design assets library for reusable components
CREATE TABLE public.design_assets_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
  asset_type TEXT NOT NULL, -- 'texture', 'shape', 'animation', 'shader', 'template'
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  asset_name TEXT NOT NULL,
  description TEXT,
  usage_rights TEXT DEFAULT 'creator_only', -- 'creator_only', 'public', 'commercial', 'premium'
  price NUMERIC(10,2) DEFAULT 0.00,
  downloads_count INTEGER DEFAULT 0,
  revenue_generated NUMERIC(10,2) DEFAULT 0.00,
  tags TEXT[] DEFAULT '{}',
  categories TEXT[] DEFAULT '{}',
  file_size BIGINT,
  file_format TEXT,
  dimensions JSONB, -- width, height, depth for 3D assets
  metadata JSONB DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Creator analytics for advanced insights
CREATE TABLE public.creator_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL, -- 'views', 'downloads', 'revenue', 'engagement', 'conversion'
  metric_value NUMERIC(15,2) NOT NULL,
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  aggregation_level TEXT DEFAULT 'daily', -- 'hourly', 'daily', 'weekly', 'monthly'
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Advanced marketplace listings with SEO and optimization
CREATE TABLE public.marketplace_seo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES public.marketplace_listings(id) ON DELETE CASCADE,
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT[] DEFAULT '{}',
  og_image_url TEXT,
  structured_data JSONB DEFAULT '{}',
  seo_score NUMERIC(3,1) DEFAULT 0.0,
  last_optimized TIMESTAMP WITH TIME ZONE DEFAULT now(),
  auto_optimization_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Creator brand settings for white-label solutions
CREATE TABLE public.creator_brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
  brand_name TEXT NOT NULL,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#000000',
  secondary_color TEXT DEFAULT '#FFFFFF',
  custom_domain TEXT,
  brand_description TEXT,
  social_links JSONB DEFAULT '{}',
  custom_css TEXT,
  white_label_enabled BOOLEAN DEFAULT false,
  brand_verification_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Integration configurations for external services
CREATE TABLE public.creator_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
  integration_type TEXT NOT NULL, -- 'adobe_cc', 'figma', 'shopify', 'social_media', 'print_on_demand'
  config JSONB NOT NULL DEFAULT '{}',
  api_credentials JSONB, -- encrypted
  is_active BOOLEAN DEFAULT true,
  last_sync TIMESTAMP WITH TIME ZONE,
  sync_status TEXT DEFAULT 'pending',
  error_log TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Quality assurance and content moderation
CREATE TABLE public.content_moderation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL, -- can reference cards, templates, etc.
  content_type TEXT NOT NULL, -- 'card', 'template', 'asset'
  moderation_type TEXT NOT NULL, -- 'automated', 'community', 'professional'
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'flagged'
  confidence_score NUMERIC(3,2),
  flags JSONB DEFAULT '{}',
  reviewer_id UUID REFERENCES public.creator_profiles(id),
  review_notes TEXT,
  automated_checks JSONB DEFAULT '{}',
  community_votes JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Creator subscription tiers for advanced monetization
CREATE TABLE public.creator_subscription_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier_name TEXT NOT NULL,
  description TEXT,
  monthly_price NUMERIC(10,2) NOT NULL,
  features JSONB NOT NULL DEFAULT '{}',
  limits JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Creator tokens for special privileges and rewards
CREATE TABLE public.creator_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
  token_type TEXT NOT NULL, -- 'reward', 'achievement', 'privilege', 'beta_access'
  token_value INTEGER NOT NULL,
  source TEXT NOT NULL, -- 'challenge_win', 'milestone', 'community_contribution', 'purchase'
  metadata JSONB DEFAULT '{}',
  expires_at TIMESTAMP WITH TIME ZONE,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Performance metrics for optimization
CREATE TABLE public.performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.creator_profiles(id),
  metric_name TEXT NOT NULL,
  metric_value NUMERIC(15,4) NOT NULL,
  metric_unit TEXT, -- 'ms', 'mb', 'fps', 'score'
  measurement_context TEXT, -- 'design_load', 'asset_processing', 'render_time'
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB DEFAULT '{}'
);

-- Enable RLS on all new tables
ALTER TABLE public.creator_automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.design_assets_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_seo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_moderation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_subscription_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for creator automation rules
CREATE POLICY "Creators can manage their automation rules" ON public.creator_automation_rules
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.creator_profiles WHERE user_id = auth.uid() AND id = creator_id)
  );

-- Create RLS policies for design assets library
CREATE POLICY "Anyone can view public assets" ON public.design_assets_library
  FOR SELECT USING (usage_rights IN ('public', 'commercial'));

CREATE POLICY "Creators can manage their assets" ON public.design_assets_library
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.creator_profiles WHERE user_id = auth.uid() AND id = creator_id)
  );

-- Create RLS policies for creator analytics
CREATE POLICY "Creators can view their analytics" ON public.creator_analytics
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.creator_profiles WHERE user_id = auth.uid() AND id = creator_id)
  );

-- Create RLS policies for marketplace SEO
CREATE POLICY "Sellers can manage their listing SEO" ON public.marketplace_seo
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.marketplace_listings ml 
      WHERE ml.id = listing_id AND ml.seller_id = auth.uid()
    )
  );

-- Create RLS policies for creator brands
CREATE POLICY "Creators can manage their brand" ON public.creator_brands
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.creator_profiles WHERE user_id = auth.uid() AND id = creator_id)
  );

-- Create RLS policies for creator integrations
CREATE POLICY "Creators can manage their integrations" ON public.creator_integrations
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.creator_profiles WHERE user_id = auth.uid() AND id = creator_id)
  );

-- Create RLS policies for content moderation (read-only for most users)
CREATE POLICY "Users can view moderation status of their content" ON public.content_moderation
  FOR SELECT USING (
    content_type = 'card' AND EXISTS (
      SELECT 1 FROM public.cards WHERE id = content_id AND creator_id = auth.uid()
    )
    OR content_type = 'template' AND EXISTS (
      SELECT 1 FROM public.card_templates_creator ctc 
      JOIN public.creator_profiles cp ON cp.id = ctc.creator_id
      WHERE ctc.id = content_id AND cp.user_id = auth.uid()
    )
  );

-- Create RLS policies for subscription tiers (public read)
CREATE POLICY "Anyone can view subscription tiers" ON public.creator_subscription_tiers
  FOR SELECT USING (is_active = true);

-- Create RLS policies for creator tokens
CREATE POLICY "Creators can view their tokens" ON public.creator_tokens
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.creator_profiles WHERE user_id = auth.uid() AND id = creator_id)
  );

-- Create RLS policies for performance metrics
CREATE POLICY "Creators can view their performance metrics" ON public.performance_metrics
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.creator_profiles WHERE user_id = auth.uid() AND id = creator_id)
  );

-- Create indexes for performance
CREATE INDEX idx_creator_automation_rules_creator ON public.creator_automation_rules (creator_id);
CREATE INDEX idx_creator_automation_rules_type ON public.creator_automation_rules (rule_type);
CREATE INDEX idx_design_assets_library_creator ON public.design_assets_library (creator_id);
CREATE INDEX idx_design_assets_library_type ON public.design_assets_library (asset_type);
CREATE INDEX idx_design_assets_library_tags ON public.design_assets_library USING GIN (tags);
CREATE INDEX idx_creator_analytics_creator_date ON public.creator_analytics (creator_id, period_start);
CREATE INDEX idx_creator_analytics_metric ON public.creator_analytics (metric_type);
CREATE INDEX idx_marketplace_seo_listing ON public.marketplace_seo (listing_id);
CREATE INDEX idx_creator_brands_creator ON public.creator_brands (creator_id);
CREATE INDEX idx_creator_integrations_creator ON public.creator_integrations (creator_id);
CREATE INDEX idx_creator_integrations_type ON public.creator_integrations (integration_type);
CREATE INDEX idx_content_moderation_content ON public.content_moderation (content_type, content_id);
CREATE INDEX idx_content_moderation_status ON public.content_moderation (status);
CREATE INDEX idx_creator_tokens_creator ON public.creator_tokens (creator_id);
CREATE INDEX idx_creator_tokens_type ON public.creator_tokens (token_type);
CREATE INDEX idx_performance_metrics_creator ON public.performance_metrics (creator_id);

-- Insert default subscription tiers
INSERT INTO public.creator_subscription_tiers (tier_name, description, monthly_price, features, limits, sort_order) VALUES
('Starter', 'Perfect for new creators getting started', 0.00, 
 '{"templates": "basic", "exports": "standard", "support": "community"}',
 '{"cards_per_month": 10, "storage_gb": 1, "api_calls": 100}', 1),
('Professional', 'Advanced tools for serious creators', 19.99,
 '{"templates": "premium", "exports": "high_quality", "support": "priority", "analytics": "detailed", "automation": "basic"}',
 '{"cards_per_month": 100, "storage_gb": 10, "api_calls": 1000}', 2),
('Enterprise', 'Full access with white-label options', 99.99,
 '{"templates": "unlimited", "exports": "ultra_hd", "support": "dedicated", "analytics": "advanced", "automation": "full", "white_label": true}',
 '{"cards_per_month": -1, "storage_gb": 100, "api_calls": 10000}', 3);

-- Create advanced functions for automation and analytics
CREATE OR REPLACE FUNCTION public.calculate_creator_performance_score(creator_uuid UUID)
RETURNS NUMERIC(5,2)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  performance_score NUMERIC(5,2) := 0.0;
  cards_created INTEGER;
  avg_rating NUMERIC(3,2);
  total_earnings NUMERIC(10,2);
  community_engagement NUMERIC(5,2);
BEGIN
  -- Get basic metrics
  SELECT COUNT(*), COALESCE(AVG(current_market_value), 0), COALESCE(SUM(current_market_value), 0)
  INTO cards_created, avg_rating, total_earnings
  FROM public.cards c
  JOIN public.creator_profiles cp ON cp.user_id = c.creator_id
  WHERE cp.id = creator_uuid;
  
  -- Calculate community engagement score
  SELECT COALESCE(AVG(
    CASE WHEN ca.activity_type = 'card_created' THEN 10
         WHEN ca.activity_type = 'challenge_participated' THEN 15
         WHEN ca.activity_type = 'course_completed' THEN 20
         ELSE 5 END
  ), 0)
  INTO community_engagement
  FROM public.creator_activities ca
  WHERE ca.creator_id = creator_uuid
    AND ca.created_at > NOW() - INTERVAL '30 days';
  
  -- Calculate weighted performance score
  performance_score := LEAST(100.0, 
    (cards_created * 2.0) + 
    (avg_rating * 10.0) + 
    (LEAST(total_earnings / 100.0, 30.0)) +
    (community_engagement)
  );
  
  RETURN performance_score;
END;
$$;

CREATE OR REPLACE FUNCTION public.optimize_listing_pricing(listing_uuid UUID)
RETURNS NUMERIC(10,2)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_price NUMERIC(10,2);
  avg_market_price NUMERIC(10,2);
  card_rarity TEXT;
  view_count INTEGER;
  suggested_price NUMERIC(10,2);
BEGIN
  -- Get current listing data
  SELECT ml.price, c.rarity, ml.views
  INTO current_price, card_rarity, view_count
  FROM public.marketplace_listings ml
  JOIN public.cards c ON c.id = ml.card_id
  WHERE ml.id = listing_uuid;
  
  -- Calculate average market price for similar cards
  SELECT COALESCE(AVG(ml2.price), current_price)
  INTO avg_market_price
  FROM public.marketplace_listings ml2
  JOIN public.cards c2 ON c2.id = ml2.card_id
  WHERE c2.rarity = card_rarity
    AND ml2.status = 'active'
    AND ml2.created_at > NOW() - INTERVAL '30 days';
  
  -- Calculate suggested price based on market data and performance
  suggested_price := avg_market_price * 
    CASE card_rarity
      WHEN 'common' THEN 0.9
      WHEN 'uncommon' THEN 1.0
      WHEN 'rare' THEN 1.2
      WHEN 'epic' THEN 1.5
      WHEN 'legendary' THEN 2.0
      WHEN 'mythic' THEN 3.0
      ELSE 1.0
    END;
  
  -- Adjust based on view count performance
  IF view_count > 100 THEN
    suggested_price := suggested_price * 1.1;
  ELSIF view_count < 10 THEN
    suggested_price := suggested_price * 0.9;
  END IF;
  
  RETURN ROUND(suggested_price, 2);
END;
$$;

CREATE OR REPLACE FUNCTION public.update_seo_optimization(listing_uuid UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  card_data RECORD;
  optimized_title TEXT;
  optimized_description TEXT;
  keyword_array TEXT[];
BEGIN
  -- Get card and listing data
  SELECT c.title, c.description, c.rarity, c.tags, ml.price
  INTO card_data
  FROM public.marketplace_listings ml
  JOIN public.cards c ON c.id = ml.card_id
  WHERE ml.id = listing_uuid;
  
  -- Generate optimized title
  optimized_title := card_data.title || ' - ' || INITCAP(card_data.rarity) || ' Digital Trading Card';
  
  -- Generate optimized description
  optimized_description := COALESCE(card_data.description, '') || 
    ' Premium ' || card_data.rarity || ' digital trading card available for $' || card_data.price || 
    '. Collectible NFT with unique design and verified authenticity.';
  
  -- Generate keywords
  keyword_array := ARRAY[
    card_data.rarity,
    'digital trading card',
    'collectible',
    'NFT',
    'trading card game'
  ] || COALESCE(card_data.tags, '{}');
  
  -- Update or insert SEO data
  INSERT INTO public.marketplace_seo (listing_id, meta_title, meta_description, keywords, last_optimized)
  VALUES (listing_uuid, optimized_title, optimized_description, keyword_array, NOW())
  ON CONFLICT (listing_id) 
  DO UPDATE SET 
    meta_title = EXCLUDED.meta_title,
    meta_description = EXCLUDED.meta_description,
    keywords = EXCLUDED.keywords,
    last_optimized = NOW(),
    updated_at = NOW();
END;
$$;
