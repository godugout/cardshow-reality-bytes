
import type { ThemeCard } from '../cardThemesData';

export const magicalArtifactsCards: ThemeCard[] = [
  {
    title: 'Crystal of Eternal Light',
    description: 'Radiant gem that banishes all darkness.',
    image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
    rarity: 'mythic',
    card_type: 'artifact',
    power: 0,
    toughness: 6,
    abilities: ['Light Magic', 'Darkness Banishment']
  },
  {
    title: 'Tome of Ancient Spells',
    description: 'Leather-bound book containing forgotten magic.',
    image_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570',
    rarity: 'legendary',
    card_type: 'artifact',
    power: 0,
    toughness: 4,
    abilities: ['Spell Library', 'Ancient Knowledge']
  },
  {
    title: 'Enchanted Sword',
    description: 'Blade forged with powerful enchantments.',
    image_url: 'https://images.unsplash.com/photo-1485833077593-4278bba3f11f',
    rarity: 'rare',
    card_type: 'artifact',
    power: 0,
    toughness: 5,
    abilities: ['Weapon Enhancement', 'Magic Weapon']
  },
  {
    title: 'Cloak of Invisibility',
    description: 'Mystical garment that conceals the wearer.',
    image_url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e',
    rarity: 'epic',
    card_type: 'artifact',
    power: 0,
    toughness: 2,
    abilities: ['Invisibility', 'Stealth']
  },
  {
    title: 'Healing Potion',
    description: 'Magical elixir that restores health instantly.',
    image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176',
    rarity: 'common',
    card_type: 'artifact',
    power: 0,
    toughness: 1,
    abilities: ['Healing', 'Restoration']
  }
];
