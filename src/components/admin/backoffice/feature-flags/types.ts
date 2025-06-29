
export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  category: string;
  is_enabled: boolean;
  rollout_percentage: number;
  target_users: string[];
  metadata: Record<string, any>;
  created_at: string;
}

export const categoryColors = {
  general: 'bg-gray-600',
  creator: 'bg-purple-600',
  cards: 'bg-blue-600',
  marketplace: 'bg-green-600',
  community: 'bg-orange-600',
  analytics: 'bg-pink-600'
};

export const categories = ['general', 'creator', 'cards', 'marketplace', 'community', 'analytics'];
