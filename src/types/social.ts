
export interface SocialActivity {
  id: string;
  user_id: string;
  activity_type: string;
  target_id?: string;
  target_type?: string;
  activity_timestamp: string;
  visibility: 'public' | 'friends' | 'private';
  reaction_count: number;
  metadata: Record<string, any>;
  featured_status: boolean;
  created_at: string;
  updated_at: string;
  username?: string;
  avatar_url?: string;
}

export interface UserRelationship {
  id: string;
  follower_id: string;
  following_id: string;
  relationship_type: 'follow' | 'block' | 'mute';
  created_at: string;
  notification_settings: Record<string, boolean>;
  interaction_count: number;
  last_interaction: string;
}

export interface UserProfile {
  id: string;
  username?: string;
  full_name?: string;
  bio?: string;
  avatar_url?: string;
  cover_image_url?: string;
  location?: string;
  website_url?: string;
  social_links: Record<string, string>;
  experience_points: number;
  level: number;
  total_followers: number;
  total_following: number;
  is_verified: boolean;
  is_creator: boolean;
  privacy_settings: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_type: string;
  achievement_name: string;
  description?: string;
  points_awarded: number;
  badge_image_url?: string;
  unlocked_at: string;
  is_featured: boolean;
  metadata: Record<string, any>;
}

export interface CommunityChallenge {
  id: string;
  title: string;
  description?: string;
  challenge_type: string;
  start_date?: string;
  end_date?: string;
  participant_count: number;
  max_participants?: number;
  prize_pool: number;
  entry_requirements: Record<string, any>;
  rules: Record<string, any>;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface ChallengeParticipation {
  id: string;
  challenge_id: string;
  user_id: string;
  submission_data: Record<string, any>;
  score?: number;
  ranking?: number;
  completed_at?: string;
  created_at: string;
}

export interface UserStats {
  total_cards: number;
  total_collections: number;
  total_followers: number;
  total_following: number;
  experience_points: number;
  level: number;
  achievements_count: number;
}

export interface NotificationData {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message?: string;
  data: Record<string, any>;
  read: boolean;
  created_at: string;
  expires_at?: string;
}
