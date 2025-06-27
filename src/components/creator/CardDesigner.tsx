
import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  Palette, 
  Type, 
  Image as ImageIcon, 
  Layers, 
  Save, 
  Download,
  Upload,
  Undo,
  Redo,
  Eye
} from "lucide-react";
import { useCardCreation } from "@/hooks/useCardCreation";
import { CardPreview } from "./CardPreview";
import { ImageUpload } from "./ImageUpload";
import { TemplateSelector } from "./TemplateSelector";

export const CardDesigner = () => {
  const {
    cardData,
    isLoading,
    uploadProgress,
    updateCardData,
    updateDesignConfig,
    uploadImage,
    saveCard,
    loadTemplate,
  } = useCardCreation();

  const [layers, setLayers] = useState([
    { id: "background", name: "Background", visible: true, opacity: 100 },
    { id: "image", name: "Main Image", visible: true, opacity: 100 },
    { id: "title", name: "Title", visible: true, opacity: 100 },
    { id: "subtitle", name: "Subtitle", visible: true, opacity: 100 },
  ]);

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

  const handleSaveTemplate = async () => {
    await saveCard(false);
  };

  const handleExportCard = async () => {
    await saveCard(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Design Tools */}
      <div className="lg:col-span-1 space-y-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Template Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="template-name" className="text-gray-300">Template Name</Label>
              <Input
                id="template-name"
                value={cardData.title}
                onChange={(e) => updateCardData({ title: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Enter template name"
              />
            </div>

            <div>
              <Label htmlFor="template-description" className="text-gray-300">Description</Label>
              <Textarea
                id="template-description"
                value={cardData.description}
                onChange={(e) => updateCardData({ description: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Describe your template"
              />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="design" className="w-full">
          <TabsList className="grid grid-cols-4 bg-gray-800 border-gray-700">
            <TabsTrigger value="design"><Palette size={16} /></TabsTrigger>
            <TabsTrigger value="text"><Type size={16} /></TabsTrigger>
            <TabsTrigger value="image"><ImageIcon size={16} /></TabsTrigger>
            <TabsTrigger value="layers"><Layers size={16} /></TabsTrigger>
          </TabsList>

          <TabsContent value="design">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-sm">Design Properties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">Background Color</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      type="color"
                      value={cardData.designConfig.backgroundColor}
                      onChange={(e) => updateDesignConfig({ backgroundColor: e.target.value })}
                      className="w-12 h-8 p-0 border-0"
                    />
                    <Input
                      value={cardData.designConfig.backgroundColor}
                      onChange={(e) => updateDesignConfig({ backgroundColor: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-gray-300">Border Radius</Label>
                  <Slider
                    value={[cardData.designConfig.borderRadius]}
                    onValueChange={([value]) => updateDesignConfig({ borderRadius: value })}
                    max={50}
                    step={1}
                    className="mt-2"
                  />
                  <p className="text-sm text-gray-400">{cardData.designConfig.borderRadius}px</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Effects</Label>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(cardData.designConfig.effects).map(([effect, enabled]) => {
                      if (effect === "intensity") return null;
                      return (
                        <Badge
                          key={effect}
                          variant={enabled ? "default" : "outline"}
                          className={`cursor-pointer ${
                            enabled ? "bg-blue-600 text-white" : "border-gray-600 text-gray-400"
                          }`}
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="text">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-sm">Text Properties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">Title Color</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      type="color"
                      value={cardData.designConfig.titleColor}
                      onChange={(e) => updateDesignConfig({ titleColor: e.target.value })}
                      className="w-12 h-8 p-0 border-0"
                    />
                    <Input
                      value={cardData.designConfig.titleColor}
                      onChange={(e) => updateDesignConfig({ titleColor: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-gray-300">Text Position</Label>
                  <Select
                    value={cardData.designConfig.textPosition}
                    onValueChange={(value: 'top' | 'center' | 'bottom') => updateDesignConfig({ textPosition: value })}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top">Top</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="bottom">Bottom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="image">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-sm">Image Settings</CardTitle>
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

          <TabsContent value="layers">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-sm">Layers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {layers.map((layer) => (
                    <div key={layer.id} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                      <div className="flex items-center gap-2">
                        <Eye className={`h-4 w-4 ${layer.visible ? "text-blue-500" : "text-gray-500"}`} />
                        <span className="text-white text-sm">{layer.name}</span>
                      </div>
                      <span className="text-gray-400 text-sm">{layer.opacity}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2">
          <Button onClick={handleSaveTemplate} className="flex-1" disabled={isLoading}>
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? 'Saving...' : 'Save Template'}
          </Button>
          <Button onClick={handleExportCard} variant="outline" className="flex-1" disabled={isLoading}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Card Preview */}
      <div className="lg:col-span-2">
        <Card className="bg-gray-800 border-gray-700 h-fit">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              Card Preview
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Undo className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Redo className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardPreview cardData={cardData} />

            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                Template: {cardData.title || "Untitled"}
              </p>
              {cardData.description && (
                <p className="text-gray-400 text-sm">
                  {cardData.description}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
