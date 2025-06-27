
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useCardTemplates, useTemplateCategories } from '@/hooks/useCardTemplates';
import { Check } from 'lucide-react';

interface TemplateSelectorProps {
  selectedTemplateId?: string | null;
  onTemplateSelect: (templateId: string) => void;
}

export const TemplateSelector = ({ selectedTemplateId, onTemplateSelect }: TemplateSelectorProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { data: categories = [], isLoading: categoriesLoading } = useTemplateCategories();
  const { data: templates = [], isLoading: templatesLoading } = useCardTemplates(selectedCategory);

  if (categoriesLoading || templatesLoading) {
    return (
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Choose Template</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-20" />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Choose Template</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Category filters */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
            className={selectedCategory === 'all' ? 'bg-[#00C851] hover:bg-[#00A543]' : ''}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? 'bg-[#00C851] hover:bg-[#00A543]' : ''}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>

        {/* Template grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`relative cursor-pointer rounded-lg border-2 transition-all ${
                selectedTemplateId === template.id
                  ? 'border-[#00C851] shadow-lg shadow-[#00C851]/20'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
              onClick={() => onTemplateSelect(template.id)}
            >
              <div className="p-4 bg-gray-800/80 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-medium text-sm">{template.name}</h3>
                  {selectedTemplateId === template.id && (
                    <Check className="w-4 h-4 text-[#00C851]" />
                  )}
                </div>
                <p className="text-gray-400 text-xs mb-2">{template.description}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {template.category}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    Used {template.usage_count} times
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {templates.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <p>No templates found for this category</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
