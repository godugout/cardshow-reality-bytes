
-- Create feature flags table
CREATE TABLE public.feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'general',
  is_enabled BOOLEAN DEFAULT false,
  rollout_percentage INTEGER DEFAULT 0 CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
  target_users JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create feature flag user overrides table
CREATE TABLE public.feature_flag_user_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flag_id UUID REFERENCES public.feature_flags(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_enabled BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(flag_id, user_id)
);

-- Create branding settings table
CREATE TABLE public.branding_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  category TEXT DEFAULT 'general',
  description TEXT,
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create integration settings table
CREATE TABLE public.integration_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_name TEXT NOT NULL,
  config JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT false,
  api_keys JSONB DEFAULT '{}',
  webhook_url TEXT,
  last_sync TIMESTAMP WITH TIME ZONE,
  error_log TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(integration_name)
);

-- Create image assets table
CREATE TABLE public.image_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  category TEXT DEFAULT 'general',
  alt_text TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_optimized BOOLEAN DEFAULT false,
  cdn_url TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create UX settings table
CREATE TABLE public.ux_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_category TEXT NOT NULL,
  setting_key TEXT NOT NULL,
  setting_value JSONB NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(setting_category, setting_key)
);

-- Enable RLS
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flag_user_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branding_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.image_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ux_settings ENABLE ROW LEVEL SECURITY;

-- RLS policies (admin only for management tables)
CREATE POLICY "Admins can manage feature flags" ON public.feature_flags
  FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage feature flag overrides" ON public.feature_flag_user_overrides
  FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage branding settings" ON public.branding_settings
  FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage integration settings" ON public.integration_settings
  FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage image assets" ON public.image_assets
  FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage UX settings" ON public.ux_settings
  FOR ALL USING (public.is_admin(auth.uid()));

-- Users can read their own feature flag overrides
CREATE POLICY "Users can read their feature flag overrides" ON public.feature_flag_user_overrides
  FOR SELECT USING (auth.uid() = user_id);

-- Function to check if feature flag is enabled for user
CREATE OR REPLACE FUNCTION public.is_feature_enabled(flag_name TEXT, user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  flag_record RECORD;
  user_override BOOLEAN;
BEGIN
  -- Get flag settings
  SELECT * INTO flag_record FROM public.feature_flags WHERE name = flag_name;
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Check for user override first
  SELECT is_enabled INTO user_override 
  FROM public.feature_flag_user_overrides 
  WHERE flag_id = flag_record.id AND user_id = user_uuid;
  
  IF FOUND THEN
    RETURN user_override;
  END IF;
  
  -- Check global flag
  IF NOT flag_record.is_enabled THEN
    RETURN false;
  END IF;
  
  -- Check rollout percentage
  IF flag_record.rollout_percentage = 100 THEN
    RETURN true;
  ELSIF flag_record.rollout_percentage = 0 THEN
    RETURN false;
  ELSE
    -- Simple hash-based rollout
    RETURN (abs(hashtext(user_uuid::TEXT || flag_name)) % 100) < flag_record.rollout_percentage;
  END IF;
END;
$$;

-- Insert initial feature flags
INSERT INTO public.feature_flags (name, description, category, is_enabled) VALUES
  ('creator_onboarding', 'Enable creator onboarding flow for new users', 'creator', false),
  ('3d_card_preview', 'Enable 3D card preview functionality', 'cards', true),
  ('marketplace_v2', 'Enable new marketplace interface', 'marketplace', false),
  ('community_challenges', 'Enable community challenges feature', 'community', true),
  ('advanced_analytics', 'Enable advanced creator analytics dashboard', 'analytics', false);

-- Insert initial branding settings
INSERT INTO public.branding_settings (setting_key, setting_value, category, description) VALUES
  ('primary_logo', '{"url": "", "alt": "Cardshow Logo"}', 'branding', 'Primary logo for the platform'),
  ('favicon', '{"url": "", "sizes": ["16x16", "32x32"]}', 'branding', 'Favicon settings'),
  ('color_scheme', '{"primary": "#00C851", "secondary": "#FFFFFF", "accent": "#333333"}', 'branding', 'Main color scheme'),
  ('footer_text', '{"copyright": "© 2024 Cardshow. All rights reserved.", "tagline": "Create. Collect. Trade."}', 'branding', 'Footer text and copyright');

-- Add triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_feature_flags_updated_at BEFORE UPDATE ON public.feature_flags FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_branding_settings_updated_at BEFORE UPDATE ON public.branding_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_integration_settings_updated_at BEFORE UPDATE ON public.integration_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_image_assets_updated_at BEFORE UPDATE ON public.image_assets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ux_settings_updated_at BEFORE UPDATE ON public.ux_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
