
export interface CreatorForum {
  id: string;
  title: string;
  description?: string;
  category: string;
  skill_level: string;
  creator_id: string;
  is_pinned: boolean;
  is_locked: boolean;
  view_count: number;
  reply_count: number;
  last_activity: string;
  created_at: string;
  updated_at: string;
  creator?: {
    id: string;
    user_id: string;
    bio?: string;
    specialties: string[];
    verification_status: string;
    user_profile?: {
      username: string;
      avatar_url?: string;
    };
  };
}

export interface ForumReply {
  id: string;
  forum_id: string;
  creator_id: string;
  content: string;
  parent_reply_id?: string;
  is_solution: boolean;
  upvotes: number;
  created_at: string;
  updated_at: string;
  creator?: {
    id: string;
    user_profile?: {
      username: string;
      avatar_url?: string;
    };
  };
}

export interface CreatorChallenge {
  id: string;
  title: string;
  description: string;
  challenge_type: string;
  difficulty_level: string;
  prize_pool?: number;
  entry_fee: number;
  start_date?: string;
  end_date?: string;
  submission_deadline?: string;
  max_participants?: number;
  current_participants: number;
  status: 'upcoming' | 'active' | 'judging' | 'completed' | 'cancelled';
  rules: Record<string, any>;
  judging_criteria: Record<string, any>;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface ChallengeSubmission {
  id: string;
  challenge_id: string;
  creator_id: string;
  card_id?: string;
  submission_title?: string;
  submission_description?: string;
  submitted_at: string;
  score?: number;
  ranking?: number;
  feedback?: string;
  is_winner: boolean;
  prize_amount?: number;
  card?: {
    id: string;
    title: string;
    image_url?: string;
    rarity: string;
  };
  creator?: {
    id: string;
    user_profile?: {
      username: string;
      avatar_url?: string;
    };
  };
}

export interface CreatorCourse {
  id: string;
  title: string;
  description?: string;
  instructor_id?: string;
  course_type: string;
  skill_level: string;
  duration_minutes?: number;
  price: number;
  is_free: boolean;
  thumbnail_url?: string;
  video_url?: string;
  course_materials: Record<string, any>;
  prerequisites: string[];
  learning_objectives: string[];
  enrollment_count: number;
  rating: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  instructor?: {
    id: string;
    user_profile?: {
      username: string;
      avatar_url?: string;
    };
  };
}

export interface CourseEnrollment {
  id: string;
  course_id: string;
  creator_id: string;
  enrolled_at: string;
  completed_at?: string;
  progress_percentage: number;
  certificate_issued: boolean;
  rating?: number;
  review?: string;
}

export interface CreatorFollow {
  id: string;
  follower_id: string;
  following_id: string;
  followed_at: string;
  notification_settings: Record<string, boolean>;
}

export interface CreatorActivity {
  id: string;
  creator_id: string;
  activity_type: string;
  activity_data: Record<string, any>;
  visibility: 'public' | 'private' | 'followers';
  created_at: string;
  creator?: {
    id: string;
    user_profile?: {
      username: string;
      avatar_url?: string;
    };
  };
}

export interface CreatorStream {
  id: string;
  creator_id: string;
  title: string;
  description?: string;
  stream_type: string;
  stream_url?: string;
  thumbnail_url?: string;
  scheduled_start?: string;
  actual_start?: string;
  ended_at?: string;
  max_viewers: number;
  current_viewers: number;
  total_views: number;
  status: 'scheduled' | 'live' | 'ended' | 'cancelled';
  recording_url?: string;
  chat_enabled: boolean;
  created_at: string;
  creator?: {
    id: string;
    user_profile?: {
      username: string;
      avatar_url?: string;
    };
  };
}

export interface StreamInteraction {
  id: string;
  stream_id: string;
  viewer_id?: string;
  interaction_type: string;
  message?: string;
  timestamp: string;
  viewer?: {
    id: string;
    user_profile?: {
      username: string;
      avatar_url?: string;
    };
  };
}

export interface CreatorGrant {
  id: string;
  title: string;
  description: string;
  grant_type: string;
  amount: number;
  application_deadline?: string;
  requirements: Record<string, any>;
  selection_criteria: Record<string, any>;
  available_slots?: number;
  applications_count: number;
  status: 'open' | 'closed' | 'review' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface GrantApplication {
  id: string;
  grant_id: string;
  creator_id: string;
  project_proposal: string;
  budget_breakdown: Record<string, any>;
  timeline: Record<string, any>;
  portfolio_links: string[];
  status: 'pending' | 'approved' | 'rejected' | 'withdrawn';
  score?: number;
  feedback?: string;
  approved_amount?: number;
  submitted_at: string;
  reviewed_at?: string;
}

export interface CreatorMentorship {
  id: string;
  mentor_id: string;
  mentee_id: string;
  program_type: string;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  start_date: string;
  sessions_completed: number;
  feedback_rating?: number;
  payment_amount?: number;
  commission_percentage?: number;
  created_at: string;
  updated_at: string;
  mentor?: {
    id: string;
    user_profile?: {
      username: string;
      avatar_url?: string;
    };
  };
  mentee?: {
    id: string;
    user_profile?: {
      username: string;
      avatar_url?: string;
    };
  };
}

export interface CreatorCollaboration {
  id: string;
  project_id: string;
  collaborators: string[];
  ownership_split: Record<string, any>;
  project_type: string;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  revenue_sharing_agreement: Record<string, any>;
  created_at: string;
  deadline?: string;
  completion_date?: string;
  updated_at: string;
}
