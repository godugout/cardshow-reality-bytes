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
        .select('*')
        .or(`initiator_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (filters.status?.length) {
        query = query.in('status', filters.status);
      }

      if (filters.initiator_id) {
        query = query.eq('initiator_id', filters.initiator_id);
      }

      if (filters.recipient_id) {
        query = query.eq('recipient_id', filters.recipient_id);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      // Get profile data separately
      const tradesWithProfiles = await Promise.all(
        (data || []).map(async (trade) => {
          const [initiatorProfile, recipientProfile] = await Promise.all([
            supabase.from('profiles').select('id, username, avatar_url').eq('id', trade.initiator_id).single(),
            supabase.from('profiles').select('id, username, avatar_url').eq('id', trade.recipient_id).single()
          ]);

          return {
            ...trade,
            initiator: initiatorProfile.data || null,
            recipient: recipientProfile.data || null
          };
        })
      );

      return tradesWithProfiles as TradeOffer[];
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
        .select('*')
        .eq('trade_id', tradeId)
        .order('timestamp', { ascending: true });

      if (error) throw error;
      
      // Get sender profiles separately
      const messagesWithSenders = await Promise.all(
        (data || []).map(async (message) => {
          const { data: senderProfile } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', message.sender_id)
            .single();

          return {
            ...message,
            sender: senderProfile || null
          };
        })
      );

      return messagesWithSenders as TradeMessage[];
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
        .select('*')
        .eq('trade_id', tradeId);

      // Get user profiles separately
      const participantsWithUsers = await Promise.all(
        (data || []).map(async (participant) => {
          const { data: userProfile } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', participant.user_id)
            .single();

          return {
            ...participant,
            user: userProfile || null
          };
        })
      );

      setParticipants(participantsWithUsers as TradeParticipant[]);
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
