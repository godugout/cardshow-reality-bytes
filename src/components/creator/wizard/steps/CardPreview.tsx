import { useState } from 'react';
import { useCardCreationWizard } from '@/hooks/useCardCreationWizard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, RotateCcw, Maximize, Download, Share, Edit3 } from 'lucide-react';
import { CARD_RARITIES, CARD_TYPES } from '@/types/cardCreation';

interface CardPreviewProps {
  wizard: ReturnType<typeof useCardCreationWizard>;
}

export const CardPreview = ({ wizard }: CardPreviewProps) => {
  const { state } = wizard;
  const [viewMode, setViewMode] = useState<'2d' | '3d' | 'fullscreen'>('2d');
  const [isRotated, setIsRotated] = useState(false);

  const rarity = CARD_RARITIES.find(r => r.value === state.cardDetails.rarity);
  const cardType = CARD_TYPES.find(t => t.value === state.cardDetails.cardType);

  const generatePreviewCard = () => {
    return (
      <div className="relative w-full h-full bg-slate-900 rounded-xl overflow-hidden border border-slate-600">
        {/* Background */}
        <div 
          className="absolute inset-0"
          style={{ backgroundColor: state.colors.secondary }}
        >
          {/* Background image if available */}
          {state.images.background && (
            <img 
              src={URL.createObjectURL(state.images.background)}
              alt="Background"
              className="w-full h-full object-cover opacity-30"
            />
          )}

          {/* Visual effects */}
          {state.visualEffects.holographic && (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 animate-pulse" />
          )}
          {state.visualEffects.rainbow && (
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-yellow-500/10 via-green-500/10 via-blue-500/10 to-purple-500/10" />
          )}
          {state.visualEffects.chrome && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-400/20 to-gray-600/20" />
          )}
          {state.visualEffects.foil && (
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-yellow-400/10" />
          )}
        </div>

        {/* Main image */}
        {state.images.main && (
          <div className="absolute inset-4 flex items-center justify-center">
            <img 
              src={URL.createObjectURL(state.images.main)}
              alt="Main card image"
              className="max-w-full max-h-[60%] object-contain rounded-lg"
            />
          </div>
        )}

        {/* Overlay image */}
        {state.images.overlay && (
          <div className="absolute inset-0">
            <img 
              src={URL.createObjectURL(state.images.overlay)}
              alt="Overlay"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Card content */}
        <div className="absolute inset-0 flex flex-col justify-between p-4">
          {/* Top section - rarity and type */}
          <div className="flex justify-between items-start">
            <Badge 
              className="text-xs font-bold"
              style={{ 
                backgroundColor: rarity?.color || '#94a3b8',
                color: '#000'
              }}
            >
              {rarity?.label || 'Common'}
            </Badge>
            <Badge variant="secondary" className="text-xs bg-slate-700 text-slate-200">
              {cardType?.label || 'Character'}
            </Badge>
          </div>

          {/* Bottom section - title and description */}
          <div 
            className="p-3 rounded-lg backdrop-blur-sm"
            style={{ 
              backgroundColor: `${state.colors.primary}20`,
              borderColor: state.colors.accent,
              borderWidth: '1px'
            }}
          >
            <h3 
              className="font-bold mb-2 leading-tight"
              style={{ 
                color: state.colors.text,
                fontSize: `${Math.max(state.textStyles.titleSize * 0.7, 16)}px`,
                fontFamily: state.textStyles.titleFont
              }}
            >
              {state.cardDetails.title || 'Untitled Card'}
            </h3>
            {state.cardDetails.description && (
              <p 
                className="text-sm opacity-90 leading-snug"
                style={{ 
                  color: state.colors.text,
                  fontSize: `${Math.max(state.textStyles.descriptionSize * 0.8, 12)}px`,
                  fontFamily: state.textStyles.descriptionFont
                }}
              >
                {state.cardDetails.description}
              </p>
            )}
          </div>
        </div>

        {/* Glow effect */}
        {(state.visualEffects.holographic || state.visualEffects.foil) && (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              boxShadow: `inset 0 0 30px ${state.visualEffects.glowColor}`,
              opacity: state.visualEffects.intensity * 0.5
            }}
          />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8 pb-24">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Preview Your Card
        </h2>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
          Take a final look at your creation. You can still go back to make changes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Card Preview */}
        <div className="lg:col-span-2">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <Eye className="w-5 h-5 mr-2 text-primary" />
                  Card Preview
                </h3>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setViewMode(viewMode === '2d' ? '3d' : '2d')}
                    className="border-slate-600 text-slate-300 hover:text-white"
                  >
                    {viewMode === '2d' ? '3D View' : '2D View'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsRotated(!isRotated)}
                    className="border-slate-600 text-slate-300 hover:text-white"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setViewMode('fullscreen')}
                    className="border-slate-600 text-slate-300 hover:text-white"
                  >
                    <Maximize className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Card Display */}
              <div className="flex justify-center">
                <div 
                  className={`aspect-[3/4] transition-transform duration-500 ${
                    viewMode === '3d' ? 'hover:rotate-y-12 hover:scale-105' : ''
                  } ${isRotated ? 'rotate-y-180' : ''}`}
                  style={{ 
                    width: viewMode === 'fullscreen' ? '400px' : '300px',
                    transformStyle: 'preserve-3d'
                  }}
                >
                  {generatePreviewCard()}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-3 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-600 text-slate-300 hover:text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-600 text-slate-300 hover:text-white"
                >
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => wizard.goToStep('effects')}
                  className="border-slate-600 text-slate-300 hover:text-white"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Card Details Summary */}
        <div className="space-y-6">
          {/* Basic Info */}
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Card Information</h3>
              
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-slate-400">Title:</span>
                  <p className="text-white font-medium">{state.cardDetails.title || 'Untitled'}</p>
                </div>
                
                <div>
                  <span className="text-slate-400">Type:</span>
                  <p className="text-white">{cardType?.label || 'Character'}</p>
                </div>
                
                <div>
                  <span className="text-slate-400">Rarity:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: rarity?.color || '#94a3b8' }}
                    />
                    <span className="text-white">{rarity?.label || 'Common'}</span>
                  </div>
                </div>

                {state.cardDetails.description && (
                  <div>
                    <span className="text-slate-400">Description:</span>
                    <p className="text-white text-xs leading-relaxed mt-1">
                      {state.cardDetails.description}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Template Info */}
          {state.selectedTemplate && (
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Template</h3>
                
                <div className="flex items-center gap-3">
                  <img
                    src={state.selectedTemplate.preview_url}
                    alt={state.selectedTemplate.name}
                    className="w-12 h-16 object-cover rounded border border-slate-600"
                  />
                  <div>
                    <p className="text-white font-medium">{state.selectedTemplate.name}</p>
                    <p className="text-slate-400 text-sm">{state.selectedTemplate.category}</p>
                    {state.selectedTemplate.is_premium && (
                      <Badge className="bg-yellow-500 text-black text-xs mt-1">
                        Premium
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Effects Summary */}
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Applied Effects</h3>
              
              <div className="space-y-2">
                {Object.entries(state.visualEffects).map(([key, value]) => {
                  if (key === 'intensity' || key === 'glowColor') return null;
                  if (typeof value === 'boolean' && value) {
                    return (
                      <Badge key={key} variant="secondary" className="mr-2 bg-slate-700 text-slate-200">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </Badge>
                    );
                  }
                  return null;
                })}
                
                {!Object.entries(state.visualEffects).some(([key, value]) => 
                  typeof value === 'boolean' && value && key !== 'intensity' && key !== 'glowColor'
                ) && (
                  <p className="text-slate-400 text-sm">No special effects applied</p>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-700">
                <p className="text-slate-400 text-sm mb-2">Effect Intensity:</p>
                <div className="bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-200"
                    style={{ width: `${state.visualEffects.intensity * 100}%` }}
                  />
                </div>
                <p className="text-slate-300 text-xs mt-1">
                  {Math.round(state.visualEffects.intensity * 100)}%
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};