
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import Card3DToggle from './Card3DToggle';
import Card3DViewerPremium from './Card3DViewerPremium';
import CardInfoDrawer from './CardInfoDrawer';
import CardOverlayControls from './CardOverlayControls';
import type { Card } from '@/types/card';

interface EnhancedCRDCardProps {
  card: Card;
  size?: 'sm' | 'md' | 'lg';
  styleVariant?: CardStyleVariant;
  className?: string;
}

export interface CardStyleVariant {
  name: string;
  containerClasses: string;
  imageClasses: string;
  drawerStyle: string;
  overlayClasses?: string;
}

// Card size configurations maintaining 2.5:3.5 aspect ratio (5:7)
const cardSizes = {
  sm: { width: 200, height: 280 },
  md: { width: 280, height: 392 },
  lg: { width: 350, height: 490 }
};

const EnhancedCRDCard = ({ 
  card, 
  size = 'md', 
  styleVariant,
  className 
}: EnhancedCRDCardProps) => {
  const { user } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [is3D, setIs3D] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'lifting' | 'expanding'>('idle');

  // Get user's drawer pin preference (mock for now)
  const [drawerPinned] = useState(false);

  const handleHoverStart = () => {
    if (!drawerPinned) {
      setIsHovered(true);
      setAnimationPhase('lifting');
      
      // Phase 2: Expand drawer after lift completes
      setTimeout(() => {
        setAnimationPhase('expanding');
      }, 150);
    }
  };

  const handleHoverEnd = () => {
    if (!drawerPinned) {
      setIsHovered(false);
      setAnimationPhase('idle');
    }
  };

  const cardDimensions = cardSizes[size];

  return (
    <div 
      className={cn(
        'relative group overflow-hidden transition-all duration-300',
        'hover:scale-105 hover:shadow-2xl',
        styleVariant?.containerClasses,
        className
      )}
      style={{ 
        width: cardDimensions.width, 
        height: cardDimensions.height,
        aspectRatio: '5/7' // Enforce 2.5:3.5 ratio
      }}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
    >
      {/* Main Card Image Container - Always 2.5:3.5 aspect ratio */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl">
        {/* Background overlay for style variants */}
        {styleVariant?.overlayClasses && (
          <div className={cn('absolute inset-0 z-0', styleVariant.overlayClasses)} />
        )}

        {/* Card Image or 3D View */}
        <div className="relative w-full h-full z-10">
          {!is3D ? (
            <>
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-800 animate-pulse rounded-3xl" />
              )}
              <img
                src={card.image_url || '/placeholder.svg'}
                alt={card.title}
                className={cn(
                  'w-full h-full object-cover transition-opacity duration-300 rounded-3xl',
                  imageLoaded ? 'opacity-100' : 'opacity-0',
                  styleVariant?.imageClasses
                )}
                onLoad={() => setImageLoaded(true)}
              />
            </>
          ) : (
            <div className="w-full h-full rounded-3xl overflow-hidden">
              <Card3DViewerPremium card={card} interactive />
            </div>
          )}
        </div>

        {/* Overlay Controls */}
        <CardOverlayControls 
          card={card}
          is3D={is3D}
          onToggle3D={setIs3D}
          user={user}
        />
      </div>

      {/* Interactive Info Drawer */}
      <CardInfoDrawer 
        card={card}
        isHovered={isHovered}
        isPinned={drawerPinned}
        animationPhase={animationPhase}
        drawerStyle={styleVariant?.drawerStyle || 'default'}
        size={size}
      />
    </div>
  );
};

export default EnhancedCRDCard;
