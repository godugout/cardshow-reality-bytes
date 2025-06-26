
import type { ThemeCard } from '../cardThemesData';

export const spaceExplorationCards: ThemeCard[] = [
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
];
