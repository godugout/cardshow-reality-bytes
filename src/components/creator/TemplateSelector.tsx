
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useCardTemplates, useTemplateCategories } from '@/hooks/useCardTemplates';
import { Check, Sparkles } from 'lucide-react';

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
      <Card className="bg-[hsl(var(--color-bg-secondary))] border-[hsl(var(--color-border-primary))]">
        <CardHeader>
          <CardTitle className="text-[hsl(var(--color-text-primary))]">Choose Template</CardTitle>
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
    <Card className="bg-[hsl(var(--color-bg-secondary))] border-[hsl(var(--color-border-primary))]">
      <CardHeader>
        <CardTitle className="text-[hsl(var(--color-text-primary))] flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          Choose Template
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Category filters */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
            className={selectedCategory === 'all' 
              ? 'bg-[hsl(var(--color-primary))] hover:bg-[hsl(var(--color-primary-700))] text-[hsl(var(--color-primary-contrast))]' 
              : 'border-[hsl(var(--color-border-secondary))] text-[hsl(var(--color-text-secondary))] hover:bg-[hsl(var(--color-bg-tertiary))]'
            }
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category 
                ? 'bg-[hsl(var(--color-primary))] hover:bg-[hsl(var(--color-primary-700))] text-[hsl(var(--color-primary-contrast))]' 
                : 'border-[hsl(var(--color-border-secondary))] text-[hsl(var(--color-text-secondary))] hover:bg-[hsl(var(--color-bg-tertiary))]'
              }
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
              className={`relative cursor-pointer rounded-lg border-2 transition-all hover:scale-[1.02] ${
                selectedTemplateId === template.id
                  ? 'border-[hsl(var(--color-primary))] shadow-lg shadow-[hsl(var(--color-primary-alpha-20))]'
                  : 'border-[hsl(var(--color-border-secondary))] hover:border-[hsl(var(--color-border-focus))]'
              }`}
              onClick={() => onTemplateSelect(template.id)}
            >
              <div className="p-4 bg-[hsl(var(--color-bg-tertiary))] rounded-lg">
                {/* Template preview */}
                {template.preview_url ? (
                  <div className="w-full h-24 mb-3 rounded bg-[hsl(var(--color-bg-primary))] overflow-hidden">
                    <img 
                      src={template.preview_url} 
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-24 mb-3 rounded bg-[hsl(var(--color-bg-primary))] flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-[hsl(var(--color-text-tertiary))]" />
                  </div>
                )}

                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[hsl(var(--color-text-primary))] font-medium text-sm truncate pr-2">
                    {template.name}
                  </h3>
                  {selectedTemplateId === template.id && (
                    <Check className="w-4 h-4 text-[hsl(var(--color-primary))] flex-shrink-0" />
                  )}
                </div>
                
                {template.description && (
                  <p className="text-[hsl(var(--color-text-tertiary))] text-xs mb-2 line-clamp-2">
                    {template.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  <Badge 
                    variant="outline" 
                    className="text-xs border-[hsl(var(--color-border-secondary))] text-[hsl(var(--color-text-tertiary))]"
                  >
                    {template.category}
                  </Badge>
                  <div className="flex items-center gap-2">
                    {template.is_premium && (
                      <Badge className="text-xs bg-[hsl(var(--color-warning))] text-white">
                        Premium
                      </Badge>
                    )}
                    <span className="text-xs text-[hsl(var(--color-text-tertiary))]">
                      {template.usage_count} uses
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {templates.length === 0 && (
          <div className="text-center py-8 text-[hsl(var(--color-text-tertiary))]">
            <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No templates found for this category</p>
            <p className="text-sm mt-1">Try selecting a different category</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
