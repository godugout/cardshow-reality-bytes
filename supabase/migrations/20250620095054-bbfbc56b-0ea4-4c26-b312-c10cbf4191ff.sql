
-- Create marketplace listings table
CREATE TABLE public.marketplace_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  card_id UUID REFERENCES public.cards(id) ON DELETE CASCADE NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  condition TEXT NOT NULL DEFAULT 'mint' CHECK (condition IN ('mint', 'near_mint', 'excellent', 'good', 'fair', 'poor')),
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  listing_type TEXT NOT NULL DEFAULT 'fixed_price' CHECK (listing_type IN ('fixed_price', 'auction', 'make_offer')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sold', 'cancelled', 'expired')),
  featured BOOLEAN DEFAULT FALSE,
  views INTEGER DEFAULT 0,
  watchers_count INTEGER DEFAULT 0,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  location TEXT,
  estimated_delivery TEXT,
  auction_end_time TIMESTAMPTZ,
  reserve_price DECIMAL(10,2),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  listing_id UUID REFERENCES public.marketplace_listings(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  platform_fee DECIMAL(10,2) NOT NULL,
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_transfer_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded', 'disputed')),
  shipping_info JSONB DEFAULT '{}',
  tracking_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ
);

-- Create seller profiles table for Stripe Connect
CREATE TABLE public.seller_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  stripe_account_id TEXT UNIQUE,
  verification_status TEXT DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
  business_type TEXT CHECK (business_type IN ('individual', 'company')),
  payout_enabled BOOLEAN DEFAULT FALSE,
  charges_enabled BOOLEAN DEFAULT FALSE,
  rating DECIMAL(3,2) DEFAULT 0,
  total_sales INTEGER DEFAULT 0,
  total_revenue DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create marketplace offers table
CREATE TABLE public.marketplace_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES public.marketplace_listings(id) ON DELETE CASCADE NOT NULL,
  buyer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create marketplace watchers table
CREATE TABLE public.marketplace_watchers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES public.marketplace_listings(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(listing_id, user_id)
);

-- Create indexes for performance
CREATE INDEX idx_marketplace_listings_seller ON public.marketplace_listings(seller_id);
CREATE INDEX idx_marketplace_listings_card ON public.marketplace_listings(card_id);
CREATE INDEX idx_marketplace_listings_status ON public.marketplace_listings(status);
CREATE INDEX idx_marketplace_listings_price ON public.marketplace_listings(price);
CREATE INDEX idx_marketplace_listings_created ON public.marketplace_listings(created_at DESC);
CREATE INDEX idx_transactions_buyer ON public.transactions(buyer_id);
CREATE INDEX idx_transactions_seller ON public.transactions(seller_id);
CREATE INDEX idx_transactions_status ON public.transactions(status);
CREATE INDEX idx_seller_profiles_user ON public.seller_profiles(user_id);
CREATE INDEX idx_marketplace_offers_listing ON public.marketplace_offers(listing_id);
CREATE INDEX idx_marketplace_offers_buyer ON public.marketplace_offers(buyer_id);

-- Enable Row Level Security
ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_watchers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for marketplace_listings
CREATE POLICY "Anyone can view active listings" ON public.marketplace_listings
  FOR SELECT USING (status = 'active' OR seller_id = auth.uid());

CREATE POLICY "Sellers can create their own listings" ON public.marketplace_listings
  FOR INSERT WITH CHECK (seller_id = auth.uid());

CREATE POLICY "Sellers can update their own listings" ON public.marketplace_listings
  FOR UPDATE USING (seller_id = auth.uid());

CREATE POLICY "Sellers can delete their own listings" ON public.marketplace_listings
  FOR DELETE USING (seller_id = auth.uid());

-- RLS Policies for transactions
CREATE POLICY "Users can view their own transactions" ON public.transactions
  FOR SELECT USING (buyer_id = auth.uid() OR seller_id = auth.uid());

CREATE POLICY "System can insert transactions" ON public.transactions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "System can update transactions" ON public.transactions
  FOR UPDATE USING (true);

-- RLS Policies for seller_profiles
CREATE POLICY "Anyone can view verified seller profiles" ON public.seller_profiles
  FOR SELECT USING (verification_status = 'verified' OR user_id = auth.uid());

CREATE POLICY "Users can create their own seller profile" ON public.seller_profiles
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own seller profile" ON public.seller_profiles
  FOR UPDATE USING (user_id = auth.uid());

-- RLS Policies for marketplace_offers
CREATE POLICY "Users can view offers on their listings or their own offers" ON public.marketplace_offers
  FOR SELECT USING (
    buyer_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.marketplace_listings WHERE id = listing_id AND seller_id = auth.uid())
  );

CREATE POLICY "Users can create offers" ON public.marketplace_offers
  FOR INSERT WITH CHECK (buyer_id = auth.uid());

CREATE POLICY "Buyers can update their own offers" ON public.marketplace_offers
  FOR UPDATE USING (buyer_id = auth.uid());

-- RLS Policies for marketplace_watchers
CREATE POLICY "Users can view their own watchers" ON public.marketplace_watchers
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create watchers" ON public.marketplace_watchers
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own watchers" ON public.marketplace_watchers
  FOR DELETE USING (user_id = auth.uid());

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_marketplace_listings_updated_at 
  BEFORE UPDATE ON public.marketplace_listings 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_seller_profiles_updated_at 
  BEFORE UPDATE ON public.seller_profiles 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_marketplace_offers_updated_at 
  BEFORE UPDATE ON public.marketplace_offers 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to update listing views
CREATE OR REPLACE FUNCTION public.increment_listing_views(listing_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.marketplace_listings 
  SET views = views + 1 
  WHERE id = listing_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to calculate platform fee (5%)
CREATE OR REPLACE FUNCTION public.calculate_platform_fee(amount DECIMAL)
RETURNS DECIMAL AS $$
BEGIN
  RETURN ROUND(amount * 0.05, 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;
