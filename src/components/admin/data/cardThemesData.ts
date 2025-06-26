
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

// Import theme cards from separate files
import { fantasyWarriorsCards } from './themes/fantasyWarriors';
import { sciFiTechnologyCards } from './themes/sciFiTechnology';
import { wildlifeNatureCards } from './themes/wildlifeNature';
import { urbanArchitectureCards } from './themes/urbanArchitecture';
import { sportsAthleticsCards } from './themes/sportsAthletics';
import { ancientCivilizationsCards } from './themes/ancientCivilizations';
import { spaceExplorationCards } from './themes/spaceExploration';
import { magicalArtifactsCards } from './themes/magicalArtifacts';
import { underwaterRealmsCards } from './themes/underwaterRealms';

export const cardThemes: Record<string, CardTheme> = {
  'Fantasy Warriors': {
    cards: fantasyWarriorsCards
  },
  'Sci-Fi Technology': {
    cards: sciFiTechnologyCards
  },
  'Wildlife & Nature': {
    cards: wildlifeNatureCards
  },
  'Urban Architecture': {
    cards: urbanArchitectureCards
  },
  'Sports & Athletics': {
    cards: sportsAthleticsCards
  },
  'Ancient Civilizations': {
    cards: ancientCivilizationsCards
  },
  'Space Exploration': {
    cards: spaceExplorationCards
  },
  'Magical Artifacts': {
    cards: magicalArtifactsCards
  },
  'Underwater Realms': {
    cards: underwaterRealmsCards
  }
};
