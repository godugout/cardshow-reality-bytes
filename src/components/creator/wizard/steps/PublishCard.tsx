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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Publishing Options */}
        <Card className="card-shell">
          <CardContent className="p-lg">
            <h3 className="text-lg font-bold text-foreground mb-lg flex items-center">
              <Globe className="w-5 h-5 mr-2 text-brand-marketplace" />
              Publishing Options
            </h3>

            <RadioGroup value={publishType} onValueChange={(value) => setPublishType(value as 'free' | 'paid' | 'draft')} className="space-y-md">
              {/* Draft */}
              <div className="flex items-center space-x-3 p-md bg-muted rounded-lg border border-border">
                <RadioGroupItem value="draft" id="draft" />
                <div className="flex-1">
                  <Label htmlFor="draft" className="text-foreground font-medium cursor-pointer">
                    <div className="flex items-center gap-2 mb-1">
                      <Lock className="w-4 h-4 text-muted-foreground" />
                      Save as Draft
                    </div>
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Keep your card private while you continue working on it
                  </p>
                </div>
              </div>

              {/* Free Public */}
              <div className="flex items-center space-x-3 p-md bg-muted rounded-lg border border-border">
                <RadioGroupItem value="free" id="free" />
                <div className="flex-1">
                  <Label htmlFor="free" className="text-foreground font-medium cursor-pointer">
                    <div className="flex items-center gap-2 mb-1">
                      <Eye className="w-4 h-4 text-brand-collections" />
                      Publish for Free
                    </div>
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Make your card publicly visible for everyone to enjoy
                  </p>
                </div>
              </div>

              {/* Paid */}
              <div className="flex items-center space-x-3 p-md bg-muted rounded-lg border border-border">
                <RadioGroupItem value="paid" id="paid" />
                <div className="flex-1">
                  <Label htmlFor="paid" className="text-foreground font-medium cursor-pointer">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="w-4 h-4 text-brand-currency" />
                      Publish with Price
                    </div>
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Set a price for users to purchase your card
                  </p>
                </div>
              </div>
            </RadioGroup>

            {/* Price Input */}
            {publishType === 'paid' && (
              <div className="mt-lg p-md bg-muted rounded-lg border border-border">
                <Label htmlFor="price" className="text-foreground font-medium mb-2 block">
                  Card Price (USD)
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="price"
                    type="number"
                    min="0.99"
                    step="0.01"
                    placeholder="9.99"
                    value={state.price || ''}
                    onChange={(e) => updateState({ price: parseFloat(e.target.value) || undefined })}
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Recommended: $0.99 - $19.99 for individual cards
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card Settings */}
        <Card className="card-shell">
          <CardContent className="p-lg">
            <h3 className="text-lg font-bold text-foreground mb-lg flex items-center">
              <Upload className="w-5 h-5 mr-2 text-brand-cards" />
              Card Settings
            </h3>

            <div className="space-y-md">
              {/* Visibility */}
              <div className="flex items-center justify-between p-sm bg-muted rounded-lg border border-border">
                <div>
                  <Label className="text-foreground font-medium">Public Visibility</Label>
                  <p className="text-sm text-muted-foreground">Allow others to discover your card</p>
                </div>
                <Switch
                  checked={state.isPublic}
                  onCheckedChange={(checked) => updateState({ isPublic: checked })}
                />
              </div>

              {/* Comments */}
              <div className="flex items-center justify-between p-sm bg-muted rounded-lg border border-border">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-brand-marketplace" />
                  <div>
                    <Label className="text-foreground font-medium">Enable Comments</Label>
                    <p className="text-sm text-muted-foreground">Let users leave feedback</p>
                  </div>
                </div>
                <Switch
                  checked={state.enableComments}
                  onCheckedChange={(checked) => updateState({ enableComments: checked })}
                />
              </div>

              {/* Trading */}
              <div className="flex items-center justify-between p-sm bg-muted rounded-lg border border-border">
                <div className="flex items-center gap-2">
                  <ArrowRightLeft className="w-4 h-4 text-brand-collections" />
                  <div>
                    <Label className="text-foreground font-medium">Allow Trading</Label>
                    <p className="text-sm text-muted-foreground">Enable card trading with others</p>
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
        <Card className="card-elevated lg:col-span-2">
          <CardContent className="p-lg">
            <h3 className="text-xl font-bold text-foreground mb-lg flex items-center">
              <Eye className="w-5 h-5 mr-2 text-brand-cards" />
              Final Review
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
              {/* Card Summary */}
              <div>
                <h4 className="text-foreground font-semibold mb-2">Card Details</h4>
                <div className="text-sm text-foreground space-y-1">
                  <p><span className="text-muted-foreground">Title:</span> {state.cardDetails.title}</p>
                  <p><span className="text-muted-foreground">Type:</span> {state.cardDetails.cardType}</p>
                  <p><span className="text-muted-foreground">Rarity:</span> {state.cardDetails.rarity}</p>
                  {publishType === 'paid' && state.price && (
                    <p><span className="text-muted-foreground">Price:</span> ${state.price}</p>
                  )}
                </div>
              </div>

              {/* Publishing Summary */}
              <div>
                <h4 className="text-foreground font-semibold mb-2">Publishing</h4>
                <div className="text-sm text-foreground space-y-1">
                  <p><span className="text-muted-foreground">Type:</span> {publishType}</p>
                  <p><span className="text-muted-foreground">Visibility:</span> {state.isPublic ? 'Public' : 'Private'}</p>
                  <p><span className="text-muted-foreground">Comments:</span> {state.enableComments ? 'Enabled' : 'Disabled'}</p>
                  <p><span className="text-muted-foreground">Trading:</span> {state.enableTrades ? 'Enabled' : 'Disabled'}</p>
                </div>
              </div>

              {/* Template & Effects */}
              <div>
                <h4 className="text-foreground font-semibold mb-2">Customization</h4>
                <div className="text-sm text-foreground space-y-1">
                  <p><span className="text-muted-foreground">Template:</span> {state.selectedTemplate?.name}</p>
                  <p><span className="text-muted-foreground">Images:</span> {Object.keys(state.images).length} uploaded</p>
                  <p><span className="text-muted-foreground">Effects:</span> {
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
          <Card className="bg-primary/5 border border-primary/20">
            <CardContent className="p-xl">
              <h3 className="text-2xl font-bold text-foreground mb-md">
                Ready to {publishType === 'draft' ? 'Save' : 'Publish'}?
              </h3>
              <p className="text-muted-foreground mb-lg leading-relaxed">
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
                variant={publishType === 'draft' ? 'secondary' : 'default'}
                className="px-xl"
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
                <p className="text-xs text-muted-foreground mt-md">
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