
-- Create trade_offers table
CREATE TABLE public.trade_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  initiator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'countered', 'expired', 'completed', 'cancelled')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() + INTERVAL '48 hours'),
  offered_cards JSONB NOT NULL DEFAULT '[]'::jsonb,
  requested_cards JSONB NOT NULL DEFAULT '[]'::jsonb,
  trade_value_difference NUMERIC DEFAULT 0,
  cash_included NUMERIC DEFAULT 0,
  messages_channel_id TEXT UNIQUE DEFAULT CONCAT('trade_', gen_random_uuid()),
  trade_note TEXT,
  counter_offer_id UUID REFERENCES public.trade_offers(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create trade_messages table
CREATE TABLE public.trade_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trade_id UUID REFERENCES public.trade_offers(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'system', 'offer_update', 'attachment')),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_status BOOLEAN DEFAULT FALSE,
  attachment_url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create trade_participants table for tracking active users in trade rooms
CREATE TABLE public.trade_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trade_id UUID REFERENCES public.trade_offers(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  is_typing BOOLEAN DEFAULT FALSE,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  presence_status TEXT DEFAULT 'online' CHECK (presence_status IN ('online', 'away', 'offline')),
  UNIQUE(trade_id, user_id)
);

-- Create trade_feedback table for reputation system
CREATE TABLE public.trade_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trade_id UUID REFERENCES public.trade_offers(id) ON DELETE CASCADE NOT NULL,
  reviewer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reviewed_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(trade_id, reviewer_id)
);

-- Create user_trade_preferences table
CREATE TABLE public.user_trade_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  auto_accept_threshold NUMERIC DEFAULT 0,
  preferred_trade_types TEXT[] DEFAULT '{"card_for_card", "cash_included"}'::text[],
  blocked_users UUID[] DEFAULT '{}'::uuid[],
  wishlist_cards UUID[] DEFAULT '{}'::uuid[],
  surplus_cards UUID[] DEFAULT '{}'::uuid[],
  notification_preferences JSONB DEFAULT '{"new_offers": true, "offer_updates": true, "messages": true}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.trade_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trade_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trade_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trade_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_trade_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for trade_offers
CREATE POLICY "Users can view their own trades" 
  ON public.trade_offers 
  FOR SELECT 
  USING (auth.uid() = initiator_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can create trade offers" 
  ON public.trade_offers 
  FOR INSERT 
  WITH CHECK (auth.uid() = initiator_id);

CREATE POLICY "Trade participants can update trades" 
  ON public.trade_offers 
  FOR UPDATE 
  USING (auth.uid() = initiator_id OR auth.uid() = recipient_id);

-- RLS Policies for trade_messages
CREATE POLICY "Trade participants can view messages" 
  ON public.trade_messages 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.trade_offers 
      WHERE id = trade_id 
      AND (initiator_id = auth.uid() OR recipient_id = auth.uid())
    )
  );

CREATE POLICY "Trade participants can send messages" 
  ON public.trade_messages 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = sender_id 
    AND EXISTS (
      SELECT 1 FROM public.trade_offers 
      WHERE id = trade_id 
      AND (initiator_id = auth.uid() OR recipient_id = auth.uid())
    )
  );

CREATE POLICY "Senders can update their messages" 
  ON public.trade_messages 
  FOR UPDATE 
  USING (auth.uid() = sender_id);

-- RLS Policies for trade_participants
CREATE POLICY "Trade participants can view presence" 
  ON public.trade_participants 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.trade_offers 
      WHERE id = trade_id 
      AND (initiator_id = auth.uid() OR recipient_id = auth.uid())
    )
  );

CREATE POLICY "Users can manage their own presence" 
  ON public.trade_participants 
  FOR ALL 
  USING (auth.uid() = user_id);

-- RLS Policies for trade_feedback
CREATE POLICY "Users can view feedback for their trades" 
  ON public.trade_feedback 
  FOR SELECT 
  USING (
    auth.uid() = reviewer_id 
    OR auth.uid() = reviewed_id 
    OR EXISTS (
      SELECT 1 FROM public.trade_offers 
      WHERE id = trade_id 
      AND (initiator_id = auth.uid() OR recipient_id = auth.uid())
    )
  );

CREATE POLICY "Users can create feedback for completed trades" 
  ON public.trade_feedback 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = reviewer_id 
    AND EXISTS (
      SELECT 1 FROM public.trade_offers 
      WHERE id = trade_id 
      AND status = 'completed'
      AND (initiator_id = auth.uid() OR recipient_id = auth.uid())
    )
  );

-- RLS Policies for user_trade_preferences
CREATE POLICY "Users can manage their own preferences" 
  ON public.user_trade_preferences 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_trade_offers_initiator ON public.trade_offers(initiator_id);
CREATE INDEX idx_trade_offers_recipient ON public.trade_offers(recipient_id);
CREATE INDEX idx_trade_offers_status ON public.trade_offers(status);
CREATE INDEX idx_trade_offers_expires_at ON public.trade_offers(expires_at);
CREATE INDEX idx_trade_messages_trade_id ON public.trade_messages(trade_id);
CREATE INDEX idx_trade_messages_timestamp ON public.trade_messages(timestamp);
CREATE INDEX idx_trade_participants_trade_id ON public.trade_participants(trade_id);

-- Enable real-time for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.trade_offers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.trade_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.trade_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.trade_feedback;

-- Set replica identity for real-time updates
ALTER TABLE public.trade_offers REPLICA IDENTITY FULL;
ALTER TABLE public.trade_messages REPLICA IDENTITY FULL;
ALTER TABLE public.trade_participants REPLICA IDENTITY FULL;
ALTER TABLE public.trade_feedback REPLICA IDENTITY FULL;

-- Create trigger for updating updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_trade_offers_updated_at 
  BEFORE UPDATE ON public.trade_offers 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_trade_preferences_updated_at 
  BEFORE UPDATE ON public.user_trade_preferences 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically expire trades
CREATE OR REPLACE FUNCTION expire_old_trades()
RETURNS void AS $$
BEGIN
  UPDATE public.trade_offers 
  SET status = 'expired', updated_at = NOW()
  WHERE expires_at < NOW() 
  AND status IN ('pending', 'countered');
END;
$$ LANGUAGE plpgsql;
