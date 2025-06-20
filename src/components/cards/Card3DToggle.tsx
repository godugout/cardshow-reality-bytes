
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Box, Image, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { use3DPreferences } from '@/hooks/use3DPreferences';

interface Card3DToggleProps {
  is3D: boolean;
  onToggle: (enabled: boolean) => void;
  className?: string;
}

const Card3DToggle = ({ is3D, onToggle, className }: Card3DToggleProps) => {
  const { preferences, updatePreferences } = use3DPreferences();
  const [showSettings, setShowSettings] = useState(false);

  const handleQualityChange = (quality: 'low' | 'medium' | 'high') => {
    updatePreferences({ quality });
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Button
        variant={is3D ? 'default' : 'outline'}
        size="sm"
        onClick={() => onToggle(!is3D)}
        className="flex items-center gap-2"
      >
        {is3D ? <Box className="w-4 h-4" /> : <Image className="w-4 h-4" />}
        {is3D ? '3D' : '2D'}
      </Button>
      
      {is3D && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="w-4 h-4" />
          </Button>
          
          {showSettings && (
            <div className="flex items-center gap-1">
              {(['low', 'medium', 'high'] as const).map((quality) => (
                <Badge
                  key={quality}
                  variant={preferences.quality === quality ? 'default' : 'outline'}
                  className="cursor-pointer capitalize text-xs"
                  onClick={() => handleQualityChange(quality)}
                >
                  {quality}
                </Badge>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Card3DToggle;
