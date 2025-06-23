
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { CreateTradeOfferData, SendMessageData } from '@/types/trading';

export const useCreateTradeOffer = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (offerData: CreateTradeOfferData) => {
      if (!user) throw new Error('Must be logged in to create trade offers');

      const { data, error } = await supabase
        .from('trade_offers')
        .insert({
          ...offerData,
          initiator_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trade-offers'] });
      toast({
        title: 'Trade offer sent',
        description: 'Your trade offer has been sent successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error creating trade offer',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useSendMessage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageData: SendMessageData) => {
      if (!user) throw new Error('Must be logged in to send messages');

      const { data, error } = await supabase
        .from('trade_messages')
        .insert({
          ...messageData,
          sender_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['trade-messages', variables.trade_id] });
    },
    onError: (error) => {
      toast({
        title: 'Error sending message',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateTradeStatus = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tradeId, status }: { tradeId: string; status: string }) => {
      if (!user) throw new Error('Must be logged in');

      const { data, error } = await supabase
        .from('trade_offers')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', tradeId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['trade-offers'] });
      toast({
        title: 'Trade updated',
        description: `Trade ${variables.status} successfully`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error updating trade',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};
