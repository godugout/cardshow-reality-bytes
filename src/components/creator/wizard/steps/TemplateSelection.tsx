import { useState, useEffect } from 'react';
import { useCardCreationWizard } from '@/hooks/useCardCreationWizard';
import { Template, TEMPLATE_CATEGORIES } from '@/types/cardCreation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Crown, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TemplateSelectionProps {
  wizard: ReturnType<typeof useCardCreationWizard>;
}

// Mock template data - in a real app, this would come from an API
const mockTemplates: Template[] = [
  {
    id: '1',
    name: 'Sports Legend',
    category: 'sports',
    description: 'Perfect for athlete cards with stats and achievements',
    preview_url: '/placeholder.svg',
    is_premium: false,
    price: 0,
    tags: ['athlete', 'stats', 'professional'],
  },
  {
    id: '2',
    name: 'Fantasy Warrior',
    category: 'fantasy',
    description: 'Epic template for fantasy characters and creatures',
    preview_url: '/placeholder.svg',
    is_premium: true,
    price: 4.99,
    tags: ['fantasy', 'warrior', 'magic'],
  },
  {
    id: '3',
    name: 'Sci-Fi Hero',
    category: 'sci-fi',
    description: 'Futuristic design for space-age characters',
    preview_url: '/placeholder.svg',
    is_premium: false,
    price: 0,
    tags: ['sci-fi', 'futuristic', 'technology'],
  },
  {
    id: '4',
    name: 'Gaming Champion',
    category: 'gaming',
    description: 'Gaming-inspired design with dynamic elements',
    preview_url: '/placeholder.svg',
    is_premium: true,
    price: 3.99,
    tags: ['gaming', 'esports', 'champion'],
  },
  {
    id: '5',
    name: 'Artistic Portrait',
    category: 'art',
    description: 'Elegant template for artistic expressions',
    preview_url: '/placeholder.svg',
    is_premium: false,
    price: 0,
    tags: ['art', 'portrait', 'elegant'],
  },
  {
    id: '6',
    name: 'Anime Style',
    category: 'anime',
    description: 'Vibrant anime-inspired card design',
    preview_url: '/placeholder.svg',
    is_premium: true,
    price: 2.99,
    tags: ['anime', 'manga', 'vibrant'],
  },
];

export const TemplateSelection = ({ wizard }: TemplateSelectionProps) => {
  const [templates, setTemplates] = useState<Template[]>(mockTemplates);
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>(mockTemplates);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let filtered = templates;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredTemplates(filtered);
  }, [templates, selectedCategory, searchTerm]);

  return (
    <div className="space-y-8 pb-24">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Choose Your Template
        </h2>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
          Select a template that matches your vision. You can customize everything later.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
            className={cn(
              selectedCategory === 'all' 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            All
          </Button>
          {TEMPLATE_CATEGORIES.map((category) => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.value)}
              className={cn(
                selectedCategory === category.value 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {category.icon} {category.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card
            key={template.id}
            className={cn(
              "card-shell hover:border-primary/50 transition-all duration-200 cursor-pointer group hover:shadow-hover",
              wizard.state.selectedTemplate?.id === template.id && "border-primary bg-primary/5"
            )}
            onClick={() => wizard.selectTemplate(template)}
          >
            <CardContent className="p-0">
              {/* Template Preview */}
              <div className="aspect-[3/4] bg-gradient-to-br from-muted to-muted/50 rounded-t-lg relative overflow-hidden">
                <img
                  src={template.preview_url}
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
                {template.is_premium && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-yellow-500 text-black font-medium">
                      <Crown className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  </div>
                )}
                {wizard.state.selectedTemplate?.id === template.id && (
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                    <div className="bg-primary rounded-full p-2">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                  </div>
                )}
              </div>

              {/* Template Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {template.name}
                  </h3>
                  {template.is_premium && (
                    <span className="text-brand-currency font-medium text-sm">
                      ${template.price}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {template.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {template.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="text-slate-400 mb-4">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No templates found
          </h3>
          <p className="text-muted-foreground">
            Try adjusting your search terms or category filter.
          </p>
        </div>
      )}
    </div>
  );
};