import { useState, useEffect } from 'react';
import { useCardCreationWizard } from '@/hooks/useCardCreationWizard';
import { useCardTemplates, CardTemplate } from '@/hooks/useCardTemplates';
import { Template, TEMPLATE_CATEGORIES } from '@/types/cardCreation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Crown, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TemplateSelectionProps {
  wizard: ReturnType<typeof useCardCreationWizard>;
}

// Convert CardTemplate to Template format
const mapCardTemplateToTemplate = (cardTemplate: CardTemplate): Template => ({
  id: cardTemplate.id,
  name: cardTemplate.name,
  category: cardTemplate.category,
  description: cardTemplate.description || '',
  preview_url: cardTemplate.preview_url || '/placeholder.svg',
  is_premium: cardTemplate.is_premium || false,
  price: 0, // Default price for now
  tags: [], // Default empty tags for now
});

export const TemplateSelection = ({ wizard }: TemplateSelectionProps) => {
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch templates from database
  const { data: cardTemplates = [], isLoading } = useCardTemplates(selectedCategory !== 'all' ? selectedCategory : undefined);

  useEffect(() => {
    // Map CardTemplate to Template format
    const templates = cardTemplates.map(mapCardTemplateToTemplate);
    let filtered = templates;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (template.description && template.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredTemplates(filtered);
  }, [cardTemplates, selectedCategory, searchTerm]);

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
            className="pl-10 bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
            className={cn(
              selectedCategory === 'all' 
                ? 'bg-primary text-white' 
                : 'border-slate-600 text-slate-300 hover:text-white'
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
                  ? 'bg-primary text-white' 
                  : 'border-slate-600 text-slate-300 hover:text-white'
              )}
            >
              {category.icon} {category.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-slate-300">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading templates...</span>
          </div>
        </div>
      )}

      {/* Templates Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
          <Card
            key={template.id}
            className={cn(
              "bg-slate-800 border-slate-700 hover:border-primary/50 transition-all duration-200 cursor-pointer group",
              wizard.state.selectedTemplate?.id === template.id && "border-primary bg-slate-700"
            )}
            onClick={() => wizard.selectTemplate(template)}
          >
            <CardContent className="p-0">
              {/* Template Preview */}
              <div className="aspect-[3/4] bg-gradient-to-br from-slate-700 to-slate-800 rounded-t-lg relative overflow-hidden">
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
                  <h3 className="font-semibold text-white group-hover:text-primary transition-colors">
                    {template.name}
                  </h3>
                  {template.is_premium && (
                    <span className="text-yellow-400 font-medium text-sm">
                      ${template.price}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-400 mb-3">
                  {template.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {template.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs bg-slate-700 text-slate-300">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          ))}
        </div>
      )}

      {!isLoading && filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="text-slate-400 mb-4">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
          </div>
          <h3 className="text-xl font-semibold text-slate-300 mb-2">
            No templates found
          </h3>
          <p className="text-slate-400">
            Try adjusting your search terms or category filter.
          </p>
        </div>
      )}
    </div>
  );
};