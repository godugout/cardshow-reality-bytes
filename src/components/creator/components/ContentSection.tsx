
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Upload, Image } from 'lucide-react';
import { CardCreationData } from '@/hooks/useCardCreation';

interface ContentSectionProps {
  cardData: CardCreationData;
  uploadProgress: number;
  updateCardData: (updates: Partial<CardCreationData>) => void;
  uploadImage: (file: File) => Promise<string | null>;
}

export const ContentSection = ({ 
  cardData, 
  uploadProgress, 
  updateCardData, 
  uploadImage 
}: ContentSectionProps) => {
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      updateCardData({ imageFile: file });
      const url = await uploadImage(file);
      if (url) {
        updateCardData({ imageUrl: url });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="title" className="text-sm font-semibold text-slate-200 mb-2 block">
          Card Title
        </Label>
        <Input
          id="title"
          placeholder="Enter card title..."
          value={cardData.title}
          onChange={(e) => updateCardData({ title: e.target.value })}
          className="bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400 focus:border-emerald-500"
        />
      </div>
      
      <div>
        <Label htmlFor="description" className="text-sm font-semibold text-slate-200 mb-2 block">
          Description
        </Label>
        <Textarea
          id="description"
          placeholder="Describe your card..."
          value={cardData.description}
          onChange={(e) => updateCardData({ description: e.target.value })}
          className="bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400 resize-none focus:border-emerald-500"
          rows={4}
        />
      </div>

      <Separator className="bg-slate-600" />

      <div>
        <Label className="text-sm font-semibold text-slate-200 mb-3 block">
          <Image className="w-4 h-4 inline mr-2" />
          Card Image
        </Label>
        {!cardData.imageUrl ? (
          <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center bg-slate-700/50 hover:bg-slate-700 transition-colors">
            <Upload className="w-10 h-10 mx-auto mb-3 text-slate-400" />
            <p className="text-slate-200 mb-1 font-medium text-sm">
              Upload an image for your card
            </p>
            <p className="text-slate-400 text-xs mb-3">
              JPG, PNG, or GIF up to 10MB
            </p>
            <Button asChild variant="outline" size="sm" className="bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600">
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
          <div className="space-y-3">
            <div className="relative group">
              <img
                src={cardData.imageUrl}
                alt="Card preview"
                className="w-full h-32 object-cover rounded-lg border border-slate-600"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <Button
                  variant="secondary"
                  size="sm"
                  asChild
                  className="bg-slate-700/90 text-slate-100 hover:bg-slate-600/90"
                >
                  <label htmlFor="image-replace" className="cursor-pointer">
                    Replace Image
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
          </div>
        )}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="mt-3">
            <div className="bg-slate-700 rounded-full h-2">
              <div 
                className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-2 text-center">
              Uploading... {uploadProgress}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
