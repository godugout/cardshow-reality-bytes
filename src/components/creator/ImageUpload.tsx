
import { useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
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
      onImageSelect(file);
    }
  }, [onImageSelect]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  return (
    <div className="space-y-4">
      {currentImage ? (
        <div className="relative">
          <img
            src={currentImage}
            alt="Card preview"
            className="w-full h-40 object-cover rounded-lg border border-gray-600"
          />
          <Button
            onClick={onImageRemove}
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-gray-500 transition-colors cursor-pointer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-400 mb-2">
            {isUploading ? `Uploading... ${uploadProgress}%` : 'Drop image here or click to upload'}
          </p>
          <p className="text-sm text-gray-500">
            Supports JPG, PNG, WebP up to 10MB
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {!currentImage && (
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          className="w-full"
          disabled={isUploading}
        >
          <Upload className="mr-2 h-4 w-4" />
          {isUploading ? `Uploading... ${uploadProgress}%` : 'Choose Image'}
        </Button>
      )}
    </div>
  );
};
