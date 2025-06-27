
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  Save, 
  Eye, 
  Layers, 
  Palette, 
  Image as ImageIcon,
  Type,
  Sparkles,
  DollarSign
} from 'lucide-react';

export const CRDElementCreator = () => {
  const [elementType, setElementType] = useState('frame');
  const [elementData, setElementData] = useState({
    name: '',
    description: '',
    category: '',
    price: 0,
    isFree: true,
    isPublic: false,
    tags: ''
  });

  const elementTypes = [
    { id: 'frame', name: 'Frame', icon: Layers, description: 'Create custom card frames' },
    { id: 'background', name: 'Background', icon: ImageIcon, description: 'Design background patterns' },
    { id: 'logo', name: 'Logo', icon: Sparkles, description: 'Create logo elements' },
    { id: 'color_theme', name: 'Color Theme', icon: Palette, description: 'Design color palettes' },
    { id: 'effect', name: 'Effect', icon: Sparkles, description: 'Create visual effects' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">CRD Element Creator</h2>
          <p className="text-gray-400">Create custom elements for the community</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-gray-600 text-gray-300">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button className="bg-[#00C851] hover:bg-[#00A543]">
            <Save className="w-4 h-4 mr-2" />
            Save Element
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Element Type Selection */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Element Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {elementTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <div
                      key={type.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        elementType === type.id
                          ? 'border-[#00C851] bg-[#00C851]/10'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                      onClick={() => setElementType(type.id)}
                    >
                      <Icon className="w-8 h-8 text-[#00C851] mb-2" />
                      <h3 className="text-white font-medium">{type.name}</h3>
                      <p className="text-gray-400 text-sm mt-1">{type.description}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Element Configuration */}
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-900">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="publish">Publish</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Element Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-gray-300">Name</Label>
                    <Input
                      value={elementData.name}
                      onChange={(e) => setElementData({ ...elementData, name: e.target.value })}
                      placeholder="Enter element name"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Description</Label>
                    <Textarea
                      value={elementData.description}
                      onChange={(e) => setElementData({ ...elementData, description: e.target.value })}
                      placeholder="Describe your element"
                      className="bg-gray-800 border-gray-700 text-white"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Category</Label>
                    <Input
                      value={elementData.category}
                      onChange={(e) => setElementData({ ...elementData, category: e.target.value })}
                      placeholder="e.g., Sports, Gaming, Fantasy"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Tags (comma separated)</Label>
                    <Input
                      value={elementData.tags}
                      onChange={(e) => setElementData({ ...elementData, tags: e.target.value })}
                      placeholder="premium, holographic, gold"
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="design" className="space-y-4">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Asset Upload</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-gray-300">Preview Image</Label>
                    <div className="mt-2 border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-gray-500 transition-colors">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400 mb-2">Upload preview image</p>
                      <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                        Choose File
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-300">Element Assets</Label>
                    <div className="mt-2 border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-gray-500 transition-colors">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400 mb-2">Upload design files (SVG, PNG, JSON)</p>
                      <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                        Choose Files
                      </Button>
                    </div>
                    <p className="text-gray-500 text-xs mt-2">
                      Supported formats: SVG, PNG, JSON. Max file size: 10MB
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="publish" className="space-y-4">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Publishing Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-300">Make Public</Label>
                      <p className="text-gray-500 text-sm">Allow others to discover this element</p>
                    </div>
                    <Switch
                      checked={elementData.isPublic}
                      onCheckedChange={(checked) => setElementData({ ...elementData, isPublic: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-300">Free Element</Label>
                      <p className="text-gray-500 text-sm">Make this element free for everyone</p>
                    </div>
                    <Switch
                      checked={elementData.isFree}
                      onCheckedChange={(checked) => setElementData({ ...elementData, isFree: checked })}
                    />
                  </div>

                  {!elementData.isFree && (
                    <div>
                      <Label className="text-gray-300">Price</Label>
                      <div className="flex items-center gap-2 mt-2">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={elementData.price}
                          onChange={(e) => setElementData({ ...elementData, price: parseFloat(e.target.value) || 0 })}
                          placeholder="0.00"
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <p className="text-gray-500 text-xs mt-1">
                        You'll earn 70% of each sale (platform fee: 30%)
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Element Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <ImageIcon className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">Preview will appear here</p>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-white font-medium">
                  {elementData.name || 'Element Name'}
                </h3>
                <p className="text-gray-400 text-sm">
                  {elementData.description || 'Element description will appear here'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white text-sm">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Type:</span>
                <span className="text-white capitalize">{elementType}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Status:</span>
                <span className="text-yellow-500">Draft</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Visibility:</span>
                <span className="text-white">
                  {elementData.isPublic ? 'Public' : 'Private'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Price:</span>
                <span className="text-white">
                  {elementData.isFree ? 'Free' : `$${elementData.price.toFixed(2)}`}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
