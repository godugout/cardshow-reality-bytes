
import { Heart, Eye, DollarSign, User, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useCardFavorites } from '@/hooks/useCards';
import RarityBadge from './RarityBadge';
import CardStats from './CardStats';
import type { Card } from '@/types/card';

interface CardInfoDrawerProps {
  card: Card;
  isHovered: boolean;
  isPinned: boolean;
  animationPhase: 'idle' | 'lifting' | 'expanding';
  drawerStyle: string;
  size: 'sm' | 'md' | 'lg';
}

const CardInfoDrawer = ({ 
  card, 
  isHovered, 
  isPinned, 
  animationPhase, 
  drawerStyle,
  size 
}: CardInfoDrawerProps) => {
  const { toggleFavorite } = useCardFavorites();
  const showExpanded = isHovered || isPinned;

  const formatPrice = (price?: number) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleFavoriteToggle = () => {
    toggleFavorite.mutate({
      cardId: card.id,
      isFavorited: card.is_favorited || false
    });
  };

  // Size-specific spacing
  const sizeClasses = {
    sm: 'px-3 py-2 text-xs',
    md: 'px-4 py-3 text-sm',
    lg: 'px-5 py-4 text-base'
  };

  const drawerStyles = {
    default: 'bg-black/90 backdrop-blur-xl text-white',
    holographic: 'bg-gradient-to-b from-purple-900/90 to-pink-900/90 backdrop-blur-xl text-white',
    cyberpunk: 'bg-black/95 backdrop-blur-xl text-cyan-400 border-t border-cyan-500/50',
    minimalist: 'bg-white/95 backdrop-blur-xl text-gray-900 border-t border-gray-200',
    brutalist: 'bg-red-900/90 backdrop-blur-xl text-white border-t-4 border-red-500',
    vaporwave: 'bg-gradient-to-b from-pink-900/90 to-purple-900/90 backdrop-blur-xl text-pink-200'
  };

  return (
    <div 
      className={cn(
        'absolute bottom-0 left-0 right-0 z-20 rounded-b-3xl transform overflow-hidden',
        'transition-all duration-[1200ms] ease-[cubic-bezier(0.23,1,0.32,1)]',
        sizeClasses[size],
        drawerStyles[drawerStyle as keyof typeof drawerStyles] || drawerStyles.default,
        // Ultra smooth backdrop animation - much slower
        showExpanded 
          ? 'backdrop-blur-3xl bg-opacity-98' 
          : 'backdrop-blur-xl bg-opacity-90'
      )}
      style={{
        background: showExpanded 
          ? `linear-gradient(135deg, 
              rgba(0,0,0,0.98) 0%, 
              rgba(30,30,30,0.95) 50%, 
              rgba(0,0,0,0.98) 100%)`
          : undefined,
        transition: 'all 1.2s cubic-bezier(0.23, 1, 0.32, 1), background 1.4s ease-out'
      }}
    >
      {/* Always visible basic info with ultra slow entrance animation */}
      <div className={cn(
        'space-y-1 transition-all duration-[1000ms] ease-out',
        showExpanded ? 'transform -translate-y-1' : 'transform translate-y-0'
      )}>
        <h3 
          className={cn(
            'font-bold truncate transition-all duration-[1200ms] ease-out',
            showExpanded ? 'text-shadow-lg' : ''
          )} 
          title={card.title}
        >
          {card.title}
        </h3>
        
        <div className="flex items-center justify-between">
          {card.creator && (
            <div className={cn(
              'flex items-center gap-1 opacity-80 transition-all duration-[1000ms] ease-out',
              showExpanded ? 'opacity-90 text-shadow' : ''
            )}>
              <User className={cn(
                'w-3 h-3 transition-transform duration-[800ms] ease-out',
                showExpanded ? 'scale-110' : ''
              )} />
              <span className="text-xs truncate">{card.creator.username}</span>
            </div>
          )}
          
          {card.current_market_value && (
            <div className={cn(
              'flex items-center gap-1 font-semibold text-green-400',
              'transition-all duration-[1000ms] ease-out',
              showExpanded ? 'text-green-300 drop-shadow-lg scale-105' : ''
            )}>
              <DollarSign className={cn(
                'w-3 h-3 transition-transform duration-[800ms] ease-out',
                showExpanded ? 'scale-110 rotate-12' : ''
              )} />
              <span>{formatPrice(card.current_market_value)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Expanded content with much slower staggered animations */}
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

          {/* Engagement Stats with final ultra-slow staggered entrance */}
          <div className={cn(
            'flex items-center justify-between text-xs opacity-70',
            'transition-all duration-[1400ms] ease-out',
            showExpanded 
              ? 'opacity-80 transform translate-y-0 delay-[1300ms]' 
              : 'opacity-0 transform translate-y-5'
          )}>
            <div className="flex items-center gap-3">
              {card.view_count !== undefined && (
                <div className={cn(
                  'flex items-center gap-1 transition-all duration-[600ms] ease-out',
                  showExpanded ? 'hover:text-blue-300 hover:scale-105' : ''
                )}>
                  <Eye className={cn(
                    'w-3 h-3 transition-transform duration-[600ms] ease-out',
                    showExpanded ? 'hover:scale-125' : ''
                  )} />
                  <span>{card.view_count}</span>
                </div>
              )}
              
              {card.favorite_count !== undefined && card.favorite_count > 0 && (
                <div className={cn(
                  'flex items-center gap-1 transition-all duration-[600ms] ease-out',
                  showExpanded ? 'hover:text-red-300 hover:scale-105' : ''
                )}>
                  <Heart className={cn(
                    'w-3 h-3 transition-transform duration-[600ms] ease-out',
                    showExpanded ? 'hover:scale-125' : ''
                  )} />
                  <span>{card.favorite_count}</span>
                </div>
              )}
            </div>

            {/* Action Button with premium ultra-slow hover effects */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFavoriteToggle}
              className={cn(
                'p-1 h-auto transition-all duration-[800ms] ease-out',
                'hover:bg-white/20 hover:backdrop-blur-md hover:scale-110',
                showExpanded ? 'opacity-100 delay-[1500ms]' : 'opacity-0'
              )}
            >
              <Heart 
                className={cn(
                  'w-4 h-4 transition-all duration-[600ms] ease-out',
                  'hover:scale-125 hover:rotate-12',
                  card.is_favorited 
                    ? 'fill-red-500 text-red-500 hover:fill-red-400 hover:text-red-400' 
                    : 'hover:text-red-400'
                )}
              />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardInfoDrawer;
