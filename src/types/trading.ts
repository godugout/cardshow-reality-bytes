
import type { Database } from '@/integrations/supabase/types';

export type TradeOffer = Database['public']['Tables']['trade_offers']['Row'] & {
  initiator?: {
    id: string;
    username: string;
    avatar_url?: string;
  } | null;
  recipient?: {
    id: string;
    username: string;
    avatar_url?: string;
  } | null;
  offered_cards_data?: Array<{
    id: string;
    title: string;
    image_url: string;
    rarity: string;
    estimated_value: number;
  }>;
  requested_cards_data?: Array<{
    id: string;
    title: string;
    image_url: string;
    rarity: string;
    estimated_value: number;
  }>;
};

export type TradeMessage = Database['public']['Tables']['trade_messages']['Row'] & {
  sender?: {
    username: string;
    avatar_url?: string;
  } | null;
};

export type TradeParticipant = Database['public']['Tables']['trade_participants']['Row'] & {
  user?: {
    username: string;
    avatar_url?: string;
  } | null;
};

export type TradeFeedback = Database['public']['Tables']['trade_feedback']['Row'];
export type UserTradePreferences = Database['public']['Tables']['user_trade_preferences']['Row'];

export interface CreateTradeOfferData {
  recipient_id: string;
  offered_cards: Array<{
    id: string;
    quantity?: number;
    condition?: string;
  }>;
  requested_cards: Array<{
    id: string;
    quantity?: number;
    condition?: string;
  }>;
  cash_included?: number;
  trade_note?: string;
}

export interface SendMessageData {
  trade_id: string;
  message: string;
  message_type?: 'text' | 'system' | 'offer_update' | 'attachment';
  attachment_url?: string;
}

export interface TradeFilters {
  status?: string[];
  initiator_id?: string;
  recipient_id?: string;
  created_after?: string;
}
