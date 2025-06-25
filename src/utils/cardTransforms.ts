
import type { Card as CardType, ManaCost } from '@/types/card';

export const transformToCardType = (data: any): CardType => {
  // Handle null/undefined data
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid card data provided');
  }

  // Safely transform mana_cost
  let manaCost: ManaCost = {};
  if (data.mana_cost) {
    if (typeof data.mana_cost === 'object' && data.mana_cost !== null) {
      manaCost = data.mana_cost as ManaCost;
    } else if (typeof data.mana_cost === 'string') {
      try {
        manaCost = JSON.parse(data.mana_cost) as ManaCost;
      } catch {
        manaCost = {};
      }
    }
  }

  // Safely transform abilities
  let abilities: string[] = [];
  if (data.abilities) {
    if (Array.isArray(data.abilities)) {
      abilities = data.abilities.filter(ability => typeof ability === 'string');
    } else if (typeof data.abilities === 'string') {
      try {
        const parsed = JSON.parse(data.abilities);
        abilities = Array.isArray(parsed) ? parsed.filter(ability => typeof ability === 'string') : [];
      } catch {
        abilities = [];
      }
    }
  }

  return {
    id: data.id || '',
    title: data.title || 'Untitled Card',
    description: data.description || null,
    image_url: data.image_url || null,
    thumbnail_url: data.thumbnail_url || null,
    creator_id: data.creator_id || '',
    card_type: data.card_type || 'character',
    rarity: data.rarity || 'common',
    power: typeof data.power === 'number' ? data.power : undefined,
    toughness: typeof data.toughness === 'number' ? data.toughness : undefined,
    mana_cost: manaCost,
    abilities,
    set_id: data.set_id || null,
    serial_number: typeof data.serial_number === 'number' ? data.serial_number : undefined,
    total_supply: typeof data.total_supply === 'number' ? data.total_supply : undefined,
    base_price: typeof data.base_price === 'number' ? data.base_price : undefined,
    current_market_value: typeof data.current_market_value === 'number' ? data.current_market_value : undefined,
    is_public: Boolean(data.is_public),
    royalty_percentage: typeof data.royalty_percentage === 'number' ? data.royalty_percentage : undefined,
    view_count: typeof data.view_count === 'number' ? data.view_count : 0,
    favorite_count: typeof data.favorite_count === 'number' ? data.favorite_count : 0,
    visibility: data.visibility || 'private',
    created_at: data.created_at || new Date().toISOString(),
    updated_at: data.updated_at || new Date().toISOString(),
    creator: data.creator ? {
      id: data.creator.id || data.creator_id || '',
      username: data.creator.username || 'Unknown Creator',
      avatar_url: data.creator.avatar_url || null
    } : undefined,
    set: data.set ? {
      id: data.set.id || '',
      name: data.set.name || 'Unknown Set'
    } : undefined,
    is_favorited: Boolean(data.is_favorited)
  } as CardType;
};
