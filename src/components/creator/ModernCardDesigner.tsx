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
import { useCanvasCustomizer } from './hooks/useCanvasCustomizer';
import { CardPreview } from './CardPreview';
import { CanvasCustomizer } from './components/CanvasCustomizer';
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
  Grid3x3
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

  const { getCanvasStyles, getGridStyles } = useCanvasCustomizer();

  const [activeSection, setActiveSection] = useState<'content' | 'design' | 'effects' | 'canvas'>('content');

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
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-slate-900">Card Designer</h1>
              <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                {cardData.creationMode === 'basic' ? 'Basic Mode' : 'Studio Mode'}
              </Badge>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleSave}
                disabled={isLoading || !cardData.title.trim()}
                className="bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button
                onClick={handlePublish}
                disabled={isLoading || !cardData.title.trim()}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                <Rocket className="w-4 h-4 mr-2" />
                Publish
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <div className="flex gap-6 h-[calc(100vh-12rem)]">
          {/* Left Sidebar - Controls */}
          <div className="w-80 flex flex-col space-y-4">
            {/* Navigation Tabs */}
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex bg-slate-100 p-1 rounded-lg">
                  <Button
                    variant={activeSection === 'content' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveSection('content')}
                    className={`flex-1 h-9 text-xs ${
                      activeSection === 'content' 
                        ? 'bg-white text-slate-900 shadow-sm' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Type className="w-3 h-3 mr-1" />
                    Content
                  </Button>
                  <Button
                    variant={activeSection === 'design' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveSection('design')}
                    className={`flex-1 h-9 text-xs ${
                      activeSection === 'design' 
                        ? 'bg-white text-slate-900 shadow-sm' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Palette className="w-3 h-3 mr-1" />
                    Design
                  </Button>
                  <Button
                    variant={activeSection === 'effects' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveSection('effects')}
                    className={`flex-1 h-9 text-xs ${
                      activeSection === 'effects' 
                        ? 'bg-white text-slate-900 shadow-sm' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    Effects
                  </Button>
                  <Button
                    variant={activeSection === 'canvas' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveSection('canvas')}
                    className={`flex-1 h-9 text-xs ${
                      activeSection === 'canvas' 
                        ? 'bg-white text-slate-900 shadow-sm' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Grid3x3 className="w-3 h-3 mr-1" />
                    Canvas
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Control Sections */}
            <Card className="bg-white border-slate-200 shadow-sm flex-1">
              <CardContent className="p-6 h-full overflow-y-auto">
                {activeSection === 'content' && (
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="title" className="text-sm font-semibold text-slate-900 mb-2 block">
                        Card Title
                      </Label>
                      <Input
                        id="title"
                        placeholder="Enter card title..."
                        value={cardData.title}
                        onChange={(e) => updateCardData({ title: e.target.value })}
                        className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="description" className="text-sm font-semibold text-slate-900 mb-2 block">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your card..."
                        value={cardData.description}
                        onChange={(e) => updateCardData({ description: e.target.value })}
                        className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 resize-none"
                        rows={4}
                      />
                    </div>

                    <Separator className="bg-slate-200" />

                    <div>
                      <Label className="text-sm font-semibold text-slate-900 mb-3 block">
                        <Image className="w-4 h-4 inline mr-2" />
                        Card Image
                      </Label>
                      {!cardData.imageUrl ? (
                        <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center bg-slate-50 hover:bg-slate-100 transition-colors">
                          <Upload className="w-10 h-10 mx-auto mb-3 text-slate-400" />
                          <p className="text-slate-700 mb-1 font-medium text-sm">
                            Upload an image for your card
                          </p>
                          <p className="text-slate-500 text-xs mb-3">
                            JPG, PNG, or GIF up to 10MB
                          </p>
                          <Button asChild variant="outline" size="sm" className="bg-white border-slate-300 text-slate-700 hover:bg-slate-50">
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
                        <div className="space-y-3">
                          <div className="relative group">
                            <img
                              src={cardData.imageUrl}
                              alt="Card preview"
                              className="w-full h-32 object-cover rounded-lg border border-slate-200"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                              <Button
                                variant="secondary"
                                size="sm"
                                asChild
                                className="bg-white/90 text-slate-900 hover:bg-white"
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
                        <div className="mt-3">
                          <div className="bg-slate-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                          <p className="text-xs text-slate-600 mt-2 text-center">
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
                      <Label className="text-sm font-semibold text-slate-900 mb-3 block">Colors</Label>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-xs text-slate-600 mb-2 block">Background Color</Label>
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              value={cardData.designConfig.backgroundColor}
                              onChange={(e) => updateDesignConfig({ backgroundColor: e.target.value })}
                              className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer"
                            />
                            <Input
                              value={cardData.designConfig.backgroundColor}
                              onChange={(e) => updateDesignConfig({ backgroundColor: e.target.value })}
                              className="flex-1 bg-white border-slate-200 text-slate-900"
                            />
                          </div>
                        </div>

                        <div>
                          <Label className="text-xs text-slate-600 mb-2 block">Text Color</Label>
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              value={cardData.designConfig.titleColor}
                              onChange={(e) => updateDesignConfig({ titleColor: e.target.value })}
                              className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer"
                            />
                            <Input
                              value={cardData.designConfig.titleColor}
                              onChange={(e) => updateDesignConfig({ titleColor: e.target.value })}
                              className="flex-1 bg-white border-slate-200 text-slate-900"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-slate-200" />

                    <div>
                      <Label className="text-sm font-semibold text-slate-900 mb-3 block">Layout</Label>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label className="text-xs text-slate-600">Border Radius</Label>
                            <span className="text-xs font-medium text-slate-900 bg-slate-100 px-2 py-1 rounded">
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
                          <Label className="text-xs text-slate-600 mb-2 block">Text Position</Label>
                          <div className="grid grid-cols-3 gap-2">
                            {(['top', 'center', 'bottom'] as const).map((position) => (
                              <Button
                                key={position}
                                variant={cardData.designConfig.textPosition === position ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => updateDesignConfig({ textPosition: position })}
                                className={`capitalize text-xs ${
                                  cardData.designConfig.textPosition === position
                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                                }`}
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
                  <div className="space-y-4">
                    <div className="text-center pb-3">
                      <h3 className="text-sm font-bold text-slate-900 mb-1">Special Effects</h3>
                      <p className="text-xs text-slate-600">Add premium effects to make your card stand out</p>
                    </div>

                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="font-semibold text-slate-900 text-sm">Holographic Effect</Label>
                            <p className="text-xs text-slate-600">Rainbow shimmer effect</p>
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

                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="font-semibold text-slate-900 text-sm">Foil Effect</Label>
                            <p className="text-xs text-slate-600">Metallic foil shine</p>
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

                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="font-semibold text-slate-900 text-sm">Chrome Effect</Label>
                            <p className="text-xs text-slate-600">Mirror chrome reflection</p>
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
                          <Separator className="bg-slate-200" />
                          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                            <div className="flex items-center justify-between mb-2">
                              <Label className="font-semibold text-slate-900 text-sm">Effect Intensity</Label>
                              <span className="text-xs font-medium text-slate-900 bg-slate-200 px-2 py-1 rounded">
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

                {activeSection === 'canvas' && <CanvasCustomizer />}
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Live Preview with Canvas Background */}
          <div className="flex-1">
            <Card className="bg-white border-slate-200 shadow-sm h-full">
              <CardHeader className="pb-4 border-b border-slate-100">
                <CardTitle className="flex items-center gap-2 text-slate-900 text-lg">
                  <Eye className="w-5 h-5 text-blue-600" />
                  Live Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-start justify-center p-0 h-full relative overflow-hidden">
                {/* Canvas Background with Grid */}
                <div 
                  className="absolute inset-0"
                  style={getCanvasStyles()}
                >
                  {/* Grid Overlay */}
                  <div 
                    className="absolute inset-0"
                    style={getGridStyles()}
                  />
                </div>
                
                {/* Card Preview */}
                <div className="relative z-10 p-8 flex items-start justify-center w-full h-full">
                  <div className="transform scale-110 mt-8">
                    <CardPreview cardData={cardData} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
