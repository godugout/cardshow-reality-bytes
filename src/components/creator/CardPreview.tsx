
import { CardCreationData } from '@/hooks/useCardCreation';

interface CardPreviewProps {
  cardData: CardCreationData;
  className?: string;
}

export const CardPreview = ({ cardData, className = '' }: CardPreviewProps) => {
  const getEffectStyles = () => {
    const { effects } = cardData.designConfig;
    let backgroundImage = '';
    
    if (cardData.imageUrl) {
      // Use the uploaded image as the primary background
      backgroundImage = `url(${cardData.imageUrl})`;
    }

    let effectClasses = '';
    let overlayStyles = {};
    
    if (effects.holographic) {
      effectClasses += ' holographic-effect';
      overlayStyles = {
        background: `linear-gradient(45deg, 
          hsl(var(--primary) / ${effects.intensity * 0.3}), 
          hsl(var(--primary) / ${effects.intensity * 0.2}),
          hsl(var(--primary) / ${effects.intensity * 0.4}))`,
        backgroundSize: '200% 200%',
        animation: 'holographicShimmer 3s ease-in-out infinite',
        mixBlendMode: 'overlay' as const,
      };
    } else if (effects.chrome) {
      effectClasses += ' chrome-effect';
      overlayStyles = {
        background: `linear-gradient(135deg, 
          hsl(var(--muted-foreground) / ${effects.intensity * 0.5}), 
          hsl(var(--muted-foreground) / ${effects.intensity * 0.3}),
          hsl(var(--muted-foreground) / ${effects.intensity * 0.4}))`,
        mixBlendMode: 'overlay' as const,
      };
    } else if (effects.foil) {
      effectClasses += ' foil-effect';
      overlayStyles = {
        background: `linear-gradient(90deg, 
          hsl(var(--primary) / ${effects.intensity * 0.4}), 
          hsl(var(--primary) / ${effects.intensity * 0.2}),
          hsl(var(--primary) / ${effects.intensity * 0.3}))`,
        backgroundSize: '150% 150%',
        animation: 'foilShimmer 2s ease-in-out infinite',
        mixBlendMode: 'overlay' as const,
      };
    }

    return { backgroundImage, overlayStyles, effectClasses };
  };

  const { backgroundImage, overlayStyles, effectClasses } = getEffectStyles();
  const { designConfig } = cardData;

  return (
    <>
      <style>
        {`
          @keyframes holographicShimmer {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          
          @keyframes foilShimmer {
            0%, 100% { background-position: 0% 0%; }
            50% { background-position: 100% 100%; }
          }

          .holographic-effect {
            box-shadow: 0 0 20px hsl(var(--primary) / 0.3);
          }

          .chrome-effect {
            box-shadow: 0 0 15px hsl(var(--muted-foreground) / 0.4);
          }

          .foil-effect {
            box-shadow: 0 0 18px hsl(var(--primary) / 0.4);
          }
        `}
      </style>
      
      <div className={`w-full h-full ${className}`}>
        <div 
          className={`relative w-full h-full flex flex-col justify-end p-4 text-white shadow-2xl overflow-hidden transition-transform duration-300 ${effectClasses}`}
          style={{
            backgroundColor: cardData.imageUrl ? 'transparent' : designConfig.backgroundColor,
            borderRadius: `${designConfig.borderRadius}px`,
            backgroundImage,
            backgroundSize: "cover",
            backgroundPosition: "center",
            border: '2px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Dark overlay for better text readability when image is present */}
          {cardData.imageUrl && (
            <div 
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"
              style={{ borderRadius: `${designConfig.borderRadius}px` }}
            />
          )}

          {/* Effects overlay */}
          {(designConfig.effects.holographic || designConfig.effects.foil || designConfig.effects.chrome) && (
            <div 
              className="absolute inset-0"
              style={{
                ...overlayStyles,
                borderRadius: `${designConfig.borderRadius}px`,
              }}
            />
          )}

          {/* Placeholder for image if no image uploaded */}
          {!cardData.imageUrl && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-slate-600 rounded-lg flex items-center justify-center">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm text-slate-400">Upload an image</p>
              </div>
            </div>
          )}

          {/* Text content */}
          <div className={`relative z-10 ${
            designConfig.textPosition === "top" ? "self-start absolute top-4 left-4" :
            designConfig.textPosition === "center" ? "self-center absolute top-1/2 left-4 transform -translate-y-1/2" :
            "self-end"
          }`}>
            <h2 
              className="text-xl font-bold mb-1 drop-shadow-lg"
              style={{ color: designConfig.titleColor }}
            >
              {cardData.title || 'Card Title'}
            </h2>
            {cardData.description && (
              <p 
                className="text-sm opacity-90 drop-shadow-md"
                style={{ color: designConfig.subtitleColor }}
              >
                {cardData.description}
              </p>
            )}
          </div>

          {/* Effect indicators */}
          {(designConfig.effects.holographic || designConfig.effects.foil || designConfig.effects.chrome) && (
            <div className="absolute top-2 right-2 z-20">
              <div className="flex gap-1">
                {designConfig.effects.holographic && (
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                )}
                {designConfig.effects.foil && (
                  <div className="w-2 h-2 bg-primary/80 rounded-full animate-pulse"></div>
                )}
                {designConfig.effects.chrome && (
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
