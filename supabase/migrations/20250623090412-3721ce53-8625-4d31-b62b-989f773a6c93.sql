
-- Create social activities table for activity feed system (only if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.social_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  activity_type TEXT NOT NULL,
  target_id UUID,
  target_type TEXT,
  activity_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'friends', 'private')),
  reaction_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  featured_status BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user relationships table for social graph (only if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.user_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  relationship_type TEXT DEFAULT 'follow' CHECK (relationship_type IN ('follow', 'block', 'mute')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notification_settings JSONB DEFAULT '{"likes": true, "comments": true, "new_cards": true}',
  interaction_count INTEGER DEFAULT 0,
  last_interaction TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

-- Create user achievements table (only if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_type TEXT NOT NULL,
  achievement_name TEXT NOT NULL,
  description TEXT,
  points_awarded INTEGER DEFAULT 0,
  badge_image_url TEXT,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_featured BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'
);

-- Create community challenges table (only if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.community_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  challenge_type TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  participant_count INTEGER DEFAULT 0,
  max_participants INTEGER,
  prize_pool NUMERIC DEFAULT 0,
  entry_requirements JSONB DEFAULT '{}',
  rules JSONB DEFAULT '{}',
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed', 'cancelled')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create challenge participations table (only if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.challenge_participations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID REFERENCES public.community_challenges(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  submission_data JSONB DEFAULT '{}',
  score NUMERIC,
  ranking INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(challenge_id, user_id)
);

-- Add columns to existing user_profiles table if they don't exist
DO $$ 
BEGIN
  -- Check if user_profiles table exists, if not create it
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_profiles') THEN
    CREATE TABLE public.user_profiles (
      id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      username TEXT UNIQUE,
      full_name TEXT,
      bio TEXT,
      avatar_url TEXT,
      cover_image_url TEXT,
      location TEXT,
      website_url TEXT,
      social_links JSONB DEFAULT '{}',
      experience_points INTEGER DEFAULT 0,
      level INTEGER DEFAULT 1,
      total_followers INTEGER DEFAULT 0,
      total_following INTEGER DEFAULT 0,
      is_verified BOOLEAN DEFAULT false,
      is_creator BOOLEAN DEFAULT false,
      privacy_settings JSONB DEFAULT '{"profile_visibility": "public", "activity_visibility": "public"}',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  ELSE
    -- Add missing columns to existing user_profiles table
    ALTER TABLE public.user_profiles 
    ADD COLUMN IF NOT EXISTS experience_points INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1,
    ADD COLUMN IF NOT EXISTS total_followers INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS total_following INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS is_creator BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS privacy_settings JSONB DEFAULT '{"profile_visibility": "public", "activity_visibility": "public"}';
  END IF;
END $$;

-- Enable Row Level Security (safe to run multiple times)
ALTER TABLE public.social_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_participations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view public activities" ON public.social_activities;
DROP POLICY IF EXISTS "Users can insert their own activities" ON public.social_activities;
DROP POLICY IF EXISTS "Users can update their own activities" ON public.social_activities;
DROP POLICY IF EXISTS "Users can view their relationships" ON public.user_relationships;
DROP POLICY IF EXISTS "Users can create relationships" ON public.user_relationships;
DROP POLICY IF EXISTS "Users can update their relationships" ON public.user_relationships;
DROP POLICY IF EXISTS "Users can delete their relationships" ON public.user_relationships;
DROP POLICY IF EXISTS "Users can view all achievements" ON public.user_achievements;
DROP POLICY IF EXISTS "Users can view active challenges" ON public.community_challenges;
DROP POLICY IF EXISTS "Users can view challenge participations" ON public.challenge_participations;
DROP POLICY IF EXISTS "Users can insert their participations" ON public.challenge_participations;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;

-- RLS Policies for social_activities
CREATE POLICY "Users can view public activities" ON public.social_activities
  FOR SELECT USING (visibility = 'public' OR user_id = auth.uid());

CREATE POLICY "Users can insert their own activities" ON public.social_activities
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own activities" ON public.social_activities
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for user_relationships
CREATE POLICY "Users can view their relationships" ON public.user_relationships
  FOR SELECT USING (auth.uid() = follower_id OR auth.uid() = following_id);

CREATE POLICY "Users can create relationships" ON public.user_relationships
  FOR INSERT WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can update their relationships" ON public.user_relationships
  FOR UPDATE USING (auth.uid() = follower_id);

CREATE POLICY "Users can delete their relationships" ON public.user_relationships
  FOR DELETE USING (auth.uid() = follower_id);

-- RLS Policies for user_achievements
CREATE POLICY "Users can view all achievements" ON public.user_achievements
  FOR SELECT USING (true);

-- RLS Policies for community_challenges
CREATE POLICY "Users can view active challenges" ON public.community_challenges
  FOR SELECT USING (true);

-- RLS Policies for challenge_participations
CREATE POLICY "Users can view challenge participations" ON public.challenge_participations
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their participations" ON public.challenge_participations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_profiles
CREATE POLICY "Public profiles are viewable by everyone" ON public.user_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create indexes for performance (safe to run multiple times)
CREATE INDEX IF NOT EXISTS idx_social_activities_user_id ON public.social_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_social_activities_timestamp ON public.social_activities(activity_timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_social_activities_type ON public.social_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_user_relationships_follower ON public.user_relationships(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_relationships_following ON public.user_relationships(following_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_community_challenges_status ON public.community_challenges(status);
CREATE INDEX IF NOT EXISTS idx_challenge_participations_challenge ON public.challenge_participations(challenge_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON public.user_profiles(username);

-- Functions for social features
CREATE OR REPLACE FUNCTION public.get_activity_feed(user_uuid UUID, limit_count INTEGER DEFAULT 20)
RETURNS TABLE(
  activity_id UUID,
  user_id UUID,
  username TEXT,
  avatar_url TEXT,
  activity_type TEXT,
  target_id UUID,
  target_type TEXT,
  activity_timestamp TIMESTAMP WITH TIME ZONE,
  metadata JSONB,
  reaction_count INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sa.id,
    sa.user_id,
    up.username,
    up.avatar_url,
    sa.activity_type,
    sa.target_id,
    sa.target_type,
    sa.activity_timestamp,
    sa.metadata,
    sa.reaction_count
  FROM public.social_activities sa
  JOIN public.user_profiles up ON up.id = sa.user_id
  LEFT JOIN public.user_relationships ur ON ur.following_id = sa.user_id AND ur.follower_id = user_uuid
  WHERE sa.visibility = 'public' 
    AND (sa.user_id = user_uuid OR ur.relationship_type = 'follow')
  ORDER BY sa.activity_timestamp DESC
  LIMIT limit_count;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_user_stats(user_uuid UUID)
RETURNS TABLE(
  total_cards INTEGER,
  total_collections INTEGER,
  total_followers INTEGER,
  total_following INTEGER,
  experience_points INTEGER,
  level INTEGER,
  achievements_count INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE((SELECT COUNT(*)::INTEGER FROM public.cards WHERE creator_id = user_uuid), 0),
    COALESCE((SELECT COUNT(*)::INTEGER FROM public.collections WHERE user_id = user_uuid), 0),
    COALESCE(up.total_followers, 0),
    COALESCE(up.total_following, 0),
    COALESCE(up.experience_points, 0),
    COALESCE(up.level, 1),
    COALESCE((SELECT COUNT(*)::INTEGER FROM public.user_achievements WHERE user_id = user_uuid), 0)
  FROM public.user_profiles up
  WHERE up.id = user_uuid;
END;
$$;

-- Trigger to update relationship counts
CREATE OR REPLACE FUNCTION public.update_follow_counts()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.relationship_type = 'follow' THEN
    -- Update follower count for the followed user
    UPDATE public.user_profiles 
    SET total_followers = total_followers + 1 
    WHERE id = NEW.following_id;
    
    -- Update following count for the follower
    UPDATE public.user_profiles 
    SET total_following = total_following + 1 
    WHERE id = NEW.follower_id;
    
  ELSIF TG_OP = 'DELETE' AND OLD.relationship_type = 'follow' THEN
    -- Update follower count for the unfollowed user
    UPDATE public.user_profiles 
    SET total_followers = GREATEST(total_followers - 1, 0) 
    WHERE id = OLD.following_id;
    
    -- Update following count for the unfollower
    UPDATE public.user_profiles 
    SET total_following = GREATEST(total_following - 1, 0) 
    WHERE id = OLD.follower_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_follow_counts_trigger ON public.user_relationships;

-- Create trigger
CREATE TRIGGER update_follow_counts_trigger
  AFTER INSERT OR DELETE ON public.user_relationships
  FOR EACH ROW EXECUTE FUNCTION public.update_follow_counts();
