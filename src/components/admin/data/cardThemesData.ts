export interface ThemeCard {
  title: string;
  description: string;
  image_url: string;
  rarity: string;
  card_type: string;
  power: number;
  toughness: number;
  abilities: string[];
  serial_number?: number; // Make this optional
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
      },
      {
        title: 'Flame Wizard',
        description: 'Master of fire magic, casting devastating spells.',
        image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176',
        rarity: 'rare',
        card_type: 'character',
        power: 4,
        toughness: 4,
        abilities: ['Spell Power', 'Fire Magic']
      },
      {
        title: 'Crystal Golem',
        description: 'Ancient construct powered by magical crystals.',
        image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
        rarity: 'uncommon',
        card_type: 'creature',
        power: 7,
        toughness: 8,
        abilities: ['Construct', 'Magic Immunity']
      },
      {
        title: 'Elven Archer',
        description: 'Skilled marksman with unmatched precision.',
        image_url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e',
        rarity: 'common',
        card_type: 'character',
        power: 3,
        toughness: 2,
        abilities: ['Ranged Attack', 'Precision']
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
      },
      {
        title: 'Plasma Cannon',
        description: 'High-energy weapon that obliterates targets.',
        image_url: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2',
        rarity: 'rare',
        card_type: 'artifact',
        power: 0,
        toughness: 3,
        abilities: ['Energy Weapon', 'Overcharge']
      },
      {
        title: 'Holographic Projector',
        description: 'Creates realistic illusions and diversions.',
        image_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
        rarity: 'uncommon',
        card_type: 'artifact',
        power: 0,
        toughness: 2,
        abilities: ['Illusion', 'Stealth Field']
      },
      {
        title: 'Space Marine',
        description: 'Elite soldier equipped with advanced power armor.',
        image_url: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06',
        rarity: 'common',
        card_type: 'character',
        power: 5,
        toughness: 5,
        abilities: ['Armor', 'Combat Training']
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
      },
      {
        title: 'Desert Scorpion',
        description: 'Venomous predator adapted to harsh environments.',
        image_url: 'https://images.unsplash.com/photo-1582650625119-3a31f8fa2699',
        rarity: 'common',
        card_type: 'creature',
        power: 3,
        toughness: 2,
        abilities: ['Poison', 'Desert Adaptation']
      },
      {
        title: 'Giant Redwood',
        description: 'Ancient tree with deep roots and towering presence.',
        image_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
        rarity: 'uncommon',
        card_type: 'creature',
        power: 1,
        toughness: 9,
        abilities: ['Rooted', 'Ancient Wisdom']
      },
      {
        title: 'Arctic Fox',
        description: 'Clever and agile survivor of the frozen wilderness.',
        image_url: 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1',
        rarity: 'common',
        card_type: 'creature',
        power: 2,
        toughness: 3,
        abilities: ['Camouflage', 'Cold Immunity']
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
      },
      {
        title: 'Neon District',
        description: 'Vibrant nightlife hub pulsing with energy.',
        image_url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f',
        rarity: 'uncommon',
        card_type: 'artifact',
        power: 0,
        toughness: 3,
        abilities: ['Energy Source', 'Night Vision']
      },
      {
        title: 'Underground Metro',
        description: 'Complex transportation network beneath the city.',
        image_url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000',
        rarity: 'common',
        card_type: 'artifact',
        power: 0,
        toughness: 5,
        abilities: ['Transport', 'Underground']
      }
    ]
  },
  'Sports & Athletics': {
    cards: [
      {
        title: 'Championship Stadium',
        description: 'Iconic venue where legends are made.',
        image_url: 'https://images.unsplash.com/photo-1471295253337-3ceaaedca402',
        rarity: 'epic',
        card_type: 'artifact',
        power: 0,
        toughness: 8,
        abilities: ['Home Field Advantage', 'Crowd Boost']
      },
      {
        title: 'Elite Quarterback',
        description: 'Master of the field with perfect precision.',
        image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
        rarity: 'legendary',
        card_type: 'athlete',
        power: 7,
        toughness: 5,
        abilities: ['Leadership', 'Precision Passing']
      },
      {
        title: 'Speed Runner',
        description: 'Lightning-fast athlete who breaks records.',
        image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
        rarity: 'rare',
        card_type: 'athlete',
        power: 6,
        toughness: 4,
        abilities: ['Speed Burst', 'Endurance']
      },
      {
        title: 'Power Lifter',
        description: 'Incredible strength and determination.',
        image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48',
        rarity: 'uncommon',
        card_type: 'athlete',
        power: 8,
        toughness: 6,
        abilities: ['Strength', 'Focus']
      },
      {
        title: 'Swimming Champion',
        description: 'Dominates the pool with flawless technique.',
        image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5',
        rarity: 'rare',
        card_type: 'athlete',
        power: 5,
        toughness: 7,
        abilities: ['Aquatic Mastery', 'Technique']
      }
    ]
  },
  'Ancient Civilizations': {
    cards: [
      {
        title: 'Pharaoh\'s Scepter',
        description: 'Golden rod of divine authority from ancient Egypt.',
        image_url: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73826',
        rarity: 'mythic',
        card_type: 'artifact',
        power: 0,
        toughness: 5,
        abilities: ['Divine Authority', 'Ancient Power']
      },
      {
        title: 'Roman Centurion',
        description: 'Elite soldier of the mighty Roman legions.',
        image_url: 'https://images.unsplash.com/photo-1553028826-f4804151e2bb',
        rarity: 'rare',
        card_type: 'character',
        power: 6,
        toughness: 5,
        abilities: ['Formation Fighting', 'Discipline']
      },
      {
        title: 'Mayan Calendar Stone',
        description: 'Mystical artifact that predicts the future.',
        image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176',
        rarity: 'legendary',
        card_type: 'artifact',
        power: 0,
        toughness: 7,
        abilities: ['Prophecy', 'Time Manipulation']
      },
      {
        title: 'Greek Philosopher',
        description: 'Wise scholar seeking truth and knowledge.',
        image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
        rarity: 'uncommon',
        card_type: 'character',
        power: 2,
        toughness: 4,
        abilities: ['Wisdom', 'Teaching']
      },
      {
        title: 'Viking Longship',
        description: 'Swift vessel that conquered the northern seas.',
        image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
        rarity: 'rare',
        card_type: 'vehicle',
        power: 4,
        toughness: 6,
        abilities: ['Navigation', 'Sea Worthy']
      }
    ]
  },
  'Space Exploration': {
    cards: [
      {
        title: 'Interstellar Mothership',
        description: 'Massive vessel capable of galactic travel.',
        image_url: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06',
        rarity: 'mythic',
        card_type: 'vehicle',
        power: 9,
        toughness: 10,
        abilities: ['Warp Drive', 'Command Center']
      },
      {
        title: 'Asteroid Miner',
        description: 'Specialized craft for extracting space resources.',
        image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
        rarity: 'uncommon',
        card_type: 'vehicle',
        power: 3,
        toughness: 5,
        abilities: ['Resource Extraction', 'Deep Space']
      },
      {
        title: 'Cosmic Explorer',
        description: 'Brave astronaut venturing into the unknown.',
        image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
        rarity: 'rare',
        card_type: 'character',
        power: 4,
        toughness: 6,
        abilities: ['Space Suit', 'Exploration']
      },
      {
        title: 'Alien Artifact',
        description: 'Mysterious object of unknown origin and power.',
        image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
        rarity: 'legendary',
        card_type: 'artifact',
        power: 0,
        toughness: 8,
        abilities: ['Unknown Power', 'Alien Technology']
      },
      {
        title: 'Plasma Thruster',
        description: 'Advanced propulsion system for space travel.',
        image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e',
        rarity: 'common',
        card_type: 'artifact',
        power: 0,
        toughness: 3,
        abilities: ['Propulsion', 'Efficiency']
      }
    ]
  },
  'Magical Artifacts': {
    cards: [
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
    ]
  },
  'Underwater Realms': {
    cards: [
      {
        title: 'Coral Palace',
        description: 'Magnificent underwater castle made of living coral.',
        image_url: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7',
        rarity: 'epic',
        card_type: 'artifact',
        power: 0,
        toughness: 9,
        abilities: ['Underwater Fortress', 'Living Structure']
      },
      {
        title: 'Kraken Guardian',
        description: 'Massive sea creature protecting ancient treasures.',
        image_url: 'https://images.unsplash.com/photo-1518877593221-1f28583780b4',
        rarity: 'legendary',
        card_type: 'creature',
        power: 10,
        toughness: 8,
        abilities: ['Tentacles', 'Deep Sea', 'Guardian']
      },
      {
        title: 'Mermaid Sage',
        description: 'Wise keeper of oceanic knowledge and magic.',
        image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19',
        rarity: 'rare',
        card_type: 'character',
        power: 3,
        toughness: 5,
        abilities: ['Water Magic', 'Ancient Wisdom']
      },
      {
        title: 'Sunken Treasure',
        description: 'Lost riches from ships of old.',
        image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
        rarity: 'uncommon',
        card_type: 'artifact',
        power: 0,
        toughness: 3,
        abilities: ['Wealth', 'Historical Value']
      },
      {
        title: 'Electric Eel',
        description: 'Shocking predator of the deep waters.',
        image_url: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7',
        rarity: 'common',
        card_type: 'creature',
        power: 4,
        toughness: 2,
        abilities: ['Electric Shock', 'Aquatic']
      }
    ]
  }
};
