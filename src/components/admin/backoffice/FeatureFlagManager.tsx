
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Plus, Settings, Users, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  category: string;
  is_enabled: boolean;
  rollout_percentage: number;
  target_users: string[];
  metadata: Record<string, any>;
  created_at: string;
}

const FeatureFlagManager = () => {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newFlag, setNewFlag] = useState({
    name: '',
    description: '',
    category: 'general',
    is_enabled: false,
    rollout_percentage: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchFlags();
  }, []);

  const fetchFlags = async () => {
    try {
      const { data, error } = await supabase
        .from('feature_flags')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      setFlags(data || []);
    } catch (error) {
      console.error('Error fetching flags:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch feature flags',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleFlag = async (flagId: string, enabled: boolean) => {
    try {
      const { error } = await supabase
        .from('feature_flags')
        .update({ is_enabled: enabled })
        .eq('id', flagId);

      if (error) throw error;

      setFlags(prev => prev.map(flag => 
        flag.id === flagId ? { ...flag, is_enabled: enabled } : flag
      ));

      toast({
        title: 'Success',
        description: `Feature flag ${enabled ? 'enabled' : 'disabled'}`,
      });
    } catch (error) {
      console.error('Error toggling flag:', error);
      toast({
        title: 'Error',
        description: 'Failed to update feature flag',
        variant: 'destructive'
      });
    }
  };

  const updateRollout = async (flagId: string, percentage: number) => {
    try {
      const { error } = await supabase
        .from('feature_flags')
        .update({ rollout_percentage: percentage })
        .eq('id', flagId);

      if (error) throw error;

      setFlags(prev => prev.map(flag => 
        flag.id === flagId ? { ...flag, rollout_percentage: percentage } : flag
      ));
    } catch (error) {
      console.error('Error updating rollout:', error);
      toast({
        title: 'Error',
        description: 'Failed to update rollout percentage',
        variant: 'destructive'
      });
    }
  };

  const createFlag = async () => {
    try {
      const { error } = await supabase
        .from('feature_flags')
        .insert([newFlag]);

      if (error) throw error;

      setNewFlag({
        name: '',
        description: '',
        category: 'general',
        is_enabled: false,
        rollout_percentage: 0
      });
      setShowCreateForm(false);
      fetchFlags();

      toast({
        title: 'Success',
        description: 'Feature flag created successfully',
      });
    } catch (error) {
      console.error('Error creating flag:', error);
      toast({
        title: 'Error',
        description: 'Failed to create feature flag',
        variant: 'destructive'
      });
    }
  };

  const deleteFlag = async (flagId: string) => {
    if (!confirm('Are you sure you want to delete this feature flag?')) return;

    try {
      const { error } = await supabase
        .from('feature_flags')
        .delete()
        .eq('id', flagId);

      if (error) throw error;

      setFlags(prev => prev.filter(flag => flag.id !== flagId));

      toast({
        title: 'Success',
        description: 'Feature flag deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting flag:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete feature flag',
        variant: 'destructive'
      });
    }
  };

  const categoryColors = {
    general: 'bg-gray-600',
    creator: 'bg-purple-600',
    cards: 'bg-blue-600',
    marketplace: 'bg-green-600',
    community: 'bg-orange-600',
    analytics: 'bg-pink-600'
  };

  if (loading) {
    return (
      <Card className="bg-gray-900 border-gray-700">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-800 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Feature Flags</h2>
          <p className="text-gray-400">Control feature rollouts and user access</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="bg-primary text-black">
          <Plus className="w-4 h-4 mr-2" />
          Create Flag
        </Button>
      </div>

      {showCreateForm && (
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Create New Feature Flag</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Name</label>
                <Input
                  value={newFlag.name}
                  onChange={(e) => setNewFlag(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="feature_name"
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Category</label>
                <Select value={newFlag.category} onValueChange={(value) => setNewFlag(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="creator">Creator</SelectItem>
                    <SelectItem value="cards">Cards</SelectItem>
                    <SelectItem value="marketplace">Marketplace</SelectItem>
                    <SelectItem value="community">Community</SelectItem>
                    <SelectItem value="analytics">Analytics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-white mb-2 block">Description</label>
              <Textarea
                value={newFlag.description}
                onChange={(e) => setNewFlag(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this feature flag controls"
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div className="flex gap-4">
              <Button onClick={createFlag} className="bg-primary text-black">
                Create Flag
              </Button>
              <Button onClick={() => setShowCreateForm(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {flags.map((flag) => (
          <Card key={flag.id} className="bg-gray-900 border-gray-700">
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
                      onCheckedChange={(checked) => toggleFlag(flag.id, checked)}
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
                            onValueChange={([value]) => updateRollout(flag.id, value)}
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
                  <Button variant="destructive" size="sm" onClick={() => deleteFlag(flag.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FeatureFlagManager;
