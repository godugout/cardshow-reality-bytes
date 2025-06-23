
-- Create creator profiles table for managing creator accounts
CREATE TABLE public.creator_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  stripe_account_id TEXT UNIQUE,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'suspended', 'rejected')),
  portfolio_url TEXT,
  bio TEXT,
  specialties TEXT[] DEFAULT '{}',
  commission_rates JSONB DEFAULT '{"standard": 50.00, "premium": 100.00, "custom": 200.00}',
  total_earnings NUMERIC DEFAULT 0.00,
  cards_created INTEGER DEFAULT 0,
  avg_rating NUMERIC DEFAULT 0.00,
  tax_info JSONB DEFAULT '{}',
  payout_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create card templates table for creator-made templates
CREATE TABLE public.card_templates_creator (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL DEFAULT 0.00,
  category TEXT NOT NULL,
  template_data JSONB NOT NULL DEFAULT '{}',
  preview_images TEXT[] DEFAULT '{}',
  sales_count INTEGER DEFAULT 0,
  revenue_generated NUMERIC DEFAULT 0.00,
  rating NUMERIC DEFAULT 0.00,
  is_published BOOLEAN DEFAULT false,
  license_type TEXT DEFAULT 'standard' CHECK (license_type IN ('standard', 'extended', 'exclusive')),
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create creator earnings table for tracking revenue
CREATE TABLE public.creator_earnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
  source_type TEXT NOT NULL CHECK (source_type IN ('card_sale', 'template_sale', 'commission', 'royalty', 'subscription')),
  amount NUMERIC NOT NULL,
  platform_fee NUMERIC NOT NULL DEFAULT 0.00,
  net_amount NUMERIC GENERATED ALWAYS AS (amount - platform_fee) STORED,
  card_id UUID REFERENCES public.cards(id) ON DELETE SET NULL,
  template_id UUID REFERENCES public.card_templates_creator(id) ON DELETE SET NULL,
  transaction_date TIMESTAMPTZ DEFAULT NOW(),
  payout_date TIMESTAMPTZ,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'disputed')),
  stripe_transfer_id TEXT,
  tax_document_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create creator subscriptions table for recurring revenue
CREATE TABLE public.creator_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
  subscriber_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_type TEXT NOT NULL CHECK (subscription_type IN ('basic', 'premium', 'exclusive')),
  monthly_fee NUMERIC NOT NULL,
  start_date TIMESTAMPTZ DEFAULT NOW(),
  end_date TIMESTAMPTZ,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'paused')),
  stripe_subscription_id TEXT,
  benefits JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(creator_id, subscriber_id)
);

-- Create creator commissions table for custom work
CREATE TABLE public.creator_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
  client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  commission_type TEXT NOT NULL CHECK (commission_type IN ('standard', 'premium', 'custom')),
  quoted_price NUMERIC NOT NULL,
  final_price NUMERIC,
  deadline DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'in_progress', 'completed', 'cancelled', 'disputed')),
  requirements JSONB DEFAULT '{}',
  deliverables TEXT[] DEFAULT '{}',
  communication_channel TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_creator_profiles_user_id ON public.creator_profiles(user_id);
CREATE INDEX idx_creator_profiles_verification ON public.creator_profiles(verification_status);
CREATE INDEX idx_card_templates_creator_id ON public.card_templates_creator(creator_id);
CREATE INDEX idx_card_templates_category ON public.card_templates_creator(category);
CREATE INDEX idx_card_templates_published ON public.card_templates_creator(is_published);
CREATE INDEX idx_creator_earnings_creator_id ON public.creator_earnings(creator_id);
CREATE INDEX idx_creator_earnings_date ON public.creator_earnings(transaction_date);
CREATE INDEX idx_creator_earnings_status ON public.creator_earnings(status);
CREATE INDEX idx_creator_subscriptions_creator ON public.creator_subscriptions(creator_id);
CREATE INDEX idx_creator_subscriptions_status ON public.creator_subscriptions(status);
CREATE INDEX idx_creator_commissions_creator ON public.creator_commissions(creator_id);
CREATE INDEX idx_creator_commissions_status ON public.creator_commissions(status);

-- Enable Row Level Security
ALTER TABLE public.creator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.card_templates_creator ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_commissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for creator_profiles
CREATE POLICY "Creators can view their own profile" ON public.creator_profiles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Public can view verified creator profiles" ON public.creator_profiles
  FOR SELECT USING (verification_status = 'verified');

CREATE POLICY "Creators can update their own profile" ON public.creator_profiles
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can create creator profile" ON public.creator_profiles
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- RLS Policies for card_templates_creator
CREATE POLICY "Creators can manage their templates" ON public.card_templates_creator
  FOR ALL USING (creator_id IN (SELECT id FROM public.creator_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Public can view published templates" ON public.card_templates_creator
  FOR SELECT USING (is_published = true);

-- RLS Policies for creator_earnings
CREATE POLICY "Creators can view their earnings" ON public.creator_earnings
  FOR SELECT USING (creator_id IN (SELECT id FROM public.creator_profiles WHERE user_id = auth.uid()));

-- RLS Policies for creator_subscriptions
CREATE POLICY "Creators can view their subscriptions" ON public.creator_subscriptions
  FOR SELECT USING (creator_id IN (SELECT id FROM public.creator_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Subscribers can view their subscriptions" ON public.creator_subscriptions
  FOR SELECT USING (subscriber_id = auth.uid());

CREATE POLICY "Users can create subscriptions" ON public.creator_subscriptions
  FOR INSERT WITH CHECK (subscriber_id = auth.uid());

-- RLS Policies for creator_commissions
CREATE POLICY "Creators can view their commissions" ON public.creator_commissions
  FOR SELECT USING (creator_id IN (SELECT id FROM public.creator_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Clients can view their commissions" ON public.creator_commissions
  FOR SELECT USING (client_id = auth.uid());

CREATE POLICY "Users can create commission requests" ON public.creator_commissions
  FOR INSERT WITH CHECK (client_id = auth.uid());

-- Functions for calculating creator metrics
CREATE OR REPLACE FUNCTION calculate_creator_earnings(creator_uuid UUID, start_date DATE DEFAULT NULL, end_date DATE DEFAULT NULL)
RETURNS TABLE(
  total_earnings NUMERIC,
  pending_earnings NUMERIC,
  paid_earnings NUMERIC,
  transaction_count INTEGER
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(net_amount), 0) as total_earnings,
    COALESCE(SUM(CASE WHEN status = 'pending' THEN net_amount ELSE 0 END), 0) as pending_earnings,
    COALESCE(SUM(CASE WHEN status = 'paid' THEN net_amount ELSE 0 END), 0) as paid_earnings,
    COUNT(*)::INTEGER as transaction_count
  FROM public.creator_earnings 
  WHERE creator_id = creator_uuid
    AND (start_date IS NULL OR transaction_date >= start_date)
    AND (end_date IS NULL OR transaction_date <= end_date);
END;
$$;

-- Function to update creator stats
CREATE OR REPLACE FUNCTION update_creator_stats()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF TG_TABLE_NAME = 'creator_earnings' THEN
    UPDATE public.creator_profiles 
    SET total_earnings = (
      SELECT COALESCE(SUM(net_amount), 0) 
      FROM public.creator_earnings 
      WHERE creator_id = COALESCE(NEW.creator_id, OLD.creator_id) 
      AND status = 'paid'
    )
    WHERE id = COALESCE(NEW.creator_id, OLD.creator_id);
  ELSIF TG_TABLE_NAME = 'cards' THEN
    UPDATE public.creator_profiles 
    SET cards_created = (
      SELECT COUNT(*) 
      FROM public.cards 
      WHERE creator_id = COALESCE(NEW.creator_id, OLD.creator_id)
    )
    WHERE user_id = COALESCE(NEW.creator_id, OLD.creator_id);
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Triggers for updating creator stats
CREATE TRIGGER update_creator_earnings_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.creator_earnings
  FOR EACH ROW EXECUTE FUNCTION update_creator_stats();

CREATE TRIGGER update_creator_cards_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.cards
  FOR EACH ROW EXECUTE FUNCTION update_creator_stats();

-- Function for automated monthly payouts
CREATE OR REPLACE FUNCTION process_creator_payouts()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  creator_record RECORD;
  pending_amount NUMERIC;
BEGIN
  FOR creator_record IN 
    SELECT cp.id, cp.user_id, cp.stripe_account_id, cp.payout_enabled
    FROM public.creator_profiles cp
    WHERE cp.verification_status = 'verified' 
    AND cp.payout_enabled = true
    AND cp.stripe_account_id IS NOT NULL
  LOOP
    -- Calculate pending earnings
    SELECT COALESCE(SUM(net_amount), 0) INTO pending_amount
    FROM public.creator_earnings
    WHERE creator_id = creator_record.id 
    AND status = 'pending'
    AND amount >= 10.00; -- Minimum payout threshold
    
    -- Only process if there's a meaningful amount
    IF pending_amount >= 10.00 THEN
      -- This would trigger a Stripe transfer via an edge function
      -- For now, we'll mark as ready for payout
      UPDATE public.creator_earnings
      SET status = 'ready_for_payout'
      WHERE creator_id = creator_record.id 
      AND status = 'pending';
    END IF;
  END LOOP;
END;
$$;
