
export interface ThemeCard {
  title: string;
  description: string;
  image_url: string;
  rarity: string;
  card_type: string;
  power: number;
  toughness: number;
  abilities: string[];
}

export interface CardTheme {
  cards: ThemeCard[];
}

export const cardThemes: Record<string, CardTheme> = {
  'Fantasy Warriors': {
    cards: [
      {
        title: 'Dragon Knight Commander',
        description: 'A legendary warrior who commands the ancient dragons of the realm.',
        image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
        rarity: 'legendary',
        card_type: 'character',
        power: 8,
        toughness: 6,
        abilities: ['Flying', 'Dragon Bond', 'Leadership']
      },
      {
        title: 'Mystic Forest Guardian',
        description: 'Protector of the enchanted woods, wielding nature\'s power.',
        image_url: 'https://images.unsplash.com/photo-1441057206919-63d19fac2369',
        rarity: 'rare',
        card_type: 'creature',
        power: 5,
        toughness: 7,
        abilities: ['Regenerate', 'Forest Walk']
      },
      {
        title: 'Shadow Assassin',
        description: 'Swift and deadly, striking from the darkness.',
        image_url: 'https://images.unsplash.com/photo-1485833077593-4278bba3f11f',
        rarity: 'uncommon',
        card_type: 'character',
        power: 6,
        toughness: 3,
        abilities: ['Stealth', 'First Strike']
      }
    ]
  },
  'Sci-Fi Technology': {
    cards: [
      {
        title: 'Quantum Processing Core',
        description: 'Advanced computing system capable of infinite calculations.',
        image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
        rarity: 'mythic',
        card_type: 'artifact',
        power: 0,
        toughness: 8,
        abilities: ['Quantum Computing', 'Reality Shift']
      },
      {
        title: 'Cybernetic Enhancement',
        description: 'Biotech upgrade that enhances human capabilities.',
        image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e',
        rarity: 'rare',
        card_type: 'artifact',
        power: 0,
        toughness: 0,
        abilities: ['Enhancement', 'Tech Boost']
      },
      {
        title: 'Neural Interface Pilot',
        description: 'Human pilot enhanced with direct machine interface.',
        image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
        rarity: 'epic',
        card_type: 'character',
        power: 4,
        toughness: 4,
        abilities: ['Tech Interface', 'Pilot']
      }
    ]
  },
  'Wildlife & Nature': {
    cards: [
      {
        title: 'Majestic Mountain Eagle',
        description: 'Soaring high above the peaks, master of the skies.',
        image_url: 'https://images.unsplash.com/photo-1472396961693-142e6e269027',
        rarity: 'rare',
        card_type: 'creature',
        power: 4,
        toughness: 3,
        abilities: ['Flying', 'Keen Sight']
      },
      {
        title: 'Forest Pack Alpha',
        description: 'Leader of the wilderness pack, fierce and loyal.',
        image_url: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742',
        rarity: 'uncommon',
        card_type: 'creature',
        power: 5,
        toughness: 4,
        abilities: ['Pack Leader', 'Howl']
      },
      {
        title: 'Ocean Depths Leviathan',
        description: 'Ancient creature from the deepest ocean trenches.',
        image_url: 'https://images.unsplash.com/photo-1518877593221-1f28583780b4',
        rarity: 'legendary',
        card_type: 'creature',
        power: 9,
        toughness: 8,
        abilities: ['Aquatic', 'Tsunami', 'Ancient']
      }
    ]
  },
  'Urban Architecture': {
    cards: [
      {
        title: 'Skyscraper Fortress',
        description: 'Towering structure that dominates the city skyline.',
        image_url: 'https://images.unsplash.com/photo-1527576539890-dfa815648363',
        rarity: 'rare',
        card_type: 'artifact',
        power: 0,
        toughness: 12,
        abilities: ['Fortress', 'Urban Defense']
      },
      {
        title: 'Glass Cathedral',
        description: 'Modern architectural marvel of glass and steel.',
        image_url: 'https://images.unsplash.com/photo-1497604401993-f2e922e5cb0a',
        rarity: 'epic',
        card_type: 'artifact',
        power: 0,
        toughness: 6,
        abilities: ['Inspire', 'Light Refraction']
      },
      {
        title: 'Bridge of Connections',
        description: 'Spanning great distances, connecting worlds.',
        image_url: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716',
        rarity: 'uncommon',
        card_type: 'artifact',
        power: 0,
        toughness: 4,
        abilities: ['Bridge', 'Path Finding']
      }
    ]
  }
};
