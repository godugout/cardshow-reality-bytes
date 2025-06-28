
import type { CardStyleVariant } from './EnhancedCRDCard';

export const cardStyleVariations: CardStyleVariant[] = [
  {
    name: 'Holographic Premium',
    containerClasses: 'bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20 backdrop-blur-xl border border-white/20 shadow-2xl',
    imageClasses: 'relative',
    drawerStyle: 'holographic',
    overlayClasses: 'bg-gradient-to-r from-purple-500/10 via-transparent to-pink-500/10 animate-pulse'
  },
  {
    name: 'Minimalist Clean',
    containerClasses: 'bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-lg',
    imageClasses: 'rounded-3xl',
    drawerStyle: 'minimalist'
  },
  {
    name: 'Cyberpunk Neon',
    containerClasses: 'bg-black/90 backdrop-blur-xl border border-cyan-500/50 shadow-2xl shadow-cyan-500/20',
    imageClasses: 'relative',
    drawerStyle: 'cyberpunk',
    overlayClasses: 'bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent animate-pulse'
  },
  {
    name: 'Classic Trading Card',
    containerClasses: 'bg-gradient-to-b from-yellow-50 to-yellow-100 border-4 border-yellow-600 shadow-xl',
    imageClasses: 'rounded-lg',
    drawerStyle: 'default'
  },
  {
    name: 'Modern Glassmorphism',
    containerClasses: 'bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl',
    imageClasses: 'rounded-2xl',
    drawerStyle: 'default',
    overlayClasses: 'bg-gradient-to-br from-white/10 to-transparent'
  },
  {
    name: 'Neo-Brutalist',
    containerClasses: 'bg-red-500 border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform rotate-1',
    imageClasses: 'contrast-125 saturate-150',
    drawerStyle: 'brutalist'
  },
  {
    name: 'Vaporwave Aesthetic',
    containerClasses: 'bg-gradient-to-br from-pink-500/30 to-purple-600/30 backdrop-blur-xl border border-pink-400/50 shadow-2xl shadow-pink-500/20',
    imageClasses: 'sepia-[0.3] hue-rotate-[280deg] saturate-150',
    drawerStyle: 'vaporwave',
    overlayClasses: 'bg-[linear-gradient(90deg,transparent_50%,rgba(255,0,255,0.1)_50%)] bg-[length:20px_20px] animate-pulse'
  },
  {
    name: 'Art Deco Luxury',
    containerClasses: 'bg-gradient-to-b from-amber-100 to-amber-200 border-4 border-amber-600 shadow-xl',
    imageClasses: 'sepia-[0.2] contrast-110',
    drawerStyle: 'default',
    overlayClasses: 'bg-[radial-gradient(circle_at_center,rgba(217,119,6,0.1)_0%,transparent_70%)]'
  },
  {
    name: 'Synthwave Neon',
    containerClasses: 'bg-black border-2 border-pink-500 shadow-2xl shadow-pink-500/50',
    imageClasses: 'hue-rotate-[300deg] saturate-150 contrast-125',
    drawerStyle: 'vaporwave',
    overlayClasses: 'bg-gradient-to-b from-pink-500/20 via-transparent to-cyan-500/20'
  },
  {
    name: 'Ethereal Fantasy',
    containerClasses: 'bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-pink-900/30 backdrop-blur-xl border border-indigo-400/30 shadow-xl',
    imageClasses: 'brightness-110 contrast-105',
    drawerStyle: 'holographic',
    overlayClasses: 'bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.1)_0%,transparent_70%)]'
  },
  {
    name: 'Retro Arcade',
    containerClasses: 'bg-gradient-to-b from-lime-400 to-green-500 border-4 border-lime-600 shadow-lg',
    imageClasses: 'pixelated contrast-125 saturate-150',
    drawerStyle: 'default',
    overlayClasses: 'bg-[linear-gradient(45deg,rgba(0,255,0,0.1)_25%,transparent_25%,transparent_75%,rgba(0,255,0,0.1)_75%)] bg-[length:8px_8px]'
  },
  {
    name: 'Steampunk Bronze',
    containerClasses: 'bg-gradient-to-br from-amber-800/40 to-orange-900/40 backdrop-blur-sm border-2 border-amber-600/60 shadow-2xl',
    imageClasses: 'sepia-[0.4] hue-rotate-[30deg] contrast-110',
    drawerStyle: 'default',
    overlayClasses: 'bg-[radial-gradient(circle_at_30%_70%,rgba(251,146,60,0.15)_0%,transparent_50%)]'
  }
];
