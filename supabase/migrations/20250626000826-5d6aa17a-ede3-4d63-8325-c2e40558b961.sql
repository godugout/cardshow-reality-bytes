
-- Check and create missing gamification tables
CREATE TABLE IF NOT EXISTS public.user_experience_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  points_earned INTEGER NOT NULL DEFAULT 0,
  points_source TEXT NOT NULL, -- welcome, card_created, first_sale, challenge, etc.
  source_id UUID, -- reference to card_id, challenge_id, etc.
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.daily_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  challenge_type TEXT NOT NULL, -- tutorial, create_card, browse_templates, etc.
  target_value INTEGER NOT NULL DEFAULT 1,
  points_reward INTEGER NOT NULL DEFAULT 25,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_challenge_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  challenge_id UUID REFERENCES public.daily_challenges(id) ON DELETE CASCADE NOT NULL,
  current_progress INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, challenge_id)
);

-- Add indexes for performance (use IF NOT EXISTS to avoid conflicts)
CREATE INDEX IF NOT EXISTS idx_user_xp_user_id ON public.user_experience_points(user_id);
CREATE INDEX IF NOT EXISTS idx_user_xp_source ON public.user_experience_points(points_source);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_type ON public.user_achievements(achievement_type);
CREATE INDEX IF NOT EXISTS idx_challenge_progress_user_id ON public.user_challenge_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_challenges_active ON public.daily_challenges(is_active, expires_at);

-- Enable RLS
ALTER TABLE public.user_experience_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenge_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies (drop existing ones first to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own XP" ON public.user_experience_points;
CREATE POLICY "Users can view their own XP" ON public.user_experience_points
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own achievements" ON public.user_achievements;
CREATE POLICY "Users can view their own achievements" ON public.user_achievements
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Everyone can view active challenges" ON public.daily_challenges;
CREATE POLICY "Everyone can view active challenges" ON public.daily_challenges
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Users can view their own challenge progress" ON public.user_challenge_progress;
CREATE POLICY "Users can view their own challenge progress" ON public.user_challenge_progress
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own challenge progress" ON public.user_challenge_progress;
CREATE POLICY "Users can update their own challenge progress" ON public.user_challenge_progress
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own challenge progress" ON public.user_challenge_progress;
CREATE POLICY "Users can insert their own challenge progress" ON public.user_challenge_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to calculate user level based on total XP
CREATE OR REPLACE FUNCTION public.calculate_user_level(total_xp INTEGER)
RETURNS JSONB
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  level_info JSONB;
BEGIN
  IF total_xp < 100 THEN
    level_info := jsonb_build_object(
      'level', 1,
      'title', 'Novice',
      'icon', '🌱',
      'description', 'Just starting your creative journey',
      'next_level_xp', 100
    );
  ELSIF total_xp < 500 THEN
    level_info := jsonb_build_object(
      'level', 2,
      'title', 'Apprentice',
      'icon', '🌲',
      'description', 'Learning the fundamentals',
      'next_level_xp', 500
    );
  ELSIF total_xp < 1500 THEN
    level_info := jsonb_build_object(
      'level', 3,
      'title', 'Artist',
      'icon', '🎨',
      'description', 'Developing your unique style',
      'next_level_xp', 1500
    );
  ELSIF total_xp < 5000 THEN
    level_info := jsonb_build_object(
      'level', 4,
      'title', 'Master',
      'icon', '👑',
      'description', 'Mastering advanced techniques',
      'next_level_xp', 5000
    );
  ELSE
    level_info := jsonb_build_object(
      'level', 5,
      'title', 'Legend',
      'icon', '✨',
      'description', 'Elite creator status',
      'next_level_xp', null
    );
  END IF;
  
  RETURN level_info;
END;
$$;

-- Function to award XP to user
CREATE OR REPLACE FUNCTION public.award_user_xp(
  user_uuid UUID,
  points INTEGER,
  source TEXT,
  source_ref_id UUID DEFAULT NULL,
  xp_metadata JSONB DEFAULT '{}'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_total INTEGER;
  new_total INTEGER;
  old_level JSONB;
  new_level JSONB;
  level_up BOOLEAN := FALSE;
  result JSONB;
BEGIN
  -- Get current total XP
  SELECT COALESCE(SUM(points_earned), 0) INTO current_total
  FROM public.user_experience_points 
  WHERE user_id = user_uuid;
  
  -- Calculate old level
  old_level := public.calculate_user_level(current_total);
  
  -- Insert new XP record
  INSERT INTO public.user_experience_points (user_id, points_earned, points_source, source_id, metadata)
  VALUES (user_uuid, points, source, source_ref_id, xp_metadata);
  
  -- Calculate new total and level
  new_total := current_total + points;
  new_level := public.calculate_user_level(new_total);
  
  -- Check if user leveled up
  IF (old_level->>'level')::INTEGER < (new_level->>'level')::INTEGER THEN
    level_up := TRUE;
  END IF;
  
  -- Update user profile with new XP total
  UPDATE public.user_profiles 
  SET experience_points = new_total,
      level = (new_level->>'level')::INTEGER,
      updated_at = NOW()
  WHERE id = user_uuid;
  
  result := jsonb_build_object(
    'success', true,
    'points_awarded', points,
    'total_xp', new_total,
    'old_level', old_level,
    'new_level', new_level,
    'level_up', level_up
  );
  
  RETURN result;
END;
$$;

-- Function to unlock achievement
CREATE OR REPLACE FUNCTION public.unlock_achievement(
  user_uuid UUID,
  achievement_type_param TEXT,
  achievement_name_param TEXT,
  description_param TEXT,
  points_param INTEGER,
  metadata_param JSONB DEFAULT '{}'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  already_unlocked BOOLEAN;
BEGIN
  -- Check if achievement already unlocked
  SELECT EXISTS(
    SELECT 1 FROM public.user_achievements 
    WHERE user_id = user_uuid AND achievement_type = achievement_type_param
  ) INTO already_unlocked;
  
  IF already_unlocked THEN
    RETURN FALSE;
  END IF;
  
  -- Insert achievement
  INSERT INTO public.user_achievements (
    user_id, achievement_type, achievement_name, description, points_awarded, metadata
  ) VALUES (
    user_uuid, achievement_type_param, achievement_name_param, description_param, points_param, metadata_param
  );
  
  -- Award XP for achievement
  PERFORM public.award_user_xp(user_uuid, points_param, 'achievement', NULL, jsonb_build_object('achievement_type', achievement_type_param));
  
  RETURN TRUE;
END;
$$;

-- Function to generate daily challenges
CREATE OR REPLACE FUNCTION public.generate_daily_challenges()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Clear expired challenges
  DELETE FROM public.daily_challenges WHERE expires_at < NOW();
  
  -- Generate new challenges if none exist for today
  IF NOT EXISTS (
    SELECT 1 FROM public.daily_challenges 
    WHERE expires_at > NOW() + INTERVAL '12 hours'
  ) THEN
    -- Tutorial challenge
    INSERT INTO public.daily_challenges (title, description, challenge_type, target_value, points_reward, expires_at)
    VALUES (
      'Complete a Tutorial',
      'Watch one learning video',
      'tutorial_complete',
      1,
      25,
      NOW() + INTERVAL '24 hours'
    );
    
    -- Template browsing challenge
    INSERT INTO public.daily_challenges (title, description, challenge_type, target_value, points_reward, expires_at)
    VALUES (
      'Explore Templates',
      'Browse 5 card templates',
      'browse_templates',
      5,
      15,
      NOW() + INTERVAL '24 hours'
    );
  END IF;
END;
$$;

-- Trigger to award XP when cards are created
DROP TRIGGER IF EXISTS trigger_card_created ON public.cards;
CREATE OR REPLACE FUNCTION public.handle_card_created()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  is_first_card BOOLEAN;
BEGIN
  -- Check if this is user's first card
  SELECT NOT EXISTS(
    SELECT 1 FROM public.cards 
    WHERE creator_id = NEW.creator_id AND id != NEW.id
  ) INTO is_first_card;
  
  IF is_first_card THEN
    -- Unlock "Creator Debut" achievement
    PERFORM public.unlock_achievement(
      NEW.creator_id,
      'create',
      'Creator Debut',
      'Create your first card',
      100,
      jsonb_build_object('card_id', NEW.id)
    );
  ELSE
    -- Award regular card creation XP
    PERFORM public.award_user_xp(
      NEW.creator_id,
      10,
      'card_created',
      NEW.id,
      jsonb_build_object('card_title', NEW.title)
    );
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_card_created
  AFTER INSERT ON public.cards
  FOR EACH ROW EXECUTE FUNCTION public.handle_card_created();

-- Generate initial challenges
SELECT public.generate_daily_challenges();
