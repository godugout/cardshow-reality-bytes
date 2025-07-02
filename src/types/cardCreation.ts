export type CreationStep = 
  | 'templates' 
  | 'upload' 
  | 'details' 
  | 'effects' 
  | 'preview' 
  | 'publish';

export interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  preview_url: string;
  is_premium: boolean;
  price: number;
  tags: string[];
}

export interface CardCreationState {
  currentStep: CreationStep;
  selectedTemplate: Template | null;
  images: {
    main?: File;
    background?: File;
    overlay?: File;
  };
  cardDetails: {
    title: string;
    description: string;
    rarity: string;
    cardType: string;
  };
  visualEffects: {
    holographic: boolean;
    foil: boolean;
    chrome: boolean;
    rainbow: boolean;
    intensity: number;
    glowColor: string;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
  };
  textStyles: {
    titleFont: string;
    titleSize: number;
    descriptionFont: string;
    descriptionSize: number;
  };
  isPublic: boolean;
  enableComments: boolean;
  enableTrades: boolean;
  price?: number;
}

export const defaultCreationState: CardCreationState = {
  currentStep: 'templates',
  selectedTemplate: null,
  images: {},
  cardDetails: {
    title: '',
    description: '',
    rarity: 'common',
    cardType: 'character',
  },
  visualEffects: {
    holographic: false,
    foil: false,
    chrome: false,
    rainbow: false,
    intensity: 0.5,
    glowColor: '#00C851',
  },
  colors: {
    primary: '#00C851',
    secondary: '#1a1a1a',
    accent: '#ffffff',
    text: '#ffffff',
  },
  textStyles: {
    titleFont: 'Inter',
    titleSize: 24,
    descriptionFont: 'Inter',
    descriptionSize: 14,
  },
  isPublic: true,
  enableComments: true,
  enableTrades: true,
};

export const CARD_RARITIES = [
  { value: 'common', label: 'Common', color: '#94a3b8' },
  { value: 'uncommon', label: 'Uncommon', color: '#10b981' },
  { value: 'rare', label: 'Rare', color: '#3b82f6' },
  { value: 'epic', label: 'Epic', color: '#8b5cf6' },
  { value: 'legendary', label: 'Legendary', color: '#f59e0b' },
  { value: 'mythic', label: 'Mythic', color: '#ef4444' },
];

export const CARD_TYPES = [
  { value: 'character', label: 'Character' },
  { value: 'creature', label: 'Creature' },
  { value: 'spell', label: 'Spell' },
  { value: 'artifact', label: 'Artifact' },
  { value: 'vehicle', label: 'Vehicle' },
  { value: 'athlete', label: 'Athlete' },
];

export const TEMPLATE_CATEGORIES = [
  { value: 'sports', label: 'Sports', icon: '⚽' },
  { value: 'fantasy', label: 'Fantasy', icon: '🗡️' },
  { value: 'sci-fi', label: 'Sci-Fi', icon: '🚀' },
  { value: 'gaming', label: 'Gaming', icon: '🎮' },
  { value: 'art', label: 'Art', icon: '🎨' },
  { value: 'anime', label: 'Anime', icon: '🎭' },
  { value: 'nature', label: 'Nature', icon: '🌿' },
  { value: 'abstract', label: 'Abstract', icon: '✨' },
];