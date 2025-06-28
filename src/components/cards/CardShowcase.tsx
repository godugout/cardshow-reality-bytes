
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';
import EnhancedCRDCard from './EnhancedCRDCard';
import { cardStyleVariations } from './cardStyleVariations';
import type { Card as CardType } from '@/types/card';

interface CardShowcaseProps {
  cards: CardType[];
}

const CardShowcase = ({ cards }: CardShowcaseProps) => {
  // Display up to 10 cards with different styles
  const displayCards = cards.slice(0, 10);

  return (
    <div className="mb-12">
      <div className="text-center mb-8">
        <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
          <Sparkles className="w-3 h-3 mr-1" />
          Enhanced CRD Style Showcase
        </Badge>
        <h2 className="text-3xl font-bold text-foreground mb-2">Interactive Card Variations</h2>
        <p className="text-muted-foreground">
          Hover over cards to see the interactive drawer system - Each card maintains 2.5:3.5 aspect ratio
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-8 items-start">
        {displayCards.map((card, index) => {
          const styleVariant = cardStyleVariations[index % cardStyleVariations.length];

          return (
            <div key={card.id} className="space-y-3 flex flex-col items-center">
              {/* Style Label */}
              <Badge variant="outline" className="text-xs font-medium">
                {styleVariant.name}
              </Badge>

              {/* Enhanced CRD Card */}
              <EnhancedCRDCard
                card={card}
                size="md"
                styleVariant={styleVariant}
              />
            </div>
          );
        })}
      </div>

      {/* Usage Instructions */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full text-sm text-muted-foreground">
          <Sparkles className="w-4 h-4" />
          Hover over cards to see the interactive drawer animation
        </div>
      </div>
    </div>
  );
};

export default CardShowcase;
