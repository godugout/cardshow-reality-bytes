import { useState } from 'react';
import { useCardCreationWizard } from '@/hooks/useCardCreationWizard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Upload, DollarSign, Eye, MessageCircle, ArrowRightLeft, Globe, Lock } from 'lucide-react';

interface PublishCardProps {
  wizard: ReturnType<typeof useCardCreationWizard>;
}

export const PublishCard = ({ wizard }: PublishCardProps) => {
  const { state, updateState, saveCard } = wizard;
  const [publishing, setPublishing] = useState(false);
  const [publishType, setPublishType] = useState<'free' | 'paid' | 'draft'>('free');

  const handlePublish = async () => {
    setPublishing(true);
    try {
      const shouldPublish = publishType !== 'draft';
      await saveCard(shouldPublish);
      // Redirect or show success message would happen here
    } catch (error) {
      console.error('Failed to publish card:', error);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="space-y-8 pb-24">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Publish Your Card
        </h2>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
          Choose how you want to share your creation with the world.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Publishing Options */}
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-primary" />
              Publishing Options
            </h3>

            <RadioGroup value={publishType} onValueChange={(value) => setPublishType(value as 'free' | 'paid' | 'draft')} className="space-y-4">
              {/* Draft */}
              <div className="flex items-center space-x-3 p-4 bg-slate-700 rounded-lg">
                <RadioGroupItem value="draft" id="draft" />
                <div className="flex-1">
                  <Label htmlFor="draft" className="text-white font-medium cursor-pointer">
                    <div className="flex items-center gap-2 mb-1">
                      <Lock className="w-4 h-4 text-slate-400" />
                      Save as Draft
                    </div>
                  </Label>
                  <p className="text-sm text-slate-400">
                    Keep your card private while you continue working on it
                  </p>
                </div>
              </div>

              {/* Free Public */}
              <div className="flex items-center space-x-3 p-4 bg-slate-700 rounded-lg">
                <RadioGroupItem value="free" id="free" />
                <div className="flex-1">
                  <Label htmlFor="free" className="text-white font-medium cursor-pointer">
                    <div className="flex items-center gap-2 mb-1">
                      <Eye className="w-4 h-4 text-green-400" />
                      Publish for Free
                    </div>
                  </Label>
                  <p className="text-sm text-slate-400">
                    Make your card publicly visible for everyone to enjoy
                  </p>
                </div>
              </div>

              {/* Paid */}
              <div className="flex items-center space-x-3 p-4 bg-slate-700 rounded-lg">
                <RadioGroupItem value="paid" id="paid" />
                <div className="flex-1">
                  <Label htmlFor="paid" className="text-white font-medium cursor-pointer">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="w-4 h-4 text-yellow-400" />
                      Publish with Price
                    </div>
                  </Label>
                  <p className="text-sm text-slate-400">
                    Set a price for users to purchase your card
                  </p>
                </div>
              </div>
            </RadioGroup>

            {/* Price Input */}
            {publishType === 'paid' && (
              <div className="mt-6 p-4 bg-slate-700 rounded-lg">
                <Label htmlFor="price" className="text-white font-medium mb-2 block">
                  Card Price (USD)
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="price"
                    type="number"
                    min="0.99"
                    step="0.01"
                    placeholder="9.99"
                    value={state.price || ''}
                    onChange={(e) => updateState({ price: parseFloat(e.target.value) || undefined })}
                    className="pl-10 bg-slate-600 border-slate-500 text-white"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Recommended: $0.99 - $19.99 for individual cards
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card Settings */}
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Card Settings</h3>

            <div className="space-y-6">
              {/* Visibility */}
              <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                <div>
                  <Label className="text-white font-medium">Public Visibility</Label>
                  <p className="text-sm text-slate-400">Allow others to discover your card</p>
                </div>
                <Switch
                  checked={state.isPublic}
                  onCheckedChange={(checked) => updateState({ isPublic: checked })}
                />
              </div>

              {/* Comments */}
              <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-blue-400" />
                  <div>
                    <Label className="text-white font-medium">Enable Comments</Label>
                    <p className="text-sm text-slate-400">Let users leave feedback</p>
                  </div>
                </div>
                <Switch
                  checked={state.enableComments}
                  onCheckedChange={(checked) => updateState({ enableComments: checked })}
                />
              </div>

              {/* Trading */}
              <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                <div className="flex items-center gap-2">
                  <ArrowRightLeft className="w-4 h-4 text-green-400" />
                  <div>
                    <Label className="text-white font-medium">Allow Trading</Label>
                    <p className="text-sm text-slate-400">Enable card trading with others</p>
                  </div>
                </div>
                <Switch
                  checked={state.enableTrades}
                  onCheckedChange={(checked) => updateState({ enableTrades: checked })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Final Review */}
        <Card className="bg-gradient-to-r from-slate-800 to-slate-700 border-slate-600 lg:col-span-2">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Final Review</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card Summary */}
              <div>
                <h4 className="text-white font-medium mb-2">Card Details</h4>
                <div className="text-sm text-slate-300 space-y-1">
                  <p><span className="text-slate-400">Title:</span> {state.cardDetails.title}</p>
                  <p><span className="text-slate-400">Type:</span> {state.cardDetails.cardType}</p>
                  <p><span className="text-slate-400">Rarity:</span> {state.cardDetails.rarity}</p>
                  {publishType === 'paid' && state.price && (
                    <p><span className="text-slate-400">Price:</span> ${state.price}</p>
                  )}
                </div>
              </div>

              {/* Publishing Summary */}
              <div>
                <h4 className="text-white font-medium mb-2">Publishing</h4>
                <div className="text-sm text-slate-300 space-y-1">
                  <p><span className="text-slate-400">Type:</span> {publishType}</p>
                  <p><span className="text-slate-400">Visibility:</span> {state.isPublic ? 'Public' : 'Private'}</p>
                  <p><span className="text-slate-400">Comments:</span> {state.enableComments ? 'Enabled' : 'Disabled'}</p>
                  <p><span className="text-slate-400">Trading:</span> {state.enableTrades ? 'Enabled' : 'Disabled'}</p>
                </div>
              </div>

              {/* Template & Effects */}
              <div>
                <h4 className="text-white font-medium mb-2">Customization</h4>
                <div className="text-sm text-slate-300 space-y-1">
                  <p><span className="text-slate-400">Template:</span> {state.selectedTemplate?.name}</p>
                  <p><span className="text-slate-400">Images:</span> {Object.keys(state.images).length} uploaded</p>
                  <p><span className="text-slate-400">Effects:</span> {
                    Object.entries(state.visualEffects).filter(([key, value]) => 
                      typeof value === 'boolean' && value
                    ).length || 0
                  } active</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Publish Button */}
        <div className="lg:col-span-2 text-center">
          <Card className="bg-primary/10 border-primary/30">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-white mb-4">
                Ready to {publishType === 'draft' ? 'Save' : 'Publish'}?
              </h3>
              <p className="text-slate-300 mb-6">
                {publishType === 'draft' 
                  ? 'Your card will be saved privately and you can continue editing it later.'
                  : publishType === 'free'
                  ? 'Your card will be visible to the entire community immediately.'
                  : 'Your card will be available for purchase on the marketplace.'
                }
              </p>
              
              <Button
                size="lg"
                onClick={handlePublish}
                disabled={publishing || wizard.isLoading}
                className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg"
              >
                {publishing ? (
                  'Publishing...'
                ) : (
                  <>
                    <Upload className="w-5 h-5 mr-2" />
                    {publishType === 'draft' ? 'Save Draft' : 'Publish Card'}
                  </>
                )}
              </Button>

              {publishType !== 'draft' && (
                <p className="text-xs text-slate-400 mt-4">
                  You can always change these settings later from your card management panel.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};