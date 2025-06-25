
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ScreenshotCaptureProps {
  screenshot: File | null;
  onScreenshotCapture: (file: File | null) => void;
}

const ScreenshotCapture = ({ screenshot, onScreenshotCapture }: ScreenshotCaptureProps) => {
  const { toast } = useToast();

  const captureScreenshot = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { 
          displaySurface: 'browser'
        } as any
      });
      
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      video.addEventListener('loadedmetadata', () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'screenshot.png', { type: 'image/png' });
            onScreenshotCapture(file);
          }
        });
        
        stream.getTracks().forEach(track => track.stop());
      });
      
    } catch (error) {
      toast({
        title: 'Screenshot Failed',
        description: 'Could not capture screenshot. Please try again.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Button
        type="button"
        variant="outline"
        onClick={captureScreenshot}
        className="border-gray-700"
      >
        <Camera className="w-4 h-4 mr-2" />
        Capture Screenshot
      </Button>
      
      {screenshot && (
        <Badge variant="secondary">
          Screenshot captured: {screenshot.name}
        </Badge>
      )}
    </div>
  );
};

export default ScreenshotCapture;
