
import type { Card as CardType } from '@/types/card';

export interface RecommendationSection {
  title: string;
  description: string;
  icon: any;
  badge: string;
  cards: CardType[];
}
