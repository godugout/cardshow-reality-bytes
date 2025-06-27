
-- Create table for CRD elements (frames, backgrounds, logos, etc.)
CREATE TABLE public.crd_elements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  element_type VARCHAR(50) NOT NULL, -- 'frame', 'background', 'logo', 'color_theme', 'effect'
  category VARCHAR(100), -- 'sports', 'gaming', 'fantasy', etc.
  preview_image_url TEXT,
  asset_urls JSONB, -- Store multiple asset files/URLs
  config JSONB NOT NULL DEFAULT '{}', -- Element configuration data
  is_public BOOLEAN DEFAULT false,
  is_free BOOLEAN DEFAULT true,
  price_cents INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  rating_average DECIMAL(3,2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for CRD frames (complete frame packages)
CREATE TABLE public.crd_frames (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  preview_image_url TEXT,
  frame_config JSONB NOT NULL, -- Complete frame configuration
  included_elements UUID[] DEFAULT '{}', -- Array of element IDs included
  is_public BOOLEAN DEFAULT false,
  price_cents INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  rating_average DECIMAL(3,2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for element purchases/downloads  
CREATE TABLE public.element_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  element_id UUID REFERENCES public.crd_elements(id) ON DELETE CASCADE,
  frame_id UUID REFERENCES public.crd_frames(id) ON DELETE CASCADE,
  download_type VARCHAR(20) NOT NULL, -- 'element' or 'frame'
  amount_paid_cents INTEGER DEFAULT 0,
  downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT check_download_type CHECK (
    (download_type = 'element' AND element_id IS NOT NULL AND frame_id IS NULL) OR
    (download_type = 'frame' AND frame_id IS NOT NULL AND element_id IS NULL)
  )
);

-- Create table for user creation progress/mode preferences
CREATE TABLE public.creator_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  preferred_mode VARCHAR(20) DEFAULT 'basic', -- 'basic' or 'studio'
  studio_unlocked BOOLEAN DEFAULT false,
  cards_created_basic INTEGER DEFAULT 0,
  cards_created_studio INTEGER DEFAULT 0,
  elements_created INTEGER DEFAULT 0,
  frames_created INTEGER DEFAULT 0,
  total_earnings_cents INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE public.crd_elements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crd_frames ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.element_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_progress ENABLE ROW LEVEL SECURITY;

-- Policies for CRD elements
CREATE POLICY "Public elements are viewable by everyone" ON public.crd_elements
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view their own elements" ON public.crd_elements
  FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "Users can create elements" ON public.crd_elements
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update their own elements" ON public.crd_elements
  FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Users can delete their own elements" ON public.crd_elements
  FOR DELETE USING (auth.uid() = creator_id);

-- Policies for CRD frames (similar pattern)
CREATE POLICY "Public frames are viewable by everyone" ON public.crd_frames
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view their own frames" ON public.crd_frames
  FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "Users can create frames" ON public.crd_frames
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update their own frames" ON public.crd_frames
  FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Users can delete their own frames" ON public.crd_frames
  FOR DELETE USING (auth.uid() = creator_id);

-- Policies for downloads
CREATE POLICY "Users can view their own downloads" ON public.element_downloads
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create downloads" ON public.element_downloads
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies for creator progress
CREATE POLICY "Users can view their own progress" ON public.creator_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON public.creator_progress
  FOR ALL USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_crd_elements_creator ON public.crd_elements(creator_id);
CREATE INDEX idx_crd_elements_type ON public.crd_elements(element_type);
CREATE INDEX idx_crd_elements_public ON public.crd_elements(is_public) WHERE is_public = true;
CREATE INDEX idx_crd_frames_creator ON public.crd_frames(creator_id);
CREATE INDEX idx_crd_frames_public ON public.crd_frames(is_public) WHERE is_public = true;
CREATE INDEX idx_element_downloads_user ON public.element_downloads(user_id);

-- Create trigger to update timestamps
CREATE TRIGGER update_crd_elements_updated_at
  BEFORE UPDATE ON public.crd_elements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crd_frames_updated_at
  BEFORE UPDATE ON public.crd_frames
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creator_progress_updated_at
  BEFORE UPDATE ON public.creator_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
