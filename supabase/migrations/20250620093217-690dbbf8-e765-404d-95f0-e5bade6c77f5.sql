
-- Create table for 3D gallery preferences
CREATE TABLE public.gallery_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  layout_type TEXT DEFAULT 'circular' CHECK (layout_type IN ('circular', 'gallery_wall', 'spiral', 'grid', 'random_scatter')),
  navigation_speed NUMERIC DEFAULT 1.0 CHECK (navigation_speed >= 0.1 AND navigation_speed <= 3.0),
  auto_rotate BOOLEAN DEFAULT true,
  ambient_lighting BOOLEAN DEFAULT true,
  particle_effects BOOLEAN DEFAULT true,
  spatial_audio BOOLEAN DEFAULT false,
  accessibility_mode BOOLEAN DEFAULT false,
  reduced_motion BOOLEAN DEFAULT false,
  environment_theme TEXT DEFAULT 'auto' CHECK (environment_theme IN ('auto', 'dark', 'light', 'cosmic', 'nature')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create table for gallery viewing history
CREATE TABLE public.gallery_viewing_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  collection_id UUID REFERENCES public.collections(id) ON DELETE CASCADE NOT NULL,
  layout_used TEXT NOT NULL,
  cards_viewed UUID[] DEFAULT '{}',
  session_duration INTEGER, -- in seconds
  interaction_count INTEGER DEFAULT 0,
  last_card_viewed UUID REFERENCES public.cards(id) ON DELETE SET NULL,
  viewing_position JSONB DEFAULT '{"x": 0, "y": 0, "z": 5}', -- camera position
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for shared gallery sessions
CREATE TABLE public.shared_gallery_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID REFERENCES public.collections(id) ON DELETE CASCADE NOT NULL,
  host_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_code TEXT UNIQUE NOT NULL DEFAULT upper(substring(md5(random()::text) from 1 for 8)),
  is_active BOOLEAN DEFAULT true,
  max_participants INTEGER DEFAULT 10,
  current_participants INTEGER DEFAULT 1,
  layout_type TEXT DEFAULT 'circular',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '24 hours'
);

-- Create table for session participants
CREATE TABLE public.gallery_session_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.shared_gallery_sessions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  cursor_position JSONB DEFAULT '{"x": 0, "y": 0, "z": 0}',
  is_host BOOLEAN DEFAULT false,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, user_id)
);

-- Enable RLS on all tables
ALTER TABLE public.gallery_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_viewing_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_gallery_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_session_participants ENABLE ROW LEVEL SECURITY;

-- RLS policies for gallery_preferences
CREATE POLICY "Users can manage their own gallery preferences"
  ON public.gallery_preferences
  FOR ALL
  USING (auth.uid() = user_id);

-- RLS policies for gallery_viewing_history  
CREATE POLICY "Users can view their own viewing history"
  ON public.gallery_viewing_history
  FOR ALL
  USING (auth.uid() = user_id);

-- RLS policies for shared_gallery_sessions
CREATE POLICY "Users can view active sessions for public collections"
  ON public.shared_gallery_sessions
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Users can create their own gallery sessions"
  ON public.shared_gallery_sessions
  FOR INSERT
  WITH CHECK (auth.uid() = host_user_id);

CREATE POLICY "Hosts can update their own sessions"
  ON public.shared_gallery_sessions
  FOR UPDATE
  USING (auth.uid() = host_user_id);

-- RLS policies for gallery_session_participants
CREATE POLICY "Users can join sessions and view participants"
  ON public.gallery_session_participants
  FOR SELECT
  USING (true);

CREATE POLICY "Users can join sessions"
  ON public.gallery_session_participants
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own participation"
  ON public.gallery_session_participants
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_gallery_preferences_user_id ON public.gallery_preferences(user_id);
CREATE INDEX idx_gallery_viewing_history_user_collection ON public.gallery_viewing_history(user_id, collection_id);
CREATE INDEX idx_shared_sessions_active ON public.shared_gallery_sessions(is_active, expires_at);
CREATE INDEX idx_session_participants_session ON public.gallery_session_participants(session_id);

-- Create trigger to update timestamps
CREATE OR REPLACE FUNCTION update_gallery_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_gallery_preferences_timestamp
  BEFORE UPDATE ON public.gallery_preferences
  FOR EACH ROW EXECUTE FUNCTION update_gallery_timestamp();

CREATE TRIGGER update_gallery_history_timestamp
  BEFORE UPDATE ON public.gallery_viewing_history
  FOR EACH ROW EXECUTE FUNCTION update_gallery_timestamp();
