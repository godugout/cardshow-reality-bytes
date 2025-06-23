
-- Create auction_bids table for real-time bidding
CREATE TABLE public.auction_bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auction_id UUID REFERENCES public.marketplace_listings(id) ON DELETE CASCADE,
  bidder_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  bid_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_winning_bid BOOLEAN DEFAULT false,
  proxy_max_amount NUMERIC(10,2),
  bid_type TEXT DEFAULT 'manual' CHECK (bid_type IN ('manual', 'proxy', 'auto_increment')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create market_analytics table for price tracking
CREATE TABLE public.market_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id UUID REFERENCES public.cards(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  avg_price NUMERIC(10,2),
  volume INTEGER DEFAULT 0,
  transactions INTEGER DEFAULT 0,
  price_change_24h NUMERIC(5,2),
  market_cap NUMERIC(12,2),
  liquidity_score NUMERIC(3,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(card_id, date)
);

-- Create user_watchlists table for saved searches and alerts
CREATE TABLE public.user_watchlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  search_criteria JSONB NOT NULL DEFAULT '{}',
  alert_enabled BOOLEAN DEFAULT true,
  alert_conditions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create marketplace_reviews table for seller ratings
CREATE TABLE public.marketplace_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES public.transactions(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  reviewed_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  review_type TEXT DEFAULT 'seller' CHECK (review_type IN ('seller', 'buyer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(transaction_id, reviewer_id, reviewed_id)
);

-- Create card_recommendations table for AI recommendations
CREATE TABLE public.card_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id UUID REFERENCES public.cards(id) ON DELETE CASCADE,
  recommendation_score NUMERIC(3,2),
  recommendation_type TEXT DEFAULT 'trending' CHECK (recommendation_type IN ('trending', 'similar', 'investment', 'wishlist')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days')
);

-- Create portfolio_tracking table for investment tracking
CREATE TABLE public.portfolio_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id UUID REFERENCES public.cards(id) ON DELETE CASCADE,
  purchase_price NUMERIC(10,2),
  purchase_date TIMESTAMP WITH TIME ZONE,
  current_value NUMERIC(10,2),
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_auction_bids_auction_id ON public.auction_bids(auction_id);
CREATE INDEX idx_auction_bids_bidder_id ON public.auction_bids(bidder_id);
CREATE INDEX idx_auction_bids_amount ON public.auction_bids(amount DESC);
CREATE INDEX idx_market_analytics_card_date ON public.market_analytics(card_id, date DESC);
CREATE INDEX idx_user_watchlists_user_id ON public.user_watchlists(user_id);
CREATE INDEX idx_marketplace_reviews_reviewed_id ON public.marketplace_reviews(reviewed_id);
CREATE INDEX idx_card_recommendations_user_id ON public.card_recommendations(user_id);
CREATE INDEX idx_portfolio_tracking_user_id ON public.portfolio_tracking(user_id);

-- Enable RLS on all tables
ALTER TABLE public.auction_bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_watchlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.card_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_tracking ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all auction bids" ON public.auction_bids FOR SELECT USING (true);
CREATE POLICY "Users can create their own bids" ON public.auction_bids FOR INSERT WITH CHECK (auth.uid() = bidder_id);

CREATE POLICY "Market analytics are public" ON public.market_analytics FOR SELECT USING (true);

CREATE POLICY "Users can manage their own watchlists" ON public.user_watchlists FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view reviews for sellers" ON public.marketplace_reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews for their transactions" ON public.marketplace_reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Users can view their own recommendations" ON public.card_recommendations FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own portfolio" ON public.portfolio_tracking FOR ALL USING (auth.uid() = user_id);

-- Create functions for auction management
CREATE OR REPLACE FUNCTION public.place_bid(
  p_auction_id UUID,
  p_amount NUMERIC,
  p_proxy_max NUMERIC DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_bid_id UUID;
  v_current_high NUMERIC;
  v_auction_end TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Check if auction is still active
  SELECT auction_end_time INTO v_auction_end
  FROM public.marketplace_listings
  WHERE id = p_auction_id AND listing_type = 'auction' AND status = 'active';
  
  IF v_auction_end IS NULL OR v_auction_end < NOW() THEN
    RAISE EXCEPTION 'Auction is not active or has ended';
  END IF;
  
  -- Get current highest bid
  SELECT COALESCE(MAX(amount), 0) INTO v_current_high
  FROM public.auction_bids
  WHERE auction_id = p_auction_id;
  
  -- Validate bid amount
  IF p_amount <= v_current_high THEN
    RAISE EXCEPTION 'Bid must be higher than current highest bid';
  END IF;
  
  -- Mark previous winning bids as not winning
  UPDATE public.auction_bids
  SET is_winning_bid = false
  WHERE auction_id = p_auction_id AND is_winning_bid = true;
  
  -- Insert new bid
  INSERT INTO public.auction_bids (auction_id, bidder_id, amount, proxy_max_amount, is_winning_bid)
  VALUES (p_auction_id, auth.uid(), p_amount, p_proxy_max, true)
  RETURNING id INTO v_bid_id;
  
  -- Extend auction if bid placed in last 5 minutes (sniping protection)
  IF v_auction_end - NOW() < INTERVAL '5 minutes' THEN
    UPDATE public.marketplace_listings
    SET auction_end_time = auction_end_time + INTERVAL '5 minutes'
    WHERE id = p_auction_id;
  END IF;
  
  RETURN v_bid_id;
END;
$$;

-- Create function to update market analytics
CREATE OR REPLACE FUNCTION public.update_market_analytics(
  p_card_id UUID,
  p_sale_price NUMERIC
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_today DATE := CURRENT_DATE;
  v_yesterday DATE := CURRENT_DATE - INTERVAL '1 day';
  v_yesterday_avg NUMERIC;
BEGIN
  -- Get yesterday's average price for comparison
  SELECT avg_price INTO v_yesterday_avg
  FROM public.market_analytics
  WHERE card_id = p_card_id AND date = v_yesterday;
  
  -- Update or insert today's analytics
  INSERT INTO public.market_analytics (card_id, date, avg_price, volume, transactions, price_change_24h)
  VALUES (
    p_card_id,
    v_today,
    p_sale_price,
    1,
    1,
    CASE WHEN v_yesterday_avg > 0 THEN ((p_sale_price - v_yesterday_avg) / v_yesterday_avg * 100) ELSE 0 END
  )
  ON CONFLICT (card_id, date)
  DO UPDATE SET
    avg_price = ((market_analytics.avg_price * market_analytics.transactions) + p_sale_price) / (market_analytics.transactions + 1),
    volume = market_analytics.volume + 1,
    transactions = market_analytics.transactions + 1,
    price_change_24h = CASE WHEN v_yesterday_avg > 0 THEN ((EXCLUDED.avg_price - v_yesterday_avg) / v_yesterday_avg * 100) ELSE 0 END;
END;
$$;

-- Enable realtime for auction bids
ALTER PUBLICATION supabase_realtime ADD TABLE public.auction_bids;
ALTER PUBLICATION supabase_realtime ADD TABLE public.market_analytics;
ALTER PUBLICATION supabase_realtime ADD TABLE public.marketplace_reviews;
