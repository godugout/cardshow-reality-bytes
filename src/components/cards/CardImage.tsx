
import { useState } from 'react';
import { cn } from '@/lib/utils';
import Card3DViewerPremium from './Card3DViewerPremium';
import Card3DToggle from './Card3DToggle';
import type { Card as CardType } from '@/types/card';

interface CardImageProps {
  card: CardType;
  is3D: boolean;
  onToggle3D: (is3D: boolean) => void;
}

const CardImage = ({ card, is3D, onToggle3D }: CardImageProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [view3DLoaded, setView3DLoaded] = useState(false);

  return (
    <div className="relative h-2/3 overflow-hidden">
      {/* 3D/2D Toggle */}
      <div className="absolute top-2 left-2 z-10">
        <Card3DToggle
          is3D={is3D}
          onToggle={onToggle3D}
        />
      </div>

      {/* 2D Image */}
      {!is3D && (
        <>
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-800 animate-pulse" />
          )}
          <img
            src={card.image_url || '/placeholder.svg'}
            alt={card.title}
            className={cn(
              'w-full h-full object-cover transition-opacity duration-300',
              imageLoaded ? 'opacity-100' : 'opacity-0'
            )}
            onLoad={() => setImageLoaded(true)}
          />
        </>
      )}

      {/* Premium 3D View */}
      {is3D && (
        <div className="w-full h-full">
          <Card3DViewerPremium
            card={card}
            interactive
            onLoad={() => setView3DLoaded(true)}
            onFlip={() => {
              // Add flip sound effect here if enabled
              console.log('Card flipped:', card.title);
            }}
          />
          
          {!view3DLoaded && (
            <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center">
              <div className="text-gray-400 text-sm">Loading premium 3D...</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CardImage;
