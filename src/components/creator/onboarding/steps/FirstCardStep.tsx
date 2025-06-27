
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Image } from 'lucide-react';

interface FirstCardStepProps {
  onNext: () => void;
}

const FirstCardStep = ({ onNext }: FirstCardStepProps) => {
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

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Create Your First Card</h2>
        <p className="text-muted-foreground mb-6">
          Let's create your first card together. Don't worry about making it perfect - 
          you can always edit it later!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Card Title</Label>
            <Input
              id="title"
              placeholder="Enter your card title..."
              value={cardData.title}
              onChange={(e) => setCardData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your card..."
              value={cardData.description}
              onChange={(e) => setCardData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div>
            <Label>Card Image</Label>
            {!cardData.imageUrl ? (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">Upload an image for your card</p>
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
            )}
          </div>
        </div>

        <div>
          <Label>Preview</Label>
          <Card className="w-64 h-80 mx-auto">
            <CardContent className="p-0 h-full">
              <div className="h-2/3 bg-gradient-to-br from-gray-200 to-gray-300 rounded-t-lg flex items-center justify-center">
                {cardData.imageUrl ? (
                  <img
                    src={cardData.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                ) : (
                  <Image className="w-12 h-12 text-gray-400" />
                )}
              </div>
              <div className="p-3 h-1/3">
                <h3 className="font-bold text-sm truncate">
                  {cardData.title || 'Card Title'}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-3 mt-1">
                  {cardData.description || 'Card description will appear here...'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FirstCardStep;
