
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
  Settings,
  ArrowLeft
} from 'lucide-react';

export const ModernCardDesigner = () => {
  const {
    cardData,
    isLoading,
    uploadProgress,
    updateCardData,
    updateDesignConfig,
    saveCard,
    uploadImage
  } = useCardCreation();

  const [activeSection, setActiveSection] = useState<'content' | 'design' | 'effects'>('content');

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-foreground">Card Designer</h1>
              <Badge variant="outline" className="text-primary border-primary">
                {cardData.creationMode === 'basic' ? 'Basic Mode' : 'Studio Mode'}
              </Badge>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleSave}
                disabled={isLoading || !cardData.title.trim()}
                className="bg-background text-foreground border-border hover:bg-muted"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button
                onClick={handlePublish}
                disabled={isLoading || !cardData.title.trim()}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Rocket className="w-4 h-4 mr-2" />
                Publish
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-12rem)]">
          {/* Control Panel - Left Side */}
          <div className="col-span-5 space-y-6">
            {/* Navigation Tabs */}
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex space-x-1 bg-muted p-1 rounded-lg">
                  <Button
                    variant={activeSection === 'content' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveSection('content')}
                    className="flex-1 h-10"
                  >
                    <Type className="w-4 h-4 mr-2" />
                    Content
                  </Button>
                  <Button
                    variant={activeSection === 'design' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveSection('design')}
                    className="flex-1 h-10"
                  >
                    <Palette className="w-4 h-4 mr-2" />
                    Design
                  </Button>
                  <Button
                    variant={activeSection === 'effects' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveSection('effects')}
                    className="flex-1 h-10"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Effects
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Control Sections */}
            <Card className="bg-card border-border flex-1">
              <CardContent className="p-6 h-full overflow-y-auto">
                {activeSection === 'content' && (
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="title" className="text-base font-semibold text-foreground mb-3 block">
                        Card Title
                      </Label>
                      <Input
                        id="title"
                        placeholder="Enter card title..."
                        value={cardData.title}
                        onChange={(e) => updateCardData({ title: e.target.value })}
                        className="h-12 bg-background text-foreground border-border"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="description" className="text-base font-semibold text-foreground mb-3 block">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your card..."
                        value={cardData.description}
                        onChange={(e) => updateCardData({ description: e.target.value })}
                        className="bg-background text-foreground border-border resize-none"
                        rows={4}
                      />
                    </div>

                    <Separator />

                    <div>
                      <Label className="text-base font-semibold text-foreground mb-4 block">
                        <Image className="w-4 h-4 inline mr-2" />
                        Card Image
                      </Label>
                      {!cardData.imageUrl ? (
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center bg-muted/20 hover:bg-muted/30 transition-colors">
                          <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-foreground mb-2 font-medium">
                            Upload an image for your card
                          </p>
                          <p className="text-muted-foreground text-sm mb-4">
                            JPG, PNG, or GIF up to 10MB
                          </p>
                          <Button asChild variant="outline" className="bg-background text-foreground border-border">
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
                          <div className="relative group">
                            <img
                              src={cardData.imageUrl}
                              alt="Card preview"
                              className="w-full h-48 object-cover rounded-lg border border-border"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                              <Button
                                variant="secondary"
                                size="sm"
                                asChild
                              >
                                <label htmlFor="image-replace" className="cursor-pointer">
                                  Replace Image
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
                        </div>
                      )}
                      {uploadProgress > 0 && uploadProgress < 100 && (
                        <div className="mt-4">
                          <div className="bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                          <p className="text-sm text-muted-foreground mt-2 text-center">
                            Uploading... {uploadProgress}%
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeSection === 'design' && (
                  <div className="space-y-6">
                    <div>
                      <Label className="text-base font-semibold text-foreground mb-4 block">Colors</Label>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm text-muted-foreground mb-2 block">Background Color</Label>
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              value={cardData.designConfig.backgroundColor}
                              onChange={(e) => updateDesignConfig({ backgroundColor: e.target.value })}
                              className="w-12 h-12 rounded-lg border border-border cursor-pointer"
                            />
                            <Input
                              value={cardData.designConfig.backgroundColor}
                              onChange={(e) => updateDesignConfig({ backgroundColor: e.target.value })}
                              className="flex-1 bg-background text-foreground border-border"
                            />
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm text-muted-foreground mb-2 block">Text Color</Label>
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              value={cardData.designConfig.titleColor}
                              onChange={(e) => updateDesignConfig({ titleColor: e.target.value })}
                              className="w-12 h-12 rounded-lg border border-border cursor-pointer"
                            />
                            <Input
                              value={cardData.designConfig.titleColor}
                              onChange={(e) => updateDesignConfig({ titleColor: e.target.value })}
                              className="flex-1 bg-background text-foreground border-border"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <Label className="text-base font-semibold text-foreground mb-4 block">Layout</Label>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <Label className="text-sm text-muted-foreground">Border Radius</Label>
                            <span className="text-sm font-medium text-foreground bg-muted px-2 py-1 rounded">
                              {cardData.designConfig.borderRadius}px
                            </span>
                          </div>
                          <Slider
                            value={[cardData.designConfig.borderRadius]}
                            onValueChange={([value]) => updateDesignConfig({ borderRadius: value })}
                            max={32}
                            step={2}
                            className="w-full"
                          />
                        </div>

                        <div>
                          <Label className="text-sm text-muted-foreground mb-3 block">Text Position</Label>
                          <div className="grid grid-cols-3 gap-2">
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
                    </div>
                  </div>
                )}

                {activeSection === 'effects' && (
                  <div className="space-y-6">
                    <div className="text-center pb-4">
                      <h3 className="text-lg font-bold text-foreground mb-2">Special Effects</h3>
                      <p className="text-sm text-muted-foreground">Add premium effects to make your card stand out</p>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-muted/20 border border-border">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="font-semibold text-foreground">Holographic Effect</Label>
                            <p className="text-xs text-muted-foreground">Rainbow shimmer effect</p>
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
                      </div>

                      <div className="p-4 rounded-lg bg-muted/20 border border-border">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="font-semibold text-foreground">Foil Effect</Label>
                            <p className="text-xs text-muted-foreground">Metallic foil shine</p>
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
                      </div>

                      <div className="p-4 rounded-lg bg-muted/20 border border-border">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="font-semibold text-foreground">Chrome Effect</Label>
                            <p className="text-xs text-muted-foreground">Mirror chrome reflection</p>
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
                      </div>

                      {(cardData.designConfig.effects.holographic || 
                        cardData.designConfig.effects.foil || 
                        cardData.designConfig.effects.chrome) && (
                        <>
                          <Separator />
                          <div className="p-4 rounded-lg bg-muted/20 border border-border">
                            <div className="flex items-center justify-between mb-3">
                              <Label className="font-semibold text-foreground">Effect Intensity</Label>
                              <span className="text-sm font-medium text-foreground bg-muted px-2 py-1 rounded">
                                {Math.round(cardData.designConfig.effects.intensity * 100)}%
                              </span>
                            </div>
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
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Live Preview - Right Side, Sticky */}
          <div className="col-span-7">
            <div className="sticky top-6">
              <Card className="bg-card border-border">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Eye className="w-5 h-5 text-primary" />
                    Live Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center p-8 min-h-[600px]">
                  <div className="transform scale-110">
                    <CardPreview cardData={cardData} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
