
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  Save,
  Upload,
  Eye,
  Palette
} from 'lucide-react';
import { useCardCreation } from '@/hooks/useCardCreation';
import { CardPreview } from './CardPreview';
import { ImageUpload } from './ImageUpload';
import { TemplateSelector } from './TemplateSelector';

interface BasicCRDCreatorProps {
  onBack: () => void;
}

export const BasicCRDCreator = ({ onBack }: BasicCRDCreatorProps) => {
  const {
    cardData,
    isLoading,
    uploadProgress,
    updateCardData,
    updateDesignConfig,
    uploadImage,
    saveCard,
    loadTemplate,
    resetCard,
  } = useCardCreation();

  const [activeTab, setActiveTab] = useState('template');

  const handleImageSelect = async (file: File) => {
    updateCardData({ imageFile: file });
    const url = await uploadImage(file);
    if (url) {
      updateCardData({ imageUrl: url, imageFile: null });
    }
  };

  const handleImageRemove = () => {
    updateCardData({ imageUrl: '', imageFile: null });
  };

  const handleSave = async (publish = false) => {
    const cardId = await saveCard(publish);
    if (cardId && publish) {
      onBack();
    }
  };

  const colorThemes = [
    { name: 'Dark', bg: 'hsl(var(--card))', text: 'hsl(var(--card-foreground))' },
    { name: 'Primary', bg: 'hsl(var(--primary))', text: 'hsl(var(--primary-foreground))' },
    { name: 'Secondary', bg: 'hsl(var(--secondary))', text: 'hsl(var(--secondary-foreground))' },
    { name: 'Muted', bg: 'hsl(var(--muted))', text: 'hsl(var(--muted-foreground))' },
    { name: 'Accent', bg: 'hsl(var(--accent))', text: 'hsl(var(--accent-foreground))' },
    { name: 'Destructive', bg: 'hsl(var(--destructive))', text: 'hsl(var(--destructive-foreground))' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={onBack} 
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Mode Selection
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground font-display">Create CRD</h1>
              <p className="text-muted-foreground">Simple and fast card creation</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setActiveTab('preview')}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button 
              onClick={() => handleSave(false)}
              disabled={isLoading}
              variant="outline"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save Draft'}
            </Button>
            <Button 
              onClick={() => handleSave(true)}
              disabled={isLoading || !cardData.title.trim()}
            >
              <Upload className="w-4 h-4 mr-2" />
              {isLoading ? 'Publishing...' : 'Publish Card'}
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Creation Panel */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5 bg-muted">
                <TabsTrigger value="template">Template</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="image">Image</TabsTrigger>
                <TabsTrigger value="style">Style</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>

              <TabsContent value="template" className="space-y-4">
                <TemplateSelector
                  selectedTemplateId={cardData.templateId}
                  onTemplateSelect={loadTemplate}
                />
              </TabsContent>

              <TabsContent value="content" className="space-y-4">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-card-foreground">Card Content</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-card-foreground">Title *</Label>
                      <Input
                        value={cardData.title}
                        onChange={(e) => updateCardData({ title: e.target.value })}
                        placeholder="Enter card title"
                        className="bg-background border-border text-foreground"
                      />
                    </div>
                    <div>
                      <Label className="text-card-foreground">Description</Label>
                      <Textarea
                        value={cardData.description}
                        onChange={(e) => updateCardData({ description: e.target.value })}
                        placeholder="Enter card description (optional)"
                        rows={3}
                        className="bg-background border-border text-foreground"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="image" className="space-y-4">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-card-foreground">Card Image</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ImageUpload
                      onImageSelect={handleImageSelect}
                      onImageRemove={handleImageRemove}
                      currentImage={cardData.imageUrl}
                      isUploading={uploadProgress > 0 && uploadProgress < 100}
                      uploadProgress={uploadProgress}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="style" className="space-y-4">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-card-foreground">
                      <Palette className="w-5 h-5" />
                      Design & Effects
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Color Themes */}
                    <div>
                      <Label className="mb-3 block text-card-foreground">Color Themes</Label>
                      <div className="grid grid-cols-3 gap-3">
                        {colorThemes.map((theme, index) => (
                          <div
                            key={index}
                            className="cursor-pointer p-3 rounded-lg border border-border hover:border-primary transition-colors"
                            onClick={() => updateDesignConfig({ 
                              backgroundColor: theme.bg, 
                              titleColor: theme.text 
                            })}
                          >
                            <div 
                              className="w-full h-8 rounded mb-2"
                              style={{ backgroundColor: theme.bg }}
                            />
                            <p className="text-sm text-center text-card-foreground">{theme.name}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Border Radius */}
                    <div>
                      <Label className="text-card-foreground">Border Radius</Label>
                      <Slider
                        value={[cardData.designConfig.borderRadius]}
                        onValueChange={([value]) => updateDesignConfig({ borderRadius: value })}
                        max={50}
                        step={1}
                        className="mt-2"
                      />
                      <p className="text-sm text-muted-foreground mt-1">{cardData.designConfig.borderRadius}px</p>
                    </div>

                    {/* Effects */}
                    <div>
                      <Label className="mb-3 block text-card-foreground">Visual Effects</Label>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {Object.entries(cardData.designConfig.effects).map(([effect, enabled]) => {
                          if (effect === "intensity") return null;
                          return (
                            <Badge
                              key={effect}
                              variant={enabled ? "default" : "outline"}
                              className="cursor-pointer transition-colors"
                              onClick={() => updateDesignConfig({
                                effects: {
                                  ...cardData.designConfig.effects,
                                  [effect]: !enabled
                                }
                              })}
                            >
                              {effect}
                            </Badge>
                          );
                        })}
                      </div>

                      {/* Effect Intensity */}
                      {(cardData.designConfig.effects.holographic || cardData.designConfig.effects.foil || cardData.designConfig.effects.chrome) && (
                        <div>
                          <Label className="text-card-foreground">Effect Intensity</Label>
                          <Slider
                            value={[cardData.designConfig.effects.intensity]}
                            onValueChange={([value]) => updateDesignConfig({
                              effects: { ...cardData.designConfig.effects, intensity: value }
                            })}
                            max={1}
                            min={0}
                            step={0.1}
                            className="mt-2"
                          />
                          <p className="text-sm text-muted-foreground mt-1">
                            {Math.round(cardData.designConfig.effects.intensity * 100)}%
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preview" className="space-y-4">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-card-foreground">Live Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardPreview cardData={cardData} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Quick Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <CardPreview cardData={cardData} className="scale-75 origin-top" />
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-sm text-card-foreground">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full"
                  onClick={() => handleSave(true)}
                  disabled={isLoading || !cardData.title.trim()}
                >
                  {isLoading ? 'Publishing...' : 'Publish Card'}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleSave(false)}
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save as Draft'}
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full"
                  onClick={resetCard}
                >
                  Reset Card
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
