
export interface CardInfoDrawerProps {
  card: any;
  isHovered: boolean;
  isPinned: boolean;
  animationPhase: 'idle' | 'lifting' | 'expanding';
  drawerStyle: string;
  size: 'sm' | 'md' | 'lg';
}

export interface CardBasicInfoProps {
  card: any;
  showExpanded: boolean;
  size: 'sm' | 'md' | 'lg';
}

export interface CardExpandedContentProps {
  card: any;
  showExpanded: boolean;
}

export interface CardEngagementStatsProps {
  card: any;
  showExpanded: boolean;
  onFavoriteToggle: () => void;
  toggleFavorite: any;
}

export const DRAWER_STYLES = {
  default: 'bg-black/90 backdrop-blur-xl text-white',
  holographic: 'bg-gradient-to-b from-purple-900/90 to-pink-900/90 backdrop-blur-xl text-white',
  cyberpunk: 'bg-black/95 backdrop-blur-xl text-cyan-400 border-t border-cyan-500/50',
  minimalist: 'bg-white/95 backdrop-blur-xl text-gray-900 border-t border-gray-200',
  brutalist: 'bg-red-900/90 backdrop-blur-xl text-white border-t-4 border-red-500',
  vaporwave: 'bg-gradient-to-b from-pink-900/90 to-purple-900/90 backdrop-blur-xl text-pink-200'
} as const;

export const SIZE_CLASSES = {
  sm: 'px-3 py-2 text-xs',
  md: 'px-4 py-3 text-sm',
  lg: 'px-5 py-4 text-base'
} as const;
