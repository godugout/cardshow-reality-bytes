
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { GDPRRequest } from '@/types/enterprise';

export const useGDPRRequests = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['gdpr-requests', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('gdpr_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as GDPRRequest[];
    },
    enabled: !!user
  });

  const requestDataExportMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Must be logged in');

      const { data, error } = await supabase
        .from('gdpr_requests')
        .insert({
          user_id: user.id,
          request_type: 'export'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gdpr-requests'] });
      toast({
        title: 'Data export requested',
        description: 'Your data export request has been submitted. You will receive an email when it\'s ready.',
      });
    }
  });

  const requestDataDeletionMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Must be logged in');

      const { data, error } = await supabase
        .from('gdpr_requests')
        .insert({
          user_id: user.id,
          request_type: 'deletion'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gdpr-requests'] });
      toast({
        title: 'Data deletion requested',
        description: 'Your data deletion request has been submitted. This action cannot be undone.',
        variant: 'destructive'
      });
    }
  });

  return {
    requests,
    isLoading,
    requestDataExport: requestDataExportMutation.mutate,
    requestDataDeletion: requestDataDeletionMutation.mutate,
    isProcessing: requestDataExportMutation.isPending || requestDataDeletionMutation.isPending
  };
};
