
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useCardCreation } from '@/hooks/useCardCreation';
import { CardPreview } from './CardPreview';
import { 
  Upload, 
  Palette, 
  Sparkles, 
  Eye, 
  Save, 
  Rocket,
  Image,
  Type,
  Layers
} from 'lucide-react';

export const CardDesigner = () => {
  const {
    cardData,
    isLoading,
    uploadProgress,
    updateCardData,
    updateDesignConfig,
    saveCard,
    uploadImage
  } = useCardCreation();

  const [activeTab, setActiveTab] = useState('content');

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      updateCardData({ imageFile: file });
      const url = await uploadImage(file);
      if (url) {
        updateCardData({ imageUrl: url });
      }
    }
  };

  const handleSave = () => saveCard(false);
  const handlePublish = () => saveCard(true);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      {/* Design Controls */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Card Designer</h2>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {cardData.creationMode === 'basic' ? 'Basic Mode' : 'Studio Mode'}
            </Badge>
            <Button variant="outline" size="sm" onClick={() => updateCardData({ 
              creationMode: cardData.creationMode === 'basic' ? 'studio' : 'basic' 
            })}>
              Switch Mode
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Type className="w-4 h-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="image" className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              Image
            </TabsTrigger>
            <TabsTrigger value="design" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Design
            </TabsTrigger>
            <TabsTrigger value="effects" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Effects
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4 mt-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Card Title</Label>
                <Input
                  id="title"
                  placeholder="Enter card title..."
                  value={cardData.title}
                  onChange={(e) => updateCardData({ title: e.target.value })}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your card..."
                  value={cardData.description}
                  onChange={(e) => updateCardData({ description: e.target.value })}
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="image" className="space-y-4 mt-6">
            <div>
              <Label>Card Image</Label>
              <div className="mt-2">
                {!cardData.imageUrl ? (
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">
                      Upload an image for your card
                    </p>
                    <Button asChild variant="outline">
                      <label htmlFor="image-upload" className="cursor-pointer">
                        Choose Image
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative">
                      <img
                        src={cardData.imageUrl}
                        alt="Card preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        variant="secondary"
                        size="sm"
                        className="absolute top-2 right-2"
                        asChild
                      >
                        <label htmlFor="image-replace" className="cursor-pointer">
                          Replace
                          <input
                            id="image-replace"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                      </Button>
                    </div>
                  </div>
                )}
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mt-2">
                    <div className="bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Uploading... {uploadProgress}%
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="design" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div>
                <Label>Background Color</Label>
                <div className="flex items-center gap-3 mt-2">
                  <input
                    type="color"
                    value={cardData.designConfig.backgroundColor}
                    onChange={(e) => updateDesignConfig({ backgroundColor: e.target.value })}
                    className="w-12 h-8 rounded border"
                  />
                  <Input
                    value={cardData.designConfig.backgroundColor}
                    onChange={(e) => updateDesignConfig({ backgroundColor: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label>Text Color</Label>
                <div className="flex items-center gap-3 mt-2">
                  <input
                    type="color"
                    value={cardData.designConfig.titleColor}
                    onChange={(e) => updateDesignConfig({ titleColor: e.target.value })}
                    className="w-12 h-8 rounded border"
                  />
                  <Input
                    value={cardData.designConfig.titleColor}
                    onChange={(e) => updateDesignConfig({ titleColor: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label>Border Radius</Label>
                <div className="mt-2">
                  <Slider
                    value={[cardData.designConfig.borderRadius]}
                    onValueChange={([value]) => updateDesignConfig({ borderRadius: value })}
                    max={24}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-sm text-muted-foreground mt-1">
                    {cardData.designConfig.borderRadius}px
                  </div>
                </div>
              </div>

              <div>
                <Label>Text Position</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {(['top', 'center', 'bottom'] as const).map((position) => (
                    <Button
                      key={position}
                      variant={cardData.designConfig.textPosition === position ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateDesignConfig({ textPosition: position })}
                      className="capitalize"
                    >
                      {position}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="effects" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Holographic Effect</Label>
                  <p className="text-sm text-muted-foreground">Add a rainbow shimmer effect</p>
                </div>
                <Switch
                  checked={cardData.designConfig.effects.holographic}
                  onCheckedChange={(checked) => 
                    updateDesignConfig({ 
                      effects: { ...cardData.designConfig.effects, holographic: checked }
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Foil Effect</Label>
                  <p className="text-sm text-muted-foreground">Add a metallic foil shine</p>
                </div>
                <Switch
                  checked={cardData.designConfig.effects.foil}
                  onCheckedChange={(checked) => 
                    updateDesignConfig({ 
                      effects: { ...cardData.designConfig.effects, foil: checked }
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Chrome Effect</Label>
                  <p className="text-sm text-muted-foreground">Add a chrome reflection</p>
                </div>
                <Switch
                  checked={cardData.designConfig.effects.chrome}
                  onCheckedChange={(checked) => 
                    updateDesignConfig({ 
                      effects: { ...cardData.designConfig.effects, chrome: checked }
                    })
                  }
                />
              </div>

              {(cardData.designConfig.effects.holographic || 
                cardData.designConfig.effects.foil || 
                cardData.designConfig.effects.chrome) && (
                <div>
                  <Label>Effect Intensity</Label>
                  <div className="mt-2">
                    <Slider
                      value={[cardData.designConfig.effects.intensity]}
                      onValueChange={([value]) => 
                        updateDesignConfig({ 
                          effects: { ...cardData.designConfig.effects, intensity: value }
                        })
                      }
                      min={0}
                      max={1}
                      step={0.1}
                      className="w-full"
                    />
                    <div className="text-sm text-muted-foreground mt-1">
                      {Math.round(cardData.designConfig.effects.intensity * 100)}%
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleSave}
            disabled={isLoading || !cardData.title.trim()}
            className="flex-1"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          <Button
            onClick={handlePublish}
            disabled={isLoading || !cardData.title.trim()}
            className="flex-1"
          >
            <Rocket className="w-4 h-4 mr-2" />
            Publish Card
          </Button>
        </div>
      </div>

      {/* Live Preview */}
      <div className="lg:sticky lg:top-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Live Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardPreview cardData={cardData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
