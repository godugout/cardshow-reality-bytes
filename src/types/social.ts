
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  website_url?: string;
  cover_image_url?: string;
  experience_points: number;
  level: number;
  total_followers: number;
  total_following: number;
  subscription_tier: string;
  is_verified?: boolean;
  is_creator?: boolean;
  created_at: string;
  updated_at: string;
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

export interface SocialActivity {
  id: string;
  user_id: string;
  username?: string;
  avatar_url?: string;
  activity_type: string;
  target_id?: string;
  target_type?: string;
  activity_timestamp: string;
  metadata: Record<string, any>;
  reaction_count: number;
  visibility: 'public' | 'friends' | 'private';
  featured_status?: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserRelationship {
  id: string;
  follower_id: string;
  following_id: string;
  relationship_type: 'follow' | 'block' | 'mute';
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'follow' | 'like' | 'comment' | 'trade' | 'system';
  is_read: boolean;
  metadata: Record<string, any>;
  created_at: string;
}

// Add alias for backward compatibility
export type NotificationData = Notification;

export interface CommunityChallenge {
  id: string;
  title: string;
  description: string;
  challenge_type: string;
  status: string;
  start_date: string;
  end_date: string;
  participant_count: number;
  max_participants?: number;
  prize_pool: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ChallengeParticipation {
  id: string;
  user_id: string;
  challenge_id: string;
  submission_data: Record<string, any>;
  score?: number;
  ranking?: number;
  completed_at?: string;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_name: string;
  description: string;
  badge_image_url?: string;
  points_awarded: number;
  unlocked_at: string;
}
