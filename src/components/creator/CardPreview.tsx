
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
      backgroundImage = `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url(${cardData.imageUrl})`;
    }

    let effectClasses = '';
    let overlayStyles = {};
    
    if (effects.holographic) {
      effectClasses += ' holographic-effect';
      overlayStyles = {
        background: `linear-gradient(45deg, 
          rgba(255,0,255,${effects.intensity * 0.3}), 
          rgba(0,255,255,${effects.intensity * 0.3}),
          rgba(255,255,0,${effects.intensity * 0.2}),
          rgba(255,0,255,${effects.intensity * 0.3}))`,
        backgroundSize: '200% 200%',
        animation: 'holographicShimmer 3s ease-in-out infinite',
        mixBlendMode: 'overlay' as const,
      };
    } else if (effects.chrome) {
      effectClasses += ' chrome-effect';
      overlayStyles = {
        background: `linear-gradient(135deg, 
          rgba(192,192,192,${effects.intensity * 0.5}), 
          rgba(255,255,255,${effects.intensity * 0.3}),
          rgba(160,160,160,${effects.intensity * 0.4}))`,
        mixBlendMode: 'overlay' as const,
      };
    } else if (effects.foil) {
      effectClasses += ' foil-effect';
      overlayStyles = {
        background: `linear-gradient(90deg, 
          rgba(255,215,0,${effects.intensity * 0.4}), 
          rgba(255,165,0,${effects.intensity * 0.2}),
          rgba(255,140,0,${effects.intensity * 0.3}))`,
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
            box-shadow: 0 0 20px rgba(255, 0, 255, 0.3);
          }

          .chrome-effect {
            box-shadow: 0 0 15px rgba(192, 192, 192, 0.4);
          }

          .foil-effect {
            box-shadow: 0 0 18px rgba(255, 215, 0, 0.4);
          }
        `}
      </style>
      
      <div className={`flex justify-center ${className}`}>
        <div 
          className={`relative w-64 h-80 flex flex-col justify-end p-4 text-white shadow-2xl overflow-hidden transition-transform duration-300 hover:scale-105 ${effectClasses}`}
          style={{
            backgroundColor: designConfig.backgroundColor,
            borderRadius: `${designConfig.borderRadius}px`,
            backgroundImage,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
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
            <div className="absolute inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-gray-600 rounded-lg flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-300">Upload an image</p>
              </div>
            </div>
          )}

          {/* Text content */}
          <div className={`relative z-10 ${
            designConfig.textPosition === "top" ? "self-start" :
            designConfig.textPosition === "center" ? "self-center" :
            "self-end"
          }`}>
            <h2 
              className="text-xl font-bold mb-1"
              style={{ color: designConfig.titleColor }}
            >
              {cardData.title || 'Card Title'}
            </h2>
            {cardData.description && (
              <p 
                className="text-sm opacity-90"
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
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                )}
                {designConfig.effects.foil && (
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                )}
                {designConfig.effects.chrome && (
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
