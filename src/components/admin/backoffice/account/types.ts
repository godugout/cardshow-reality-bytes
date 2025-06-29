
export interface UserAccount {
  id: string;
  username: string;
  email: string;
  full_name: string;
  avatar_url: string;
  subscription_tier: string;
  experience_points: number;
  level: number;
  total_followers: number;
  total_following: number;
  created_at: string;
  last_active: string;
  is_verified: boolean;
  is_suspended: boolean;
}

export const subscriptionTiers = ['all', 'free', 'collector', 'creator_pro', 'enterprise'];
export const statusOptions = ['all', 'active', 'suspended', 'verified'];
