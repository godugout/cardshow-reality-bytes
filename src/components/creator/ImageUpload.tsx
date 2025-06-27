
import { useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  onImageRemove: () => void;
  currentImage?: string;
  isUploading?: boolean;
  uploadProgress?: number;
}

export const ImageUpload = ({ 
  onImageSelect, 
  onImageRemove, 
  currentImage, 
  isUploading = false,
  uploadProgress = 0 
}: ImageUploadProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image under 10MB",
        variant: "destructive",
      });
      return;
    }

    onImageSelect(file);
  }, [onImageSelect, toast]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image under 10MB",
          variant: "destructive",
        });
        return;
      }
      onImageSelect(file);
    }
  }, [onImageSelect, toast]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const progressBarStyle = {
    width: `${uploadProgress}%`,
    transition: 'width 0.3s ease-in-out'
  };

  return (
    <div className="space-y-4">
      {currentImage ? (
        <div className="relative group">
          <img
            src={currentImage}
            alt="Card preview"
            className="w-full h-40 object-cover rounded-lg border border-[hsl(var(--color-border-secondary))]"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-200 rounded-lg flex items-center justify-center">
            <Button
              onClick={onImageRemove}
              variant="destructive"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-[hsl(var(--color-border-secondary))] rounded-lg p-8 text-center hover:border-[hsl(var(--color-border-focus))] transition-colors cursor-pointer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center gap-3">
            {isUploading ? (
              <>
                <Upload className="w-8 h-8 text-[hsl(var(--color-primary))] animate-bounce" />
                <p className="text-[hsl(var(--color-text-primary))] font-medium">
                  Uploading... {uploadProgress}%
                </p>
                <div className="w-full max-w-xs bg-[hsl(var(--color-bg-tertiary))] rounded-full h-2">
                  <div 
                    className="bg-[hsl(var(--color-primary))] h-2 rounded-full"
                    style={progressBarStyle}
                  />
                </div>
              </>
            ) : (
              <>
                <Image className="w-8 h-8 text-[hsl(var(--color-text-tertiary))]" />
                <div>
                  <p className="text-[hsl(var(--color-text-secondary))] mb-1">
                    Drop image here or click to upload
                  </p>
                  <p className="text-sm text-[hsl(var(--color-text-tertiary))]">
                    Supports JPG, PNG, WebP up to 10MB
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {!currentImage && !isUploading && (
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          className="w-full border-[hsl(var(--color-border-secondary))] text-[hsl(var(--color-text-secondary))] hover:bg-[hsl(var(--color-bg-tertiary))]"
        >
          <Upload className="mr-2 h-4 w-4" />
          Choose Image
        </Button>
      )}
    </div>
  );
};
