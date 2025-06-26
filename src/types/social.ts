
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  experience_points: number;
  level: number;
  total_followers: number;
  total_following: number;
  subscription_tier: string;
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
  activity_type: string;
  target_id?: string;
  target_type?: string;
  activity_timestamp: string;
  metadata: Record<string, any>;
  reaction_count: number;
  visibility: 'public' | 'friends' | 'private';
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
