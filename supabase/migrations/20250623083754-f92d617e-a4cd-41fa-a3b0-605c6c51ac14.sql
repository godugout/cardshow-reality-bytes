
-- Creator collaborations table for joint projects
CREATE TABLE public.creator_collaborations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL,
  collaborators UUID[] NOT NULL DEFAULT '{}',
  ownership_split JSONB NOT NULL DEFAULT '{}',
  project_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  revenue_sharing_agreement JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  deadline TIMESTAMP WITH TIME ZONE,
  completion_date TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Creator mentorships table for mentor-mentee relationships
CREATE TABLE public.creator_mentorships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
  mentee_id UUID REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
  program_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  start_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  sessions_completed INTEGER DEFAULT 0,
  feedback_rating NUMERIC(3,2),
  payment_amount NUMERIC(10,2),
  commission_percentage NUMERIC(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(mentor_id, mentee_id)
);

-- Creator forums for community discussions
CREATE TABLE public.creator_forums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  skill_level TEXT DEFAULT 'all',
  creator_id UUID REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
  is_pinned BOOLEAN DEFAULT false,
  is_locked BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Forum replies
CREATE TABLE public.forum_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  forum_id UUID REFERENCES public.creator_forums(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_reply_id UUID REFERENCES public.forum_replies(id),
  is_solution BOOLEAN DEFAULT false,
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Creator challenges and contests
CREATE TABLE public.creator_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  challenge_type TEXT NOT NULL,
  difficulty_level TEXT DEFAULT 'intermediate',
  prize_pool NUMERIC(10,2),
  entry_fee NUMERIC(10,2) DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  submission_deadline TIMESTAMP WITH TIME ZONE,
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  status TEXT DEFAULT 'upcoming',
  rules JSONB DEFAULT '{}',
  judging_criteria JSONB DEFAULT '{}',
  created_by UUID REFERENCES public.creator_profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Challenge submissions
CREATE TABLE public.challenge_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID REFERENCES public.creator_challenges(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
  card_id UUID REFERENCES public.cards(id),
  submission_title TEXT,
  submission_description TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  score NUMERIC(5,2),
  ranking INTEGER,
  feedback TEXT,
  is_winner BOOLEAN DEFAULT false,
  prize_amount NUMERIC(10,2),
  UNIQUE(challenge_id, creator_id)
);

-- Creator courses and tutorials
CREATE TABLE public.creator_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  instructor_id UUID REFERENCES public.creator_profiles(id),
  course_type TEXT DEFAULT 'video',
  skill_level TEXT DEFAULT 'beginner',
  duration_minutes INTEGER,
  price NUMERIC(10,2) DEFAULT 0,
  is_free BOOLEAN DEFAULT true,
  thumbnail_url TEXT,
  video_url TEXT,
  course_materials JSONB DEFAULT '{}',
  prerequisites TEXT[],
  learning_objectives TEXT[],
  enrollment_count INTEGER DEFAULT 0,
  rating NUMERIC(3,2) DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Course enrollments
CREATE TABLE public.course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.creator_courses(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  progress_percentage INTEGER DEFAULT 0,
  certificate_issued BOOLEAN DEFAULT false,
  rating NUMERIC(3,2),
  review TEXT,
  UNIQUE(course_id, creator_id)
);

-- Creator following system
CREATE TABLE public.creator_follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
  following_id UUID REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
  followed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  notification_settings JSONB DEFAULT '{"new_cards": true, "challenges": true, "courses": true}',
  UNIQUE(follower_id, following_id)
);

-- Creator activity feed
CREATE TABLE public.creator_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  activity_data JSONB NOT NULL DEFAULT '{}',
  visibility TEXT DEFAULT 'public',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Live streaming sessions
CREATE TABLE public.creator_streams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  stream_type TEXT DEFAULT 'design_session',
  stream_url TEXT,
  thumbnail_url TEXT,
  scheduled_start TIMESTAMP WITH TIME ZONE,
  actual_start TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  max_viewers INTEGER DEFAULT 100,
  current_viewers INTEGER DEFAULT 0,
  total_views INTEGER DEFAULT 0,
  status TEXT DEFAULT 'scheduled',
  recording_url TEXT,
  chat_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Stream viewers and interactions
CREATE TABLE public.stream_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stream_id UUID REFERENCES public.creator_streams(id) ON DELETE CASCADE,
  viewer_id UUID REFERENCES public.creator_profiles(id),
  interaction_type TEXT NOT NULL,
  message TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Creator grants and programs
CREATE TABLE public.creator_grants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  grant_type TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  application_deadline TIMESTAMP WITH TIME ZONE,
  requirements JSONB DEFAULT '{}',
  selection_criteria JSONB DEFAULT '{}',
  available_slots INTEGER,
  applications_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Grant applications
CREATE TABLE public.grant_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grant_id UUID REFERENCES public.creator_grants(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
  project_proposal TEXT NOT NULL,
  budget_breakdown JSONB NOT NULL,
  timeline JSONB NOT NULL,
  portfolio_links TEXT[],
  status TEXT DEFAULT 'pending',
  score NUMERIC(5,2),
  feedback TEXT,
  approved_amount NUMERIC(10,2),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(grant_id, creator_id)
);

-- Enable RLS on all tables
ALTER TABLE public.creator_collaborations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_mentorships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_forums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stream_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grant_applications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for creator collaborations
CREATE POLICY "Users can view collaborations they're part of" ON public.creator_collaborations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.creator_profiles cp 
      WHERE cp.user_id = auth.uid() AND cp.id = ANY(collaborators)
    )
  );

CREATE POLICY "Collaborators can update projects" ON public.creator_collaborations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.creator_profiles cp 
      WHERE cp.user_id = auth.uid() AND cp.id = ANY(collaborators)
    )
  );

-- Create RLS policies for mentorships
CREATE POLICY "Users can view their mentorships" ON public.creator_mentorships
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.creator_profiles cp 
      WHERE cp.user_id = auth.uid() AND (cp.id = mentor_id OR cp.id = mentee_id)
    )
  );

-- Create RLS policies for forums (public read, authenticated write)
CREATE POLICY "Anyone can view public forums" ON public.creator_forums
  FOR SELECT USING (true);

CREATE POLICY "Authenticated creators can create forums" ON public.creator_forums
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.creator_profiles WHERE user_id = auth.uid())
  );

-- Create RLS policies for forum replies
CREATE POLICY "Anyone can view forum replies" ON public.forum_replies
  FOR SELECT USING (true);

CREATE POLICY "Authenticated creators can reply" ON public.forum_replies
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.creator_profiles WHERE user_id = auth.uid())
  );

-- Create RLS policies for challenges (public read)
CREATE POLICY "Anyone can view challenges" ON public.creator_challenges
  FOR SELECT USING (true);

-- Create RLS policies for challenge submissions
CREATE POLICY "Users can view all submissions" ON public.challenge_submissions
  FOR SELECT USING (true);

CREATE POLICY "Users can create their own submissions" ON public.challenge_submissions
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.creator_profiles WHERE user_id = auth.uid() AND id = creator_id)
  );

-- Create RLS policies for courses (public read)
CREATE POLICY "Anyone can view published courses" ON public.creator_courses
  FOR SELECT USING (is_published = true);

CREATE POLICY "Instructors can manage their courses" ON public.creator_courses
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.creator_profiles WHERE user_id = auth.uid() AND id = instructor_id)
  );

-- Create RLS policies for course enrollments
CREATE POLICY "Users can view their enrollments" ON public.course_enrollments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.creator_profiles WHERE user_id = auth.uid() AND id = creator_id)
  );

CREATE POLICY "Users can enroll in courses" ON public.course_enrollments
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.creator_profiles WHERE user_id = auth.uid() AND id = creator_id)
  );

-- Create RLS policies for creator follows
CREATE POLICY "Users can view their follows" ON public.creator_follows
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.creator_profiles cp 
      WHERE cp.user_id = auth.uid() AND (cp.id = follower_id OR cp.id = following_id)
    )
  );

CREATE POLICY "Users can manage their follows" ON public.creator_follows
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.creator_profiles WHERE user_id = auth.uid() AND id = follower_id)
  );

-- Create RLS policies for creator activities (public read)
CREATE POLICY "Anyone can view public activities" ON public.creator_activities
  FOR SELECT USING (visibility = 'public');

CREATE POLICY "Users can create their activities" ON public.creator_activities
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.creator_profiles WHERE user_id = auth.uid() AND id = creator_id)
  );

-- Create RLS policies for creator streams
CREATE POLICY "Anyone can view active streams" ON public.creator_streams
  FOR SELECT USING (status IN ('live', 'scheduled'));

CREATE POLICY "Creators can manage their streams" ON public.creator_streams
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.creator_profiles WHERE user_id = auth.uid() AND id = creator_id)
  );

-- Create RLS policies for stream interactions
CREATE POLICY "Anyone can view stream interactions" ON public.stream_interactions
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can interact with streams" ON public.stream_interactions
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Create RLS policies for creator grants (public read)
CREATE POLICY "Anyone can view available grants" ON public.creator_grants
  FOR SELECT USING (status = 'open');

-- Create RLS policies for grant applications
CREATE POLICY "Users can view their applications" ON public.grant_applications
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.creator_profiles WHERE user_id = auth.uid() AND id = creator_id)
  );

CREATE POLICY "Users can create applications" ON public.grant_applications
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.creator_profiles WHERE user_id = auth.uid() AND id = creator_id)
  );

-- Create indexes for performance
CREATE INDEX idx_creator_collaborations_collaborators ON public.creator_collaborations USING GIN (collaborators);
CREATE INDEX idx_creator_mentorships_mentor ON public.creator_mentorships (mentor_id);
CREATE INDEX idx_creator_mentorships_mentee ON public.creator_mentorships (mentee_id);
CREATE INDEX idx_creator_forums_category ON public.creator_forums (category);
CREATE INDEX idx_forum_replies_forum ON public.forum_replies (forum_id);
CREATE INDEX idx_creator_challenges_status ON public.creator_challenges (status);
CREATE INDEX idx_challenge_submissions_challenge ON public.challenge_submissions (challenge_id);
CREATE INDEX idx_creator_courses_instructor ON public.creator_courses (instructor_id);
CREATE INDEX idx_course_enrollments_creator ON public.course_enrollments (creator_id);
CREATE INDEX idx_creator_follows_follower ON public.creator_follows (follower_id);
CREATE INDEX idx_creator_follows_following ON public.creator_follows (following_id);
CREATE INDEX idx_creator_activities_creator ON public.creator_activities (creator_id);
CREATE INDEX idx_creator_activities_type ON public.creator_activities (activity_type);
CREATE INDEX idx_creator_streams_creator ON public.creator_streams (creator_id);
CREATE INDEX idx_creator_streams_status ON public.creator_streams (status);
CREATE INDEX idx_stream_interactions_stream ON public.stream_interactions (stream_id);
CREATE INDEX idx_creator_grants_status ON public.creator_grants (status);
CREATE INDEX idx_grant_applications_creator ON public.grant_applications (creator_id);

-- Create functions for common operations
CREATE OR REPLACE FUNCTION public.get_creator_activity_feed(creator_uuid UUID, limit_count INTEGER DEFAULT 20)
RETURNS TABLE(
  activity_id UUID,
  creator_id UUID,
  creator_username TEXT,
  activity_type TEXT,
  activity_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ca.id,
    ca.creator_id,
    up.username,
    ca.activity_type,
    ca.activity_data,
    ca.created_at
  FROM public.creator_activities ca
  JOIN public.creator_profiles cp ON cp.id = ca.creator_id
  JOIN public.user_profiles up ON up.id = cp.user_id
  WHERE ca.visibility = 'public'
    AND (creator_uuid IS NULL OR ca.creator_id = creator_uuid)
  ORDER BY ca.created_at DESC
  LIMIT limit_count;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_trending_creators(days_back INTEGER DEFAULT 7)
RETURNS TABLE(
  creator_id UUID,
  username TEXT,
  activity_count BIGINT,
  follower_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cp.id,
    up.username,
    COUNT(ca.id) as activity_count,
    COUNT(cf.follower_id) as follower_count
  FROM public.creator_profiles cp
  JOIN public.user_profiles up ON up.id = cp.user_id
  LEFT JOIN public.creator_activities ca ON ca.creator_id = cp.id 
    AND ca.created_at > (NOW() - INTERVAL '1 day' * days_back)
  LEFT JOIN public.creator_follows cf ON cf.following_id = cp.id
  GROUP BY cp.id, up.username
  ORDER BY activity_count DESC, follower_count DESC
  LIMIT 50;
END;
$$;

-- Create triggers for updating activity feeds
CREATE OR REPLACE FUNCTION public.log_creator_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Log card creation activity
  IF TG_TABLE_NAME = 'cards' AND TG_OP = 'INSERT' THEN
    INSERT INTO public.creator_activities (creator_id, activity_type, activity_data)
    SELECT cp.id, 'card_created', jsonb_build_object(
      'card_id', NEW.id,
      'card_title', NEW.title,
      'card_rarity', NEW.rarity
    )
    FROM public.creator_profiles cp
    WHERE cp.user_id = NEW.creator_id;
  END IF;
  
  -- Log challenge participation
  IF TG_TABLE_NAME = 'challenge_submissions' AND TG_OP = 'INSERT' THEN
    INSERT INTO public.creator_activities (creator_id, activity_type, activity_data)
    VALUES (NEW.creator_id, 'challenge_participated', jsonb_build_object(
      'challenge_id', NEW.challenge_id,
      'submission_id', NEW.id
    ));
  END IF;
  
  -- Log course completion
  IF TG_TABLE_NAME = 'course_enrollments' AND TG_OP = 'UPDATE' 
     AND OLD.completed_at IS NULL AND NEW.completed_at IS NOT NULL THEN
    INSERT INTO public.creator_activities (creator_id, activity_type, activity_data)
    VALUES (NEW.creator_id, 'course_completed', jsonb_build_object(
      'course_id', NEW.course_id,
      'completion_date', NEW.completed_at
    ));
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create triggers
CREATE TRIGGER trigger_log_card_activity
  AFTER INSERT ON public.cards
  FOR EACH ROW EXECUTE FUNCTION public.log_creator_activity();

CREATE TRIGGER trigger_log_challenge_activity
  AFTER INSERT ON public.challenge_submissions
  FOR EACH ROW EXECUTE FUNCTION public.log_creator_activity();

CREATE TRIGGER trigger_log_course_activity
  AFTER UPDATE ON public.course_enrollments
  FOR EACH ROW EXECUTE FUNCTION public.log_creator_activity();
