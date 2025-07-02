import { useCardCreationWizard } from '@/hooks/useCardCreationWizard';
import { CARD_RARITIES, CARD_TYPES } from '@/types/cardCreation';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FileText, Tag, Star } from 'lucide-react';

interface CardDetailsProps {
  wizard: ReturnType<typeof useCardCreationWizard>;
}

export const CardDetails = ({ wizard }: CardDetailsProps) => {
  const { state, updateState } = wizard;

  const updateCardDetails = (updates: Partial<typeof state.cardDetails>) => {
    updateState({
      cardDetails: {
        ...state.cardDetails,
        ...updates
      }
    });
  };

  return (
    <div className="space-y-8 pb-24">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Card Details
        </h2>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
          Give your card a name, description, and set its properties.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Information */}
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-primary" />
              Basic Information
            </h3>

            <div className="space-y-6">
              {/* Card Title */}
              <div>
                <Label htmlFor="title" className="text-white font-medium mb-2 block">
                  Card Title <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Enter your card title..."
                  value={state.cardDetails.title}
                  onChange={(e) => updateCardDetails({ title: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
                <p className="text-xs text-slate-400 mt-1">
                  This will be the main title displayed on your card
                </p>
              </div>

              {/* Card Description */}
              <div>
                <Label htmlFor="description" className="text-white font-medium mb-2 block">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your card, its lore, or special abilities..."
                  value={state.cardDetails.description}
                  onChange={(e) => updateCardDetails({ description: e.target.value })}
                  rows={4}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 resize-none"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Optional but recommended for better engagement
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card Properties */}
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
              <Tag className="w-5 h-5 mr-2 text-primary" />
              Card Properties
            </h3>

            <div className="space-y-6">
              {/* Card Type */}
              <div>
                <Label className="text-white font-medium mb-2 block">
                  Card Type
                </Label>
                <Select
                  value={state.cardDetails.cardType}
                  onValueChange={(value) => updateCardDetails({ cardType: value })}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select card type" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {CARD_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value} className="text-white hover:bg-slate-600">
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Card Rarity */}
              <div>
                <Label className="text-white font-medium mb-2 block">
                  Rarity
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {CARD_RARITIES.map((rarity) => (
                    <button
                      key={rarity.value}
                      onClick={() => updateCardDetails({ rarity: rarity.value })}
                      className={`p-3 rounded-lg border text-left transition-all duration-200 ${
                        state.cardDetails.rarity === rarity.value
                          ? 'border-primary bg-primary/10'
                          : 'border-slate-600 bg-slate-700 hover:border-slate-500'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: rarity.color }}
                        />
                        <span className="text-white font-medium text-sm">
                          {rarity.label}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview Card Info */}
      <Card className="bg-gradient-to-r from-slate-800 to-slate-700 border-slate-600">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Star className="w-5 h-5 mr-2 text-yellow-400" />
            Card Preview
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-slate-400 mb-1">Title</p>
              <p className="text-white font-medium">
                {state.cardDetails.title || 'Untitled Card'}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-slate-400 mb-1">Type</p>
              <Badge variant="secondary" className="bg-slate-600 text-slate-200">
                {CARD_TYPES.find(type => type.value === state.cardDetails.cardType)?.label || 'Character'}
              </Badge>
            </div>
            
            <div>
              <p className="text-sm text-slate-400 mb-1">Rarity</p>
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ 
                    backgroundColor: CARD_RARITIES.find(r => r.value === state.cardDetails.rarity)?.color || '#94a3b8'
                  }}
                />
                <span className="text-white font-medium">
                  {CARD_RARITIES.find(r => r.value === state.cardDetails.rarity)?.label || 'Common'}
                </span>
              </div>
            </div>
          </div>

          {state.cardDetails.description && (
            <div className="mt-4 pt-4 border-t border-slate-600">
              <p className="text-sm text-slate-400 mb-1">Description</p>
              <p className="text-slate-200 text-sm leading-relaxed">
                {state.cardDetails.description}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};