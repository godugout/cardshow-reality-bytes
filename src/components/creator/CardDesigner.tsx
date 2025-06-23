
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
import { useToast } from "@/hooks/use-toast";

export const CardDesigner = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [designData, setDesignData] = useState({
    name: "",
    description: "",
    category: "",
    price: 0,
    backgroundImage: "",
    title: "",
    subtitle: "",
    titleColor: "#FFFFFF",
    subtitleColor: "#CCCCCC",
    backgroundColor: "#1F2937",
    borderRadius: 12,
    textPosition: "bottom",
    effects: {
      holographic: false,
      foil: false,
      chrome: false,
      intensity: 0.5,
    },
  });

  const [layers, setLayers] = useState([
    { id: "background", name: "Background", visible: true, opacity: 100 },
    { id: "image", name: "Main Image", visible: true, opacity: 100 },
    { id: "title", name: "Title", visible: true, opacity: 100 },
    { id: "subtitle", name: "Subtitle", visible: true, opacity: 100 },
  ]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setDesignData(prev => ({
          ...prev,
          backgroundImage: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveTemplate = () => {
    if (!designData.name || !designData.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in template name and category",
        variant: "destructive",
      });
      return;
    }

    // TODO: Save to database
    toast({
      title: "Template Saved",
      description: "Your card template has been saved successfully!",
    });
  };

  const handleExportCard = () => {
    // TODO: Export card as image
    toast({
      title: "Export Started",
      description: "Your card is being exported...",
    });
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
                value={designData.name}
                onChange={(e) => setDesignData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Enter template name"
              />
            </div>

            <div>
              <Label htmlFor="template-description" className="text-gray-300">Description</Label>
              <Textarea
                id="template-description"
                value={designData.description}
                onChange={(e) => setDesignData(prev => ({ ...prev, description: e.target.value }))}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Describe your template"
              />
            </div>

            <div>
              <Label className="text-gray-300">Category</Label>
              <Select
                value={designData.category}
                onValueChange={(value) => setDesignData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="gaming">Gaming</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="art">Art</SelectItem>
                  <SelectItem value="fantasy">Fantasy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="template-price" className="text-gray-300">Price ($)</Label>
              <Input
                id="template-price"
                type="number"
                value={designData.price}
                onChange={(e) => setDesignData(prev => ({ ...prev, price: Number(e.target.value) }))}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="0.00"
                min="0"
                step="0.01"
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
                      value={designData.backgroundColor}
                      onChange={(e) => setDesignData(prev => ({ ...prev, backgroundColor: e.target.value }))}
                      className="w-12 h-8 p-0 border-0"
                    />
                    <Input
                      value={designData.backgroundColor}
                      onChange={(e) => setDesignData(prev => ({ ...prev, backgroundColor: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-gray-300">Border Radius</Label>
                  <Slider
                    value={[designData.borderRadius]}
                    onValueChange={([value]) => setDesignData(prev => ({ ...prev, borderRadius: value }))}
                    max={50}
                    step={1}
                    className="mt-2"
                  />
                  <p className="text-sm text-gray-400">{designData.borderRadius}px</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Effects</Label>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(designData.effects).map(([effect, enabled]) => {
                      if (effect === "intensity") return null;
                      return (
                        <Badge
                          key={effect}
                          variant={enabled ? "default" : "outline"}
                          className={`cursor-pointer ${
                            enabled ? "bg-blue-600 text-white" : "border-gray-600 text-gray-400"
                          }`}
                          onClick={() => setDesignData(prev => ({
                            ...prev,
                            effects: {
                              ...prev.effects,
                              [effect]: !enabled
                            }
                          }))}
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
                  <Label className="text-gray-300">Title</Label>
                  <Input
                    value={designData.title}
                    onChange={(e) => setDesignData(prev => ({ ...prev, title: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Card title"
                  />
                </div>

                <div>
                  <Label className="text-gray-300">Subtitle</Label>
                  <Input
                    value={designData.subtitle}
                    onChange={(e) => setDesignData(prev => ({ ...prev, subtitle: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Card subtitle"
                  />
                </div>

                <div>
                  <Label className="text-gray-300">Title Color</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      type="color"
                      value={designData.titleColor}
                      onChange={(e) => setDesignData(prev => ({ ...prev, titleColor: e.target.value }))}
                      className="w-12 h-8 p-0 border-0"
                    />
                    <Input
                      value={designData.titleColor}
                      onChange={(e) => setDesignData(prev => ({ ...prev, titleColor: e.target.value }))}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-gray-300">Text Position</Label>
                  <Select
                    value={designData.textPosition}
                    onValueChange={(value) => setDesignData(prev => ({ ...prev, textPosition: value }))}
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
              <CardContent className="space-y-4">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                  variant="outline"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Background Image
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {designData.backgroundImage && (
                  <div className="space-y-2">
                    <img
                      src={designData.backgroundImage}
                      alt="Background preview"
                      className="w-full h-20 object-cover rounded border border-gray-600"
                    />
                    <Button
                      onClick={() => setDesignData(prev => ({ ...prev, backgroundImage: "" }))}
                      variant="destructive"
                      size="sm"
                      className="w-full"
                    >
                      Remove Image
                    </Button>
                  </div>
                )}
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
          <Button onClick={handleSaveTemplate} className="flex-1">
            <Save className="mr-2 h-4 w-4" />
            Save Template
          </Button>
          <Button onClick={handleExportCard} variant="outline" className="flex-1">
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
            <div className="flex justify-center">
              <div 
                className="relative w-64 h-80 flex flex-col justify-end p-4 text-white shadow-2xl"
                style={{
                  backgroundColor: designData.backgroundColor,
                  borderRadius: `${designData.borderRadius}px`,
                  backgroundImage: designData.backgroundImage 
                    ? `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url(${designData.backgroundImage})` 
                    : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Effects overlay */}
                {(designData.effects.holographic || designData.effects.foil || designData.effects.chrome) && (
                  <div 
                    className="absolute inset-0 rounded-lg"
                    style={{
                      background: designData.effects.holographic 
                        ? `linear-gradient(45deg, rgba(255,0,255,${designData.effects.intensity * 0.3}), rgba(0,255,255,${designData.effects.intensity * 0.3}))` 
                        : designData.effects.chrome
                        ? `linear-gradient(135deg, rgba(192,192,192,${designData.effects.intensity * 0.5}), rgba(255,255,255,${designData.effects.intensity * 0.3}))`
                        : `linear-gradient(90deg, rgba(255,215,0,${designData.effects.intensity * 0.4}), rgba(255,165,0,${designData.effects.intensity * 0.2}))`,
                      borderRadius: `${designData.borderRadius}px`,
                    }}
                  />
                )}

                {/* Text content */}
                <div className={`relative z-10 ${
                  designData.textPosition === "top" ? "self-start" :
                  designData.textPosition === "center" ? "self-center" :
                  "self-end"
                }`}>
                  {designData.title && (
                    <h2 
                      className="text-xl font-bold mb-1"
                      style={{ color: designData.titleColor }}
                    >
                      {designData.title}
                    </h2>
                  )}
                  {designData.subtitle && (
                    <p 
                      className="text-sm opacity-90"
                      style={{ color: designData.subtitleColor }}
                    >
                      {designData.subtitle}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                Template: {designData.name || "Untitled"}
              </p>
              <p className="text-gray-400 text-sm">
                Category: {designData.category || "None"}
              </p>
              {designData.price > 0 && (
                <p className="text-green-500 text-sm font-medium">
                  Price: ${designData.price.toFixed(2)}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
