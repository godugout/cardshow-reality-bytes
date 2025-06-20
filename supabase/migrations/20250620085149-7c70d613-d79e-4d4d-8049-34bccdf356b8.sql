
-- Drop existing policies that conflict
DROP POLICY IF EXISTS "Users can create their own collections" ON public.collections;
DROP POLICY IF EXISTS "Users can update their own collections" ON public.collections;
DROP POLICY IF EXISTS "Users can delete their own collections" ON public.collections;
DROP POLICY IF EXISTS "Users can view public collections or their own" ON public.collections;

-- Create collection_cards junction table with enhanced tracking
CREATE TABLE IF NOT EXISTS public.collection_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
  card_id UUID NOT NULL REFERENCES public.cards(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  display_order INTEGER DEFAULT 0,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  added_by UUID REFERENCES auth.users(id),
  notes TEXT,
  UNIQUE(collection_id, card_id)
);

-- Create collection_followers for subscription tracking
CREATE TABLE IF NOT EXISTS public.collection_followers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  followed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notification_settings JSONB DEFAULT '{"new_cards": true, "updates": true}',
  UNIQUE(collection_id, follower_id)
);

-- Create collection_activity_log for change tracking
CREATE TABLE IF NOT EXISTS public.collection_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  target_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create collection_ratings table
CREATE TABLE IF NOT EXISTS public.collection_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(collection_id, user_id)
);

-- Add missing columns to existing collections table
ALTER TABLE public.collections 
ADD COLUMN IF NOT EXISTS cover_image_url TEXT,
ADD COLUMN IF NOT EXISTS template_id UUID REFERENCES public.collection_templates(id),
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Enable RLS on new tables
ALTER TABLE public.collection_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_ratings ENABLE ROW LEVEL SECURITY;

-- Create new RLS policies for collections
CREATE POLICY "Users can view public collections or their own" ON public.collections
  FOR SELECT USING (
    visibility = 'public' OR 
    owner_id = auth.uid() OR 
    id IN (SELECT collection_id FROM public.collection_followers WHERE follower_id = auth.uid())
  );

CREATE POLICY "Users can create their own collections" ON public.collections
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own collections" ON public.collections
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own collections" ON public.collections
  FOR DELETE USING (auth.uid() = owner_id);

-- RLS Policies for collection_cards
CREATE POLICY "Users can view cards in accessible collections" ON public.collection_cards
  FOR SELECT USING (
    collection_id IN (
      SELECT id FROM public.collections 
      WHERE visibility = 'public' OR owner_id = auth.uid()
    )
  );

CREATE POLICY "Collection owners can manage cards" ON public.collection_cards
  FOR ALL USING (
    collection_id IN (SELECT id FROM public.collections WHERE owner_id = auth.uid())
  );

-- RLS Policies for collection_followers
CREATE POLICY "Users can view followers of public collections" ON public.collection_followers
  FOR SELECT USING (
    collection_id IN (SELECT id FROM public.collections WHERE visibility = 'public')
  );

CREATE POLICY "Users can manage their own follows" ON public.collection_followers
  FOR ALL USING (auth.uid() = follower_id);

-- RLS Policies for collection_activity_log
CREATE POLICY "Users can view activity of accessible collections" ON public.collection_activity_log
  FOR SELECT USING (
    collection_id IN (
      SELECT id FROM public.collections 
      WHERE visibility = 'public' OR owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can log activity in their collections" ON public.collection_activity_log
  FOR INSERT WITH CHECK (
    collection_id IN (SELECT id FROM public.collections WHERE owner_id = auth.uid())
  );

-- RLS Policies for collection_ratings
CREATE POLICY "Anyone can view ratings" ON public.collection_ratings
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their own ratings" ON public.collection_ratings
  FOR ALL USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_collection_cards_collection ON public.collection_cards(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_cards_card ON public.collection_cards(card_id);
CREATE INDEX IF NOT EXISTS idx_collection_followers_collection ON public.collection_followers(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_followers_follower ON public.collection_followers(follower_id);
CREATE INDEX IF NOT EXISTS idx_collection_activity_collection ON public.collection_activity_log(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_ratings_collection ON public.collection_ratings(collection_id);

-- Create functions for collection statistics
CREATE OR REPLACE FUNCTION public.get_collection_stats(collection_uuid UUID)
RETURNS TABLE (
  total_cards BIGINT,
  unique_cards BIGINT,
  total_value NUMERIC,
  completion_percentage NUMERIC,
  last_updated TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(cc.quantity), 0) as total_cards,
    COUNT(cc.card_id) as unique_cards,
    COALESCE(SUM(c.current_market_value * cc.quantity), 0) as total_value,
    CASE 
      WHEN (SELECT total_supply FROM public.sets s JOIN public.cards c ON c.set_id = s.id LIMIT 1) > 0
      THEN (COUNT(cc.card_id)::NUMERIC / (SELECT total_supply FROM public.sets s JOIN public.cards c ON c.set_id = s.id LIMIT 1)::NUMERIC) * 100
      ELSE 0
    END as completion_percentage,
    MAX(cc.added_at) as last_updated
  FROM public.collection_cards cc
  LEFT JOIN public.cards c ON c.id = cc.card_id
  WHERE cc.collection_id = collection_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically update collection timestamps
CREATE OR REPLACE FUNCTION public.update_collection_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.collections 
  SET updated_at = NOW() 
  WHERE id = COALESCE(NEW.collection_id, OLD.collection_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_collection_timestamp ON public.collection_cards;
CREATE TRIGGER trigger_update_collection_timestamp
  AFTER INSERT OR UPDATE OR DELETE ON public.collection_cards
  FOR EACH ROW EXECUTE FUNCTION public.update_collection_timestamp();

-- Create function to log collection activities
CREATE OR REPLACE FUNCTION public.log_collection_activity()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.collection_activity_log (collection_id, user_id, action, target_id, metadata)
    VALUES (NEW.collection_id, COALESCE(NEW.added_by, auth.uid()), 'card_added', NEW.card_id, 
            json_build_object('quantity', NEW.quantity, 'notes', NEW.notes));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.collection_activity_log (collection_id, user_id, action, target_id, metadata)
    VALUES (NEW.collection_id, auth.uid(), 'card_updated', NEW.card_id,
            json_build_object('old_quantity', OLD.quantity, 'new_quantity', NEW.quantity));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.collection_activity_log (collection_id, user_id, action, target_id, metadata)
    VALUES (OLD.collection_id, auth.uid(), 'card_removed', OLD.card_id,
            json_build_object('quantity', OLD.quantity));
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_log_collection_activity ON public.collection_cards;
CREATE TRIGGER trigger_log_collection_activity
  AFTER INSERT OR UPDATE OR DELETE ON public.collection_cards
  FOR EACH ROW EXECUTE FUNCTION public.log_collection_activity();

-- Enable realtime for collection tables
ALTER TABLE public.collections REPLICA IDENTITY FULL;
ALTER TABLE public.collection_cards REPLICA IDENTITY FULL;
ALTER TABLE public.collection_followers REPLICA IDENTITY FULL;
ALTER TABLE public.collection_activity_log REPLICA IDENTITY FULL;
ALTER TABLE public.collection_ratings REPLICA IDENTITY FULL;

ALTER PUBLICATION supabase_realtime ADD TABLE public.collection_cards;
ALTER PUBLICATION supabase_realtime ADD TABLE public.collection_followers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.collection_activity_log;
ALTER PUBLICATION supabase_realtime ADD TABLE public.collection_ratings;
