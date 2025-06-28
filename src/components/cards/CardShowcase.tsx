
import { useState } from 'react';
import { Heart, Eye, DollarSign, User, Sparkles, Zap, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useCardFavorites } from '@/hooks/useCards';
import RarityBadge from './RarityBadge';
import Card3DToggle from './Card3DToggle';
import Card3DViewerPremium from './Card3DViewerPremium';
import type { Card as CardType } from '@/types/card';

interface CardShowcaseProps {
  cards: CardType[];
}

const CardShowcase = ({ cards }: CardShowcaseProps) => {
  const { user } = useAuth();
  const { toggleFavorite } = useCardFavorites();
  const [imageLoaded, setImageLoaded] = useState<Record<string, boolean>>({});
  const [is3D, setIs3D] = useState<Record<string, boolean>>({});

  const handleFavoriteToggle = (card: CardType) => {
    if (!user) return;
    toggleFavorite.mutate({
      cardId: card.id,
      isFavorited: card.is_favorited || false
    });
  };

  const formatPrice = (price?: number) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const cardStyles = [
    // Style 1: Holographic Premium
    {
      name: 'Holographic Premium',
      containerClass: 'w-80 h-96 relative overflow-hidden bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl hover:scale-105 transition-all duration-500',
      imageClass: 'w-full h-56 object-cover relative',
      contentClass: 'p-6 space-y-4',
      titleClass: 'text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent',
      specialEffect: 'before:absolute before:inset-0 before:bg-gradient-to-r before:from-purple-500/10 before:via-transparent before:to-pink-500/10 before:animate-pulse'
    },
    // Style 2: Minimalist Clean
    {
      name: 'Minimalist Clean',
      containerClass: 'w-72 h-80 bg-white/95 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300',
      imageClass: 'w-full h-48 object-cover rounded-t-2xl',
      contentClass: 'p-4 space-y-2',
      titleClass: 'text-lg font-semibold text-gray-900',
      specialEffect: ''
    },
    // Style 3: Cyberpunk Neon
    {
      name: 'Cyberpunk Neon',
      containerClass: 'w-80 h-96 bg-black/90 backdrop-blur-xl border border-cyan-500/50 rounded-lg shadow-2xl shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-300',
      imageClass: 'w-full h-56 object-cover relative',
      contentClass: 'p-6 space-y-4',
      titleClass: 'text-xl font-bold text-cyan-400 font-mono',
      specialEffect: 'before:absolute before:inset-0 before:bg-gradient-to-b before:from-transparent before:via-cyan-500/5 before:to-transparent before:animate-pulse'
    },
    // Style 4: Classic Trading Card
    {
      name: 'Classic Trading Card',
      containerClass: 'w-64 h-88 bg-gradient-to-b from-yellow-50 to-yellow-100 border-4 border-yellow-600 rounded-xl shadow-xl relative',
      imageClass: 'w-full h-48 object-cover rounded-lg mx-auto mt-2',
      contentClass: 'p-4 space-y-2 text-center',
      titleClass: 'text-lg font-bold text-yellow-800 font-serif',
      specialEffect: 'before:absolute before:inset-2 before:border-2 before:border-yellow-400 before:rounded-lg'
    },
    // Style 5: Modern Glassmorphism
    {
      name: 'Modern Glassmorphism',
      containerClass: 'w-80 h-96 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl hover:bg-white/15 transition-all duration-400',
      imageClass: 'w-full h-56 object-cover rounded-2xl m-3',
      contentClass: 'p-6 space-y-4',
      titleClass: 'text-xl font-bold text-white drop-shadow-lg',
      specialEffect: 'before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:rounded-3xl'
    },
    // Style 6: Compact Horizontal
    {
      name: 'Compact Horizontal',
      containerClass: 'w-96 h-48 bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex overflow-hidden',
      imageClass: 'w-48 h-full object-cover',
      contentClass: 'flex-1 p-4 flex flex-col justify-between',
      titleClass: 'text-lg font-bold text-foreground',
      specialEffect: ''
    }
  ];

  const displayCards = cards.slice(0, 6);

  return (
    <div className="mb-12">
      <div className="text-center mb-8">
        <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
          <Sparkles className="w-3 h-3 mr-1" />
          Style Showcase
        </Badge>
        <h2 className="text-3xl font-bold text-foreground mb-2">Card Design Variations</h2>
        <p className="text-muted-foreground">Exploring different presentation styles for the perfect card experience</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 justify-items-center">
        {displayCards.map((card, index) => {
          const style = cardStyles[index];
          const cardId = card.id;
          const isCardLoaded = imageLoaded[cardId];
          const isCard3D = is3D[cardId];

          return (
            <div key={cardId} className="space-y-3">
              {/* Style Label */}
              <div className="text-center">
                <Badge variant="outline" className="text-xs font-medium">
                  {style.name}
                </Badge>
              </div>

              {/* Card Container */}
              <Card className={cn(style.containerClass, style.specialEffect)}>
                {style.name === 'Compact Horizontal' ? (
                  // Horizontal Layout
                  <>
                    {/* Image Section */}
                    <div className="relative">
                      <Card3DToggle
                        is3D={isCard3D}
                        onToggle={() => setIs3D(prev => ({ ...prev, [cardId]: !prev[cardId] }))}
                        className="absolute top-2 left-2 z-10"
                      />
                      
                      {!isCard3D && (
                        <img
                          src={card.image_url || '/placeholder.svg'}
                          alt={card.title}
                          className={style.imageClass}
                          onLoad={() => setImageLoaded(prev => ({ ...prev, [cardId]: true }))}
                        />
                      )}

                      {isCard3D && (
                        <div className="w-48 h-full">
                          <Card3DViewerPremium card={card} interactive />
                        </div>
                      )}

                      {card.rarity && (
                        <div className="absolute top-2 right-2">
                          <RarityBadge rarity={card.rarity} size="sm" />
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className={style.contentClass}>
                      <div>
                        <h3 className={cn(style.titleClass, 'line-clamp-2')}>{card.title}</h3>
                        {card.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {card.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        {card.current_market_value && (
                          <div className="flex items-center gap-1 text-sm font-semibold text-primary">
                            <DollarSign className="w-3 h-3" />
                            {formatPrice(card.current_market_value)}
                          </div>
                        )}
                        
                        {user && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFavoriteToggle(card)}
                            className="p-1"
                          >
                            <Heart className={cn('w-4 h-4', card.is_favorited ? 'fill-red-500 text-red-500' : '')} />
                          </Button>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  // Vertical Layout
                  <CardContent className="p-0 h-full">
                    {/* Image Section */}
                    <div className="relative">
                      <Card3DToggle
                        is3D={isCard3D}
                        onToggle={() => setIs3D(prev => ({ ...prev, [cardId]: !prev[cardId] }))}
                        className="absolute top-2 left-2 z-10"
                      />

                      {!isCard3D && (
                        <>
                          {!isCardLoaded && style.name !== 'Minimalist Clean' && (
                            <div className="absolute inset-0 bg-muted animate-pulse rounded-t-2xl" />
                          )}
                          <img
                            src={card.image_url || '/placeholder.svg'}
                            alt={card.title}
                            className={cn(
                              style.imageClass,
                              isCardLoaded ? 'opacity-100' : 'opacity-0',
                              'transition-opacity duration-300'
                            )}
                            onLoad={() => setImageLoaded(prev => ({ ...prev, [cardId]: true }))}
                          />
                        </>
                      )}

                      {isCard3D && (
                        <div className="w-full h-56">
                          <Card3DViewerPremium card={card} interactive />
                        </div>
                      )}

                      {card.rarity && (
                        <div className="absolute top-2 right-2">
                          <RarityBadge rarity={card.rarity} size="sm" />
                        </div>
                      )}

                      {user && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute bottom-2 right-2 bg-black/50 hover:bg-black/70 text-white"
                          onClick={() => handleFavoriteToggle(card)}
                        >
                          <Heart className={cn('w-4 h-4', card.is_favorited ? 'fill-red-500 text-red-500' : '')} />
                        </Button>
                      )}

                      {/* Special effects for specific styles */}
                      {style.name === 'Cyberpunk Neon' && (
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent animate-pulse pointer-events-none" />
                      )}
                    </div>

                    {/* Content Section */}
                    <div className={style.contentClass}>
                      <div>
                        <h3 className={cn(style.titleClass, 'line-clamp-1')} title={card.title}>
                          {card.title}
                        </h3>
                        
                        {card.description && style.name !== 'Compact Horizontal' && (
                          <p className={cn(
                            'text-sm line-clamp-2 mt-1',
                            style.name === 'Minimalist Clean' ? 'text-gray-600' :
                            style.name === 'Classic Trading Card' ? 'text-yellow-700' :
                            style.name === 'Cyberpunk Neon' ? 'text-cyan-300' :
                            'text-muted-foreground'
                          )}>
                            {card.description}
                          </p>
                        )}
                      </div>

                      {/* Bottom Stats */}
                      <div className="flex items-center justify-between mt-auto">
                        {card.current_market_value && (
                          <div className={cn(
                            'flex items-center gap-1 text-sm font-semibold',
                            style.name === 'Minimalist Clean' ? 'text-gray-900' :
                            style.name === 'Classic Trading Card' ? 'text-yellow-700' :
                            style.name === 'Cyberpunk Neon' ? 'text-cyan-400' :
                            'text-primary'
                          )}>
                            <DollarSign className="w-3 h-3" />
                            {formatPrice(card.current_market_value)}
                          </div>
                        )}

                        <div className="flex items-center gap-3 text-xs">
                          {card.view_count !== undefined && (
                            <div className="flex items-center gap-1 opacity-70">
                              <Eye className="w-3 h-3" />
                              <span>{card.view_count}</span>
                            </div>
                          )}
                          
                          {card.creator && (
                            <div className="flex items-center gap-1 opacity-70">
                              <User className="w-3 h-3" />
                              <span className="truncate max-w-20">{card.creator.username}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CardShowcase;
