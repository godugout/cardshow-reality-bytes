
import type { Database } from '@/integrations/supabase/types';

export type CardRarity = Database['public']['Enums']['card_rarity'];
export type CardType = Database['public']['Enums']['card_type'];
export type VisibilityType = Database['public']['Enums']['visibility_type'];

export interface ManaCost {
  [key: string]: number;
}

export interface Card {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  thumbnail_url?: string;
  creator_id: string;
  card_type?: CardType;
  rarity?: CardRarity;
  power?: number;
  toughness?: number;
  mana_cost?: ManaCost;
  abilities?: string[];
  set_id?: string;
  serial_number?: number;
  total_supply?: number;
  base_price?: number;
  current_market_value?: number;
  is_public?: boolean;
  royalty_percentage?: number;
  view_count?: number;
  favorite_count?: number;
  visibility?: VisibilityType;
  created_at?: string;
  updated_at?: string;
  
  // Computed/joined fields
  creator?: {
    id: string;
    username: string;
    avatar_url?: string;
  };
  set?: {
    id: string;
    name: string;
  };
  is_favorited?: boolean;
}

export interface CardSet {
  id: string;
  name: string;
  description?: string;
  release_date?: string;
  total_cards?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CardStats {
  power?: number;
  toughness?: number;
  mana_cost?: ManaCost;
  abilities?: string[];
}

export interface CardFilters {
  rarity?: CardRarity[];
  card_type?: CardType[];
  creator_id?: string;
  set_id?: string;
  min_price?: number;
  max_price?: number;
  search?: string;
}

export const RARITY_COLORS: Record<CardRarity, string> = {
  common: 'bg-gray-500',
  uncommon: 'bg-green-500',
  rare: 'bg-blue-500',
  epic: 'bg-purple-500',
  legendary: 'bg-orange-500',
  mythic: 'bg-red-500',
};

export const RARITY_LABELS: Record<CardRarity, string> = {
  common: 'Common',
  uncommon: 'Uncommon',
  rare: 'Rare',
  epic: 'Epic',
  legendary: 'Legendary',
  mythic: 'Mythic',
};

export const CARD_TYPE_LABELS: Record<CardType, string> = {
  athlete: 'Athlete',
  creature: 'Creature',
  spell: 'Spell',
  artifact: 'Artifact',
  vehicle: 'Vehicle',
  character: 'Character',
};
