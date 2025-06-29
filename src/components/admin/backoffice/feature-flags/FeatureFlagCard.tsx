
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Settings, Users, Trash2 } from 'lucide-react';
import { FeatureFlag, categoryColors } from './types';

interface FeatureFlagCardProps {
  flag: FeatureFlag;
  onToggle: (flagId: string, enabled: boolean) => void;
  onUpdateRollout: (flagId: string, percentage: number) => void;
  onDelete: (flagId: string) => void;
}

const FeatureFlagCard = ({ flag, onToggle, onUpdateRollout, onDelete }: FeatureFlagCardProps) => {
  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-white">{flag.name}</h3>
              <Badge className={`${categoryColors[flag.category as keyof typeof categoryColors]} text-white`}>
                {flag.category}
              </Badge>
              <Switch
                checked={flag.is_enabled}
                onCheckedChange={(checked) => onToggle(flag.id, checked)}
              />
            </div>
            <p className="text-gray-400 text-sm mb-4">{flag.description}</p>
            
            {flag.is_enabled && (
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-300">Rollout: {flag.rollout_percentage}%</span>
                  <div className="flex-1 max-w-xs">
                    <Slider
                      value={[flag.rollout_percentage]}
                      onValueChange={([value]) => onUpdateRollout(flag.id, value)}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Users className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="destructive" size="sm" onClick={() => onDelete(flag.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeatureFlagCard;
