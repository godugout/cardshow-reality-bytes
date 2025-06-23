
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { SupportTicket, KnowledgeBaseArticle } from '@/types/enterprise';

export const useSupportTickets = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ['support-tickets', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as SupportTicket[];
    },
    enabled: !!user
  });

  const createTicketMutation = useMutation({
    mutationFn: async (ticketData: {
      subject: string;
      description: string;
      category: string;
      priority?: string;
    }) => {
      if (!user) throw new Error('Must be logged in');

      const { data, error } = await supabase
        .from('support_tickets')
        .insert({
          ...ticketData,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-tickets'] });
      toast({
        title: 'Ticket created',
        description: 'Your support ticket has been created successfully.',
      });
    }
  });

  return {
    tickets,
    isLoading,
    createTicket: createTicketMutation.mutate,
    isCreating: createTicketMutation.isPending
  };
};

export const useKnowledgeBase = (searchTerm?: string) => {
  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['knowledge-base', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('knowledge_base')
        .select('*')
        .eq('status', 'published')
        .order('view_count', { ascending: false });

      if (searchTerm) {
        query = query.textSearch('search_vector', searchTerm);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as KnowledgeBaseArticle[];
    }
  });

  const incrementViewMutation = useMutation({
    mutationFn: async (articleId: string) => {
      const { error } = await supabase.rpc('increment_article_views', {
        article_id: articleId
      });
      if (error) throw error;
    }
  });

  return {
    articles,
    isLoading,
    incrementView: incrementViewMutation.mutate
  };
};
