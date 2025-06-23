
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { 
  TradeOffer, 
  TradeMessage, 
  TradeParticipant,
  CreateTradeOfferData, 
  SendMessageData,
  TradeFilters 
} from '@/types/trading';

export const useTradeOffers = (filters: TradeFilters = {}) => {
  const { user } = useAuth();
  
  const { data: offers = [], isLoading, error, refetch } = useQuery({
    queryKey: ['trade-offers', filters],
    queryFn: async () => {
      if (!user) return [];

      let query = supabase
        .from('trade_offers')
        .select(`
          *,
          initiator:profiles!trade_offers_initiator_id_fkey(id, username, avatar_url),
          recipient:profiles!trade_offers_recipient_id_fkey(id, username, avatar_url)
        `)
        .or(`initiator_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (filters.status?.length) {
        query = query.in('status', filters.status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  // Real-time subscription for trade offers
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('trade-offers-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trade_offers',
          filter: `or(initiator_id.eq.${user.id},recipient_id.eq.${user.id})`,
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, refetch]);

  return { offers, isLoading, error, refetch };
};

export const useTradeMessages = (tradeId: string) => {
  const { data: messages = [], refetch } = useQuery({
    queryKey: ['trade-messages', tradeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trade_messages')
        .select(`
          *,
          sender:profiles!trade_messages_sender_id_fkey(username, avatar_url)
        `)
        .eq('trade_id', tradeId)
        .order('timestamp', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!tradeId,
  });

  // Real-time subscription for messages
  useEffect(() => {
    if (!tradeId) return;

    const channel = supabase
      .channel(`trade-messages-${tradeId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'trade_messages',
          filter: `trade_id=eq.${tradeId}`,
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tradeId, refetch]);

  return { messages, refetch };
};

export const useTradeParticipants = (tradeId: string) => {
  const [participants, setParticipants] = useState<TradeParticipant[]>([]);

  useEffect(() => {
    if (!tradeId) return;

    const fetchParticipants = async () => {
      const { data } = await supabase
        .from('trade_participants')
        .select(`
          *,
          user:profiles!trade_participants_user_id_fkey(username, avatar_url)
        `)
        .eq('trade_id', tradeId);

      setParticipants(data || []);
    };

    fetchParticipants();

    // Real-time subscription for presence
    const channel = supabase
      .channel(`trade-participants-${tradeId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trade_participants',
          filter: `trade_id=eq.${tradeId}`,
        },
        () => {
          fetchParticipants();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tradeId]);

  return { participants };
};

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

export const useTradePresence = (tradeId: string) => {
  const { user } = useAuth();

  const updatePresence = async (isTyping: boolean = false) => {
    if (!user || !tradeId) return;

    await supabase
      .from('trade_participants')
      .upsert({
        trade_id: tradeId,
        user_id: user.id,
        is_typing: isTyping,
        last_seen: new Date().toISOString(),
        presence_status: 'online',
      });
  };

  const setTyping = (isTyping: boolean) => {
    updatePresence(isTyping);
  };

  const markOnline = () => {
    updatePresence(false);
  };

  return { setTyping, markOnline };
};
