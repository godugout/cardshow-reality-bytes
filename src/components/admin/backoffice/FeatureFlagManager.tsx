
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { FeatureFlag } from './feature-flags/types';
import FeatureFlagCard from './feature-flags/FeatureFlagCard';
import CreateFlagForm from './feature-flags/CreateFlagForm';
import FeatureFlagsLoading from './feature-flags/FeatureFlagsLoading';

const FeatureFlagManager = () => {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
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
      
      // Transform the data to match our FeatureFlag interface
      const transformedFlags: FeatureFlag[] = (data || []).map(flag => ({
        id: flag.id,
        name: flag.name,
        description: flag.description || '',
        category: flag.category,
        is_enabled: flag.is_enabled,
        rollout_percentage: flag.rollout_percentage,
        target_users: Array.isArray(flag.target_users) 
          ? (flag.target_users as any[]).map(user => String(user)).filter(user => typeof user === 'string')
          : [],
        metadata: typeof flag.metadata === 'object' && flag.metadata !== null ? flag.metadata : {},
        created_at: flag.created_at
      }));
      
      setFlags(transformedFlags);
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

  const createFlag = async (flagData: {
    name: string;
    description: string;
    category: string;
    is_enabled: boolean;
    rollout_percentage: number;
  }) => {
    try {
      const { error } = await supabase
        .from('feature_flags')
        .insert([flagData]);

      if (error) throw error;

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

  if (loading) {
    return <FeatureFlagsLoading />;
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
        <CreateFlagForm
          onSubmit={createFlag}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      <div className="grid gap-4">
        {flags.map((flag) => (
          <FeatureFlagCard
            key={flag.id}
            flag={flag}
            onToggle={toggleFlag}
            onUpdateRollout={updateRollout}
            onDelete={deleteFlag}
          />
        ))}
      </div>
    </div>
  );
};

export default FeatureFlagManager;
