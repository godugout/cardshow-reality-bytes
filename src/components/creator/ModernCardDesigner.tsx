
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  ChevronLeft,
  ChevronRight,
  Minimize2,
  Maximize2
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

  const [activeMode, setActiveMode] = useState<'design' | 'effects'>('design');
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const [focusMode, setFocusMode] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Card Designer</h1>
              <p className="text-muted-foreground">Create stunning digital trading cards</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="rounded-2xl border-0 bg-primary/10 text-primary">
            {cardData.creationMode === 'basic' ? 'Basic Mode' : 'Studio Mode'}
          </Badge>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setFocusMode(!focusMode)}
            className="rounded-2xl border-0 bg-background/50 backdrop-blur-sm"
          >
            {focusMode ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      <div className="flex gap-8 h-[calc(100vh-12rem)]">
        {/* Main Preview Area - 70% */}
        <div className="flex-1 flex flex-col">
          {/* Quick Content Section */}
          <Card className="mb-6 bg-card/50 backdrop-blur-xl border-0 rounded-3xl">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="title" className="text-base font-semibold mb-3 block">
                    <Type className="w-4 h-4 inline mr-2" />
                    Card Title
                  </Label>
                  <Input
                    id="title"
                    placeholder="Enter an amazing title..."
                    value={cardData.title}
                    onChange={(e) => updateCardData({ title: e.target.value })}
                    className="h-14 text-lg rounded-2xl border-0 bg-background/80 backdrop-blur-sm"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description" className="text-base font-semibold mb-3 block">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Tell the story of your card..."
                    value={cardData.description}
                    onChange={(e) => updateCardData({ description: e.target.value })}
                    className="rounded-2xl border-0 bg-background/80 backdrop-blur-sm resize-none"
                    rows={2}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Live Preview */}
          <Card className="flex-1 bg-gradient-to-br from-card/30 to-card/10 backdrop-blur-xl border-0 rounded-3xl overflow-hidden">
            <CardContent className="p-8 h-full flex items-center justify-center">
              <div className="text-center">
                <div className="mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Eye className="w-5 h-5 text-primary" />
                    <h3 className="text-xl font-bold text-foreground">Live Preview</h3>
                  </div>
                  <p className="text-muted-foreground">See your changes in real-time</p>
                </div>
                <div className="transform scale-110">
                  <CardPreview cardData={cardData} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Control Panel - 30% */}
        <div className={`transition-all duration-300 ${panelCollapsed ? 'w-16' : 'w-96'} flex flex-col`}>
          {/* Panel Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPanelCollapsed(!panelCollapsed)}
            className="self-end mb-4 w-12 h-12 rounded-2xl bg-background/50 backdrop-blur-sm border-0"
          >
            {panelCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </Button>

          {!panelCollapsed && (
            <>
              {/* Mode Selector */}
              <div className="mb-6">
                <div className="flex bg-background/50 backdrop-blur-sm rounded-2xl p-2 border-0">
                  <Button
                    variant={activeMode === 'design' ? 'default' : 'ghost'}
                    onClick={() => setActiveMode('design')}
                    className="flex-1 rounded-2xl border-0 font-semibold"
                  >
                    <Palette className="w-4 h-4 mr-2" />
                    Design
                  </Button>
                  <Button
                    variant={activeMode === 'effects' ? 'default' : 'ghost'}
                    onClick={() => setActiveMode('effects')}
                    className="flex-1 rounded-2xl border-0 font-semibold"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Effects
                  </Button>
                </div>
              </div>

              {/* Controls Content */}
              <Card className="flex-1 bg-card/50 backdrop-blur-xl border-0 rounded-3xl overflow-hidden">
                <CardContent className="p-6 h-full overflow-y-auto">
                  {activeMode === 'design' ? (
                    <div className="space-y-8">
                      {/* Image Upload Section */}
                      <div>
                        <Label className="text-base font-semibold mb-4 block">
                          <Image className="w-4 h-4 inline mr-2" />
                          Card Image
                        </Label>
                        {!cardData.imageUrl ? (
                          <div className="border-2 border-dashed border-primary/20 rounded-3xl p-8 text-center bg-primary/5 hover:bg-primary/10 transition-colors">
                            <Upload className="w-12 h-12 mx-auto mb-4 text-primary" />
                            <p className="text-foreground mb-4 font-medium">
                              Drop your image here
                            </p>
                            <p className="text-muted-foreground text-sm mb-4">
                              or click to browse
                            </p>
                            <Button asChild variant="outline" className="rounded-2xl border-0 bg-background/50">
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
                                className="w-full h-48 object-cover rounded-2xl"
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  className="rounded-2xl"
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
                            <div className="bg-background/50 rounded-full h-3">
                              <div 
                                className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                              />
                            </div>
                            <p className="text-sm text-muted-foreground mt-2 text-center">
                              Uploading... {uploadProgress}%
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Design Controls */}
                      <div className="space-y-6">
                        <div>
                          <Label className="text-base font-semibold mb-4 block">Colors</Label>
                          <div className="space-y-4">
                            <div>
                              <Label className="text-sm text-muted-foreground mb-2 block">Background</Label>
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  <input
                                    type="color"
                                    value={cardData.designConfig.backgroundColor}
                                    onChange={(e) => updateDesignConfig({ backgroundColor: e.target.value })}
                                    className="w-12 h-12 rounded-2xl border-0 cursor-pointer"
                                  />
                                </div>
                                <Input
                                  value={cardData.designConfig.backgroundColor}
                                  onChange={(e) => updateDesignConfig({ backgroundColor: e.target.value })}
                                  className="flex-1 rounded-2xl border-0 bg-background/50"
                                />
                              </div>
                            </div>

                            <div>
                              <Label className="text-sm text-muted-foreground mb-2 block">Text Color</Label>
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  <input
                                    type="color"
                                    value={cardData.designConfig.titleColor}
                                    onChange={(e) => updateDesignConfig({ titleColor: e.target.value })}
                                    className="w-12 h-12 rounded-2xl border-0 cursor-pointer"
                                  />
                                </div>
                                <Input
                                  value={cardData.designConfig.titleColor}
                                  onChange={(e) => updateDesignConfig({ titleColor: e.target.value })}
                                  className="flex-1 rounded-2xl border-0 bg-background/50"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label className="text-base font-semibold mb-4 block">Layout</Label>
                          <div className="space-y-4">
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <Label className="text-sm text-muted-foreground">Border Radius</Label>
                                <span className="text-sm font-medium text-foreground">
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
                                    className="capitalize rounded-2xl border-0 bg-background/50"
                                  >
                                    {position}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="text-center pb-4">
                        <Sparkles className="w-8 h-8 mx-auto mb-2 text-primary" />
                        <h3 className="text-lg font-bold text-foreground mb-1">Special Effects</h3>
                        <p className="text-sm text-muted-foreground">Add premium effects to your card</p>
                      </div>

                      <div className="space-y-6">
                        <div className="p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
                          <div className="flex items-center justify-between mb-3">
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

                        <div className="p-4 rounded-2xl bg-gradient-to-r from-secondary/10 to-secondary/5 border border-secondary/20">
                          <div className="flex items-center justify-between mb-3">
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

                        <div className="p-4 rounded-2xl bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20">
                          <div className="flex items-center justify-between mb-3">
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
                          <div className="p-4 rounded-2xl bg-background/50 border border-border/50">
                            <div className="flex items-center justify-between mb-3">
                              <Label className="font-semibold text-foreground">Effect Intensity</Label>
                              <span className="text-sm font-medium text-foreground">
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
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <Button
                  variant="outline"
                  onClick={handleSave}
                  disabled={isLoading || !cardData.title.trim()}
                  className="w-full h-14 rounded-2xl border-0 bg-background/50 backdrop-blur-sm font-semibold"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Save Draft
                </Button>
                <Button
                  onClick={handlePublish}
                  disabled={isLoading || !cardData.title.trim()}
                  className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 font-semibold text-lg"
                >
                  <Rocket className="w-5 h-5 mr-2" />
                  Publish Card
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
