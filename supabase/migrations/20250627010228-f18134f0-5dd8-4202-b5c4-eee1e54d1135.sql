
-- Create social activities table for activity feed system
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

-- Create user relationships table for social graph
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

-- Create notifications table with proper structure
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  actor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('follow', 'like', 'comment', 'trade', 'system', 'card_shared', 'collection_shared')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  metadata JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user achievements table
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

-- Add missing columns to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS cover_image_url TEXT,
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free';

-- Enable Row Level Security
ALTER TABLE public.social_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist, then recreate them
DROP POLICY IF EXISTS "Users can view public activities" ON public.social_activities;
DROP POLICY IF EXISTS "Users can insert their own activities" ON public.social_activities;
DROP POLICY IF EXISTS "Users can update their own activities" ON public.social_activities;

CREATE POLICY "Users can view public activities" ON public.social_activities
  FOR SELECT USING (visibility = 'public' OR user_id = auth.uid());

CREATE POLICY "Users can insert their own activities" ON public.social_activities
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own activities" ON public.social_activities
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for user_relationships
DROP POLICY IF EXISTS "Users can view their relationships" ON public.user_relationships;
DROP POLICY IF EXISTS "Users can create relationships" ON public.user_relationships;
DROP POLICY IF EXISTS "Users can update their relationships" ON public.user_relationships;
DROP POLICY IF EXISTS "Users can delete their relationships" ON public.user_relationships;

CREATE POLICY "Users can view their relationships" ON public.user_relationships
  FOR SELECT USING (auth.uid() = follower_id OR auth.uid() = following_id);

CREATE POLICY "Users can create relationships" ON public.user_relationships
  FOR INSERT WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can update their relationships" ON public.user_relationships
  FOR UPDATE USING (auth.uid() = follower_id);

CREATE POLICY "Users can delete their relationships" ON public.user_relationships
  FOR DELETE USING (auth.uid() = follower_id);

-- RLS Policies for notifications
DROP POLICY IF EXISTS "Users can view their notifications" ON public.notifications;
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their notifications" ON public.notifications;

CREATE POLICY "Users can view their notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = recipient_id);

CREATE POLICY "System can create notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = recipient_id);

-- RLS Policies for user_achievements
DROP POLICY IF EXISTS "Users can view all achievements" ON public.user_achievements;
CREATE POLICY "Users can view all achievements" ON public.user_achievements
  FOR SELECT USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_social_activities_user_id ON public.social_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_social_activities_timestamp ON public.social_activities(activity_timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_social_activities_type ON public.social_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_user_relationships_follower ON public.user_relationships(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_relationships_following ON public.user_relationships(following_id);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON public.notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(recipient_id, is_read);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON public.user_achievements(user_id);

-- Enable realtime for all social tables
ALTER TABLE public.social_activities REPLICA IDENTITY FULL;
ALTER TABLE public.user_relationships REPLICA IDENTITY FULL;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER TABLE public.user_achievements REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.social_activities;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_relationships;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_achievements;
