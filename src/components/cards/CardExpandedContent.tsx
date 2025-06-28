
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import RarityBadge from './RarityBadge';
import CardStats from './CardStats';
import type { CardExpandedContentProps } from './types/cardInfoDrawer';

const CardExpandedContent = ({ card, showExpanded }: CardExpandedContentProps) => {
  return (
    <div className={cn(
      'overflow-hidden',
      'transition-all duration-[1400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]',
      showExpanded 
        ? 'max-h-96 opacity-100 mt-4' 
        : 'max-h-0 opacity-0 mt-0'
    )}>
      <div className="space-y-3">
        {/* Description with slow fade-in delay */}
        {card.description && (
          <p className={cn(
            'text-xs opacity-80 line-clamp-2',
            'transition-all duration-[1200ms] ease-out',
            showExpanded 
              ? 'opacity-90 transform translate-y-0 delay-[400ms]' 
              : 'opacity-0 transform translate-y-2'
          )}>
            {card.description}
          </p>
        )}

        {/* Rarity and Serial with longer staggered entrance */}
        <div className={cn(
          'flex items-center justify-between',
          'transition-all duration-[1200ms] ease-out',
          showExpanded 
            ? 'opacity-100 transform translate-y-0 delay-[700ms]' 
            : 'opacity-0 transform translate-y-3'
        )}>
          {card.rarity && (
            <div className={cn(
              'transition-transform duration-[800ms] ease-out',
              showExpanded ? 'scale-105 hover:scale-110' : ''
            )}>
              <RarityBadge rarity={card.rarity} size="sm" />
            </div>
          )}
          {card.serial_number && (
            <Badge 
              variant="outline" 
              className={cn(
                'text-xs transition-all duration-[800ms] ease-out',
                showExpanded ? 'bg-white/10 border-white/30 shadow-lg' : ''
              )}
            >
              #{card.serial_number}
            </Badge>
          )}
        </div>

        {/* Stats with even longer delayed entrance */}
        {(card.power !== undefined || card.toughness !== undefined) && (
          <div className={cn(
            'transition-all duration-[1200ms] ease-out',
            showExpanded 
              ? 'opacity-100 transform translate-y-0 delay-[1000ms]' 
              : 'opacity-0 transform translate-y-4'
          )}>
            <CardStats 
              stats={{
                power: card.power,
                toughness: card.toughness,
                mana_cost: card.mana_cost,
                abilities: card.abilities
              }} 
              compact 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CardExpandedContent;
