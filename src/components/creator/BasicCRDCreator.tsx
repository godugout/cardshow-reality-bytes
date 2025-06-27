
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  Palette, 
  Type, 
  Image as ImageIcon,
  Download,
  Eye,
  ArrowLeft
} from 'lucide-react';

interface BasicCRDCreatorProps {
  onBack: () => void;
}

export const BasicCRDCreator = ({ onBack }: BasicCRDCreatorProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [cardData, setCardData] = useState({
    title: '',
    subtitle: '',
    imageUrl: '',
    backgroundColor: '#1a1a1a',
    textColor: '#ffffff',
    logoUrl: ''
  });

  const templates = [
    { id: 'sports', name: 'Sports Card', preview: '/placeholder.svg', category: 'Sports' },
    { id: 'gaming', name: 'Gaming Card', preview: '/placeholder.svg', category: 'Gaming' },
    { id: 'fantasy', name: 'Fantasy Card', preview: '/placeholder.svg', category: 'Fantasy' },
    { id: 'minimalist', name: 'Minimalist', preview: '/placeholder.svg', category: 'Modern' },
  ];

  const colorThemes = [
    { name: 'Dark', bg: '#1a1a1a', text: '#ffffff' },
    { name: 'Blue', bg: '#1e3a8a', text: '#ffffff' },
    { name: 'Green', bg: '#166534', text: '#ffffff' },
    { name: 'Purple', bg: '#7c3aed', text: '#ffffff' },
    { name: 'Red', bg: '#dc2626', text: '#ffffff' },
    { name: 'Gold', bg: '#ca8a04', text: '#ffffff' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Mode Selection
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Create CRD</h1>
              <p className="text-gray-400">Simple and fast card creation</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-gray-600 text-gray-300">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button className="bg-[#00C851] hover:bg-[#00A543]">
              <Download className="w-4 h-4 mr-2" />
              Export Card
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Creation Panel */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="template" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-gray-900">
                <TabsTrigger value="template">Template</TabsTrigger>
                <TabsTrigger value="image">Image</TabsTrigger>
                <TabsTrigger value="text">Text</TabsTrigger>
                <TabsTrigger value="style">Style</TabsTrigger>
              </TabsList>

              <TabsContent value="template" className="space-y-4">
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Palette className="w-5 h-5" />
                      Choose Template
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {templates.map((template) => (
                        <div
                          key={template.id}
                          className={`relative cursor-pointer rounded-lg border-2 transition-all ${
                            selectedTemplate === template.id
                              ? 'border-[#00C851] shadow-lg shadow-[#00C851]/20'
                              : 'border-gray-700 hover:border-gray-600'
                          }`}
                          onClick={() => setSelectedTemplate(template.id)}
                        >
                          <img
                            src={template.preview}
                            alt={template.name}
                            className="w-full h-32 object-cover rounded-t-lg"
                          />
                          <div className="p-3 bg-gray-800/80 rounded-b-lg">
                            <p className="text-white font-medium text-sm">{template.name}</p>
                            <p className="text-gray-400 text-xs">{template.category}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="image" className="space-y-4">
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <ImageIcon className="w-5 h-5" />
                      Add Images
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-gray-300">Main Image</Label>
                      <div className="mt-2 border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-gray-500 transition-colors">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-400 mb-2">Drop image here or click to upload</p>
                        <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                          Choose File
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-300">Logo (optional)</Label>
                      <div className="mt-2 border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-gray-500 transition-colors">
                        <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-400 text-sm">Add your logo</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="text" className="space-y-4">
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Type className="w-5 h-5" />
                      Card Text
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-gray-300">Title</Label>
                      <Input
                        value={cardData.title}
                        onChange={(e) => setCardData({ ...cardData, title: e.target.value })}
                        placeholder="Enter card title"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Subtitle</Label>
                      <Input
                        value={cardData.subtitle}
                        onChange={(e) => setCardData({ ...cardData, subtitle: e.target.value })}
                        placeholder="Enter subtitle (optional)"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="style" className="space-y-4">
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">Color Themes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-3">
                      {colorThemes.map((theme, index) => (
                        <div
                          key={index}
                          className="cursor-pointer p-3 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
                          onClick={() => setCardData({ 
                            ...cardData, 
                            backgroundColor: theme.bg, 
                            textColor: theme.text 
                          })}
                        >
                          <div 
                            className="w-full h-8 rounded mb-2"
                            style={{ backgroundColor: theme.bg }}
                          />
                          <p className="text-white text-sm text-center">{theme.name}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Live Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="aspect-[3/4] rounded-lg p-6 flex flex-col justify-between"
                  style={{ backgroundColor: cardData.backgroundColor }}
                >
                  <div className="text-center">
                    <div className="w-full h-32 bg-gray-700 rounded-lg mb-4 flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-gray-500" />
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 
                      className="text-xl font-bold mb-2"
                      style={{ color: cardData.textColor }}
                    >
                      {cardData.title || 'Card Title'}
                    </h3>
                    <p 
                      className="text-sm opacity-80"
                      style={{ color: cardData.textColor }}
                    >
                      {cardData.subtitle || 'Subtitle'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-[#00C851] hover:bg-[#00A543]">
                  Save & Continue
                </Button>
                <Button variant="outline" className="w-full border-gray-600 text-gray-300">
                  Save as Template
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
