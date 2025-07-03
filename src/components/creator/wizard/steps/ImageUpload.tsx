import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useCardCreationWizard } from '@/hooks/useCardCreationWizard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, Image, X, Edit3, Crop, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  wizard: ReturnType<typeof useCardCreationWizard>;
}

export const ImageUpload = ({ wizard }: ImageUploadProps) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});

  const createPreviewUrl = useCallback((file: File, type: string) => {
    const url = URL.createObjectURL(file);
    setPreviewUrls(prev => ({ ...prev, [type]: url }));
    return url;
  }, []);

  const removeImage = useCallback((type: 'main' | 'background' | 'overlay') => {
    wizard.updateState({
      images: {
        ...wizard.state.images,
        [type]: undefined
      }
    });
    if (previewUrls[type]) {
      URL.revokeObjectURL(previewUrls[type]);
      setPreviewUrls(prev => {
        const newUrls = { ...prev };
        delete newUrls[type];
        return newUrls;
      });
    }
  }, [wizard, previewUrls]);

  const MainImageDropzone = () => {
    const onDrop = useCallback(async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        // Upload the image immediately and store the URL
        await wizard.uploadImage(file, 'main');
      }
    }, [wizard]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: {
        'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif']
      },
      multiple: false,
      maxSize: 10 * 1024 * 1024, // 10MB
    });

    const mainImage = wizard.state.images.main;
    const previewUrl = wizard.getImagePreviewUrl('main');

    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Image className="w-5 h-5 mr-2 text-primary" />
            Main Card Image
            <span className="text-red-400 ml-1">*</span>
          </h3>
          
          {!mainImage ? (
            <div
              {...getRootProps()}
              className={cn(
                "border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer transition-all duration-200",
                isDragActive && "border-primary bg-primary/5",
                "hover:border-primary/50 hover:bg-slate-700/50"
              )}
            >
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-300 mb-2">
                {isDragActive ? 'Drop your image here' : 'Drag & drop your main image here'}
              </p>
              <p className="text-sm text-slate-400 mb-4">
                or click to browse files
              </p>
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:text-white">
                Choose File
              </Button>
              <p className="text-xs text-slate-500 mt-3">
                Supports PNG, JPG, JPEG, WebP, GIF (max 10MB)
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative aspect-[3/4] max-w-xs mx-auto">
                <img
                  src={previewUrl}
                  alt="Main card image"
                  className="w-full h-full object-cover rounded-lg"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => removeImage('main')}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
                  <Crop className="w-4 h-4 mr-2" />
                  Crop
                </Button>
                <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
                  <Palette className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const OptionalImageDropzone = ({ type, title, description }: { 
    type: 'background' | 'overlay'; 
    title: string; 
    description: string; 
  }) => {
    const onDrop = useCallback(async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        // Upload the image immediately and store the URL
        await wizard.uploadImage(file, type);
      }
    }, [wizard, type]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: {
        'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif']
      },
      multiple: false,
      maxSize: 10 * 1024 * 1024,
    });

    const image = wizard.state.images[type];
    const previewUrl = wizard.getImagePreviewUrl(type);

    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
          <p className="text-sm text-slate-400 mb-4">{description}</p>
          
          {!image ? (
            <div
              {...getRootProps()}
              className={cn(
                "border-2 border-dashed border-slate-600 rounded-lg p-6 text-center cursor-pointer transition-all duration-200",
                isDragActive && "border-primary bg-primary/5",
                "hover:border-primary/50 hover:bg-slate-700/50"
              )}
            >
              <input {...getInputProps()} />
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
              <p className="text-sm text-slate-300 mb-2">
                {isDragActive ? 'Drop image here' : 'Add optional image'}
              </p>
              <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:text-white">
                Choose File
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative aspect-[3/4] max-w-[120px]">
                <img
                  src={previewUrl}
                  alt={title}
                  className="w-full h-full object-cover rounded-lg"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 w-6 h-6 p-0"
                  onClick={() => removeImage(type)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8 pb-24">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Upload Your Images
        </h2>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
          Add images to bring your card to life. The main image is required, others are optional.
        </p>
      </div>

      {/* Upload Progress */}
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-300">Uploading...</span>
            <span className="text-sm text-slate-300">{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      {/* Main Image Upload */}
      <MainImageDropzone />

      {/* Optional Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <OptionalImageDropzone
          type="background"
          title="Background Image"
          description="Add a custom background behind your main image"
        />
        <OptionalImageDropzone
          type="overlay"
          title="Overlay Image"
          description="Add elements that appear on top of your main image"
        />
      </div>

      {/* Tips */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">💡 Image Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-300">
            <div>
              <p className="font-medium mb-2">Best Practices:</p>
              <ul className="space-y-1">
                <li>• Use high-resolution images (at least 1000px)</li>
                <li>• Square or portrait aspect ratios work best</li>
                <li>• Ensure good contrast with text</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-2">Supported Formats:</p>
              <ul className="space-y-1">
                <li>• PNG (recommended for transparency)</li>
                <li>• JPEG (good for photos)</li>
                <li>• WebP (modern format, smaller file size)</li>
                <li>• GIF (for simple animations)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};