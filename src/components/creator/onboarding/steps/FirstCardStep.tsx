
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Upload, Sparkles, Eye } from 'lucide-react';

interface FirstCardStepProps {
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

export const FirstCardStep = ({ onNext }: FirstCardStepProps) => {
  const [cardData, setCardData] = useState({
    title: '',
    description: '',
    imageUrl: ''
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCardData(prev => ({ ...prev, imageUrl: url }));
    }
  };

  const canContinue = cardData.title.trim() && cardData.imageUrl;

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Create Your First Card
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Let's start simple! Upload an image and add a title to create your first trading card.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Card Creation Form */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Card Details
              </h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Card Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Lightning Warrior, Sunset Landscape..."
                    value={cardData.title}
                    onChange={(e) => setCardData(prev => ({ ...prev, title: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Tell the story behind your card..."
                    value={cardData.description}
                    onChange={(e) => setCardData(prev => ({ ...prev, description: e.target.value }))}
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Card Image *</Label>
                  <div className="mt-2">
                    {!cardData.imageUrl ? (
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                        <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground mb-4">
                          Upload an image for your card
                        </p>
                        <Button asChild variant="outline">
                          <label htmlFor="image-upload" className="cursor-pointer">
                            Choose Image
                            <input
                              id="image-upload"
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                          </label>
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="relative">
                          <img
                            src={cardData.imageUrl}
                            alt="Card preview"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <Button
                            variant="secondary"
                            size="sm"
                            className="absolute top-2 right-2"
                            asChild
                          >
                            <label htmlFor="image-replace" className="cursor-pointer">
                              Replace
                              <input
                                id="image-replace"
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                              />
                            </label>
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center gap-2">
            <Badge variant="secondary">💡 Tip:</Badge>
            <span className="text-sm text-muted-foreground">
              High-quality images work best (at least 400x400px)
            </span>
          </div>
        </div>

        {/* Live Preview */}
        <div className="lg:sticky lg:top-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                Live Preview
              </h3>
              
              <div className="aspect-[2.5/3.5] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-4 flex flex-col relative overflow-hidden">
                {cardData.imageUrl ? (
                  <img
                    src={cardData.imageUrl}
                    alt="Card preview"
                    className="flex-1 object-cover rounded-md mb-3"
                  />
                ) : (
                  <div className="flex-1 bg-muted rounded-md mb-3 flex items-center justify-center">
                    <span className="text-muted-foreground text-sm">Image Preview</span>
                  </div>
                )}
                
                <div className="bg-white/90 backdrop-blur-sm rounded-md p-3">
                  <h4 className="font-bold text-sm text-gray-900 mb-1">
                    {cardData.title || 'Card Title'}
                  </h4>
                  {cardData.description && (
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {cardData.description}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {canContinue && (
        <div className="text-center mt-8">
          <Button onClick={onNext} size="lg" className="px-8">
            Perfect! Let's Explore Design Tools
          </Button>
        </div>
      )}
    </div>
  );
};
