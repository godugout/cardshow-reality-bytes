
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  Star, 
  Download, 
  DollarSign,
  Heart,
  Layers,
  Palette,
  Image as ImageIcon,
  Type,
  Sparkles
} from 'lucide-react';

export const CRDElementsMarketplace = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Elements', icon: Layers },
    { id: 'frame', name: 'Frames', icon: Layers },
    { id: 'background', name: 'Backgrounds', icon: ImageIcon },
    { id: 'logo', name: 'Logos', icon: Sparkles },
    { id: 'color_theme', name: 'Color Themes', icon: Palette },
    { id: 'effect', name: 'Effects', icon: Sparkles },
  ];

  const mockElements = [
    {
      id: '1',
      name: 'Holographic Frame Gold',
      category: 'frame',
      price: 299,
      isFree: false,
      rating: 4.8,
      downloads: 1247,
      previewUrl: '/placeholder.svg',
      creator: 'ProDesigner',
      tags: ['premium', 'holographic', 'gold']
    },
    {
      id: '2',
      name: 'Cyberpunk Background',
      category: 'background',
      price: 0,
      isFree: true,
      rating: 4.6,
      downloads: 3421,
      previewUrl: '/placeholder.svg',
      creator: 'FuturisticArt',
      tags: ['free', 'cyberpunk', 'neon']
    },
    {
      id: '3',
      name: 'Sports Team Logo Pack',
      category: 'logo',
      price: 599,
      isFree: false,
      rating: 4.9,
      downloads: 892,
      previewUrl: '/placeholder.svg',
      creator: 'SportDesign',
      tags: ['sports', 'team', 'pack']
    },
    {
      id: '4',
      name: 'Gradient Color Themes',
      category: 'color_theme',
      price: 0,
      isFree: true,
      rating: 4.4,
      downloads: 2156,
      previewUrl: '/placeholder.svg',
      creator: 'ColorMaster',
      tags: ['free', 'gradient', 'modern']
    }
  ];

  const filteredElements = mockElements.filter(element => {
    const matchesSearch = element.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         element.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || element.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">CRD Elements Marketplace</h2>
          <p className="text-gray-400">Discover and download premium CRD elements</p>
        </div>
        <Button className="bg-[#00C851] hover:bg-[#00A543]">
          Upload Element
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search elements, creators, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-900 border-gray-700 text-white"
          />
        </div>
        <Button variant="outline" className="border-gray-600 text-gray-300">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-gray-900">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                {category.name}
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredElements.map((element) => (
              <Card key={element.id} className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-colors group">
                <CardHeader className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={element.previewUrl}
                      alt={element.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      {element.isFree && (
                        <Badge className="bg-green-500 text-white">Free</Badge>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="bg-black/50 hover:bg-black/70 text-white p-2"
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="text-white font-semibold text-sm line-clamp-1">
                      {element.name}
                    </h3>
                    <p className="text-gray-400 text-xs">by {element.creator}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-gray-300">{element.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-400">
                        <Download className="w-3 h-3" />
                        <span>{element.downloads}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {element.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-gray-800 text-gray-300">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1">
                      {element.isFree ? (
                        <span className="text-green-500 font-semibold text-sm">Free</span>
                      ) : (
                        <>
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <span className="text-white font-semibold">
                            {(element.price / 100).toFixed(2)}
                          </span>
                        </>
                      )}
                    </div>
                    <Button 
                      size="sm" 
                      className={element.isFree 
                        ? "bg-green-600 hover:bg-green-700" 
                        : "bg-[#00C851] hover:bg-[#00A543]"
                      }
                    >
                      <Download className="w-3 h-3 mr-1" />
                      {element.isFree ? 'Download' : 'Purchase'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredElements.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No elements found</h3>
          <p className="text-gray-400">Try adjusting your search or browse different categories</p>
        </div>
      )}
    </div>
  );
};
