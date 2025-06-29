
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
            box-shadow: 0 0 25px hsl(var(--primary) / 0.4), 0 0 50px hsl(var(--primary) / 0.2);
          }

          .chrome-effect {
            box-shadow: 0 0 20px hsl(var(--muted-foreground) / 0.5), 0 0 40px hsl(var(--muted-foreground) / 0.2);
          }

          .foil-effect {
            box-shadow: 0 0 22px hsl(var(--primary) / 0.45), 0 0 45px hsl(var(--primary) / 0.2);
          }
        `}
      </style>
      
      <div className={`w-full h-full ${className}`}>
        <div 
          className={`relative w-full h-full flex flex-col justify-end p-4 text-white shadow-2xl overflow-hidden transition-all duration-300 ${effectClasses}`}
          style={{
            backgroundColor: cardData.imageUrl ? 'transparent' : designConfig.backgroundColor,
            borderRadius: `${designConfig.borderRadius}px`,
            backgroundImage,
            backgroundSize: "cover",
            backgroundPosition: "center",
            border: '2px solid rgba(255, 255, 255, 0.15)',
            // Enhanced card shadow for better definition
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
          }}
        >
          {/* Enhanced dark overlay for better text readability */}
          {cardData.imageUrl && (
            <div 
              className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"
              style={{ borderRadius: `${designConfig.borderRadius}px` }}
            />
          )}

          {/* Effects overlay with enhanced visibility */}
          {(designConfig.effects.holographic || designConfig.effects.foil || designConfig.effects.chrome) && (
            <div 
              className="absolute inset-0"
              style={{
                ...overlayStyles,
                borderRadius: `${designConfig.borderRadius}px`,
              }}
            />
          )}

          {/* Enhanced placeholder for image if no image uploaded */}
          {!cardData.imageUrl && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-600 to-slate-800">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-3 bg-slate-500/50 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm text-slate-300 font-medium">Upload an image</p>
                <p className="text-xs text-slate-400 mt-1">to see your card come to life</p>
              </div>
            </div>
          )}

          {/* Enhanced text content with better styling */}
          <div className={`relative z-10 ${
            designConfig.textPosition === "top" ? "self-start absolute top-4 left-4" :
            designConfig.textPosition === "center" ? "self-center absolute top-1/2 left-4 transform -translate-y-1/2" :
            "self-end"
          }`}>
            <h2 
              className="text-xl font-bold mb-1 drop-shadow-lg"
              style={{ 
                color: designConfig.titleColor,
                textShadow: '0 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.4)'
              }}
            >
              {cardData.title || 'Card Title'}
            </h2>
            {cardData.description && (
              <p 
                className="text-sm opacity-90 drop-shadow-md leading-relaxed"
                style={{ 
                  color: designConfig.subtitleColor,
                  textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                }}
              >
                {cardData.description}
              </p>
            )}
          </div>

          {/* Enhanced effect indicators with better visibility */}
          {(designConfig.effects.holographic || designConfig.effects.foil || designConfig.effects.chrome) && (
            <div className="absolute top-3 right-3 z-20">
              <div className="flex gap-1.5 bg-black/30 backdrop-blur-sm rounded-full px-2 py-1">
                {designConfig.effects.holographic && (
                  <div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse shadow-sm"></div>
                )}
                {designConfig.effects.foil && (
                  <div className="w-2.5 h-2.5 bg-primary/80 rounded-full animate-pulse shadow-sm"></div>
                )}
                {designConfig.effects.chrome && (
                  <div className="w-2.5 h-2.5 bg-muted-foreground rounded-full animate-pulse shadow-sm"></div>
                )}
              </div>
            </div>
          )}

          {/* Subtle card frame enhancement */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              borderRadius: `${designConfig.borderRadius}px`,
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.1)',
            }}
          />
        </div>
      </div>
    </>
  );
};
