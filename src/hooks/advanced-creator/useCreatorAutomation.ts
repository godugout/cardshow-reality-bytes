
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { CreatorAutomationRule } from '@/types/advanced-creator';

export const useCreatorAutomation = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: automationRules = [], isLoading } = useQuery({
    queryKey: ['creator-automation-rules', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data: creatorProfile } = await supabase
        .from('creator_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!creatorProfile) return [];

      const { data, error } = await supabase
        .from('creator_automation_rules')
        .select('*')
        .eq('creator_id', creatorProfile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as CreatorAutomationRule[];
    },
    enabled: !!user
  });

  const createAutomationRule = useMutation({
    mutationFn: async (ruleData: Omit<CreatorAutomationRule, 'id' | 'creator_id' | 'execution_count' | 'success_rate' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('Must be logged in');

      const { data: creatorProfile } = await supabase
        .from('creator_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!creatorProfile) throw new Error('Creator profile required');

      const { data, error } = await supabase
        .from('creator_automation_rules')
        .insert({
          ...ruleData,
          creator_id: creatorProfile.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creator-automation-rules'] });
      toast({
        title: 'Automation rule created',
        description: 'Your automation rule has been set up successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  const updateAutomationRule = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<CreatorAutomationRule> }) => {
      const { data, error } = await supabase
        .from('creator_automation_rules')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creator-automation-rules'] });
      toast({
        title: 'Rule updated',
        description: 'Automation rule has been updated successfully.',
      });
    }
  });

  const deleteAutomationRule = useMutation({
    mutationFn: async (ruleId: string) => {
      const { error } = await supabase
        .from('creator_automation_rules')
        .delete()
        .eq('id', ruleId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creator-automation-rules'] });
      toast({
        title: 'Rule deleted',
        description: 'Automation rule has been removed.',
      });
    }
  });

  return {
    automationRules,
    isLoading,
    createAutomationRule: createAutomationRule.mutate,
    updateAutomationRule: updateAutomationRule.mutate,
    deleteAutomationRule: deleteAutomationRule.mutate,
    isCreating: createAutomationRule.isPending,
    isUpdating: updateAutomationRule.isPending,
    isDeleting: deleteAutomationRule.isPending
  };
};

export const useMarketplaceOptimization = () => {
  const { toast } = useToast();

  const optimizePricing = useMutation({
    mutationFn: async (listingId: string) => {
      const { data, error } = await supabase.rpc('optimize_listing_pricing', {
        listing_uuid: listingId
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (suggestedPrice) => {
      toast({
        title: 'Pricing optimized',
        description: `Suggested price: $${suggestedPrice}`,
      });
    }
  });

  const optimizeSEO = useMutation({
    mutationFn: async (listingId: string) => {
      const { error } = await supabase.rpc('update_seo_optimization', {
        listing_uuid: listingId
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'SEO optimized',
        description: 'Listing SEO has been automatically optimized.',
      });
    }
  });

  return {
    optimizePricing: optimizePricing.mutate,
    optimizeSEO: optimizeSEO.mutate,
    isOptimizingPrice: optimizePricing.isPending,
    isOptimizingSEO: optimizeSEO.isPending
  };
};
