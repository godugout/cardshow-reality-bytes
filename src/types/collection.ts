
export interface Collection {
  id: string;
  title: string;
  description?: string;
  user_id: string;
  visibility: 'public' | 'private' | 'shared';
  cover_image_url?: string;
  template_id?: string;
  is_featured: boolean;
  is_group: boolean;
  allow_member_card_sharing: boolean;
  group_code?: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  owner?: {
    id: string;
    username: string;
    avatar_url?: string;
  };
  stats?: CollectionStats;
  is_following?: boolean;
  follower_count?: number;
  card_count?: number;
}

export interface CollectionCard {
  id: string;
  collection_id: string;
  card_id: string;
  quantity: number;
  display_order: number;
  added_at: string;
  added_by?: string;
  notes?: string;
  card?: {
    id: string;
    title: string;
    image_url: string;
    rarity: string;
    current_market_value?: number;
  };
}

export interface CollectionStats {
  total_cards: number;
  unique_cards: number;
  total_value: number;
  completion_percentage: number;
  last_updated: string;
}

export interface CollectionTemplate {
  id: string;
  name: string;
  description?: string;
  creator_id: string;
  template_hash: string;
  card_filters: Record<string, any>;
  is_public: boolean;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export interface CollectionActivity {
  id: string;
  collection_id: string;
  user_id: string;
  action: string;
  target_id?: string;
  metadata: Record<string, any>;
  created_at: string;
  user?: {
    username: string;
    avatar_url?: string;
  };
}

export interface CollectionFilters {
  visibility?: ('public' | 'private' | 'shared')[];
  user_id?: string;
  is_featured?: boolean;
  search?: string;
}
