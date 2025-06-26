
-- Fixed comprehensive database fixes - proper order of operations

-- 1. First, add missing columns to collection_cards if they don't exist
ALTER TABLE public.collection_cards ADD COLUMN IF NOT EXISTS quantity integer DEFAULT 1;
ALTER TABLE public.collection_cards ADD COLUMN IF NOT EXISTS added_by uuid REFERENCES auth.users(id);
ALTER TABLE public.collection_cards ADD COLUMN IF NOT EXISTS notes text;

-- 2. Now create the get_collection_stats function that references quantity
CREATE OR REPLACE FUNCTION public.get_collection_stats(collection_uuid uuid)
RETURNS TABLE(total_cards bigint, unique_cards bigint, total_value numeric, completion_percentage numeric, last_updated timestamp with time zone)
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $function$
  SELECT 
    COALESCE(SUM(cc.quantity), 0)::bigint as total_cards,
    COUNT(cc.card_id)::bigint as unique_cards,
    COALESCE(SUM(c.current_market_value * COALESCE(cc.quantity, 1)), 0) as total_value,
    0::numeric as completion_percentage, -- Simplified for now
    MAX(cc.added_at) as last_updated
  FROM public.collection_cards cc
  LEFT JOIN public.cards c ON c.id = cc.card_id
  WHERE cc.collection_id = collection_uuid;
$function$;

-- 3. Create safe helper functions for collection statistics (non-recursive)
CREATE OR REPLACE FUNCTION public.get_collection_card_count(collection_uuid uuid)
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $function$
  SELECT COUNT(*)::integer FROM public.collection_cards WHERE collection_id = collection_uuid;
$function$;

CREATE OR REPLACE FUNCTION public.get_collection_follower_count(collection_uuid uuid)
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $function$
  SELECT COUNT(*)::integer FROM public.collection_followers WHERE collection_id = collection_uuid;
$function$;

-- 4. Fix the create_collection_from_template function to use user_id instead of owner_id
CREATE OR REPLACE FUNCTION public.create_collection_from_template(template_id uuid, collection_title text, user_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  new_collection_id UUID;
  template_data RECORD;
BEGIN
  -- Get template data
  SELECT * INTO template_data FROM public.collection_templates WHERE id = template_id;
  
  -- Create new collection using user_id instead of owner_id
  INSERT INTO public.collections (title, description, user_id, template_id, visibility)
  VALUES (collection_title, template_data.description, user_id, template_id, 'private')
  RETURNING id INTO new_collection_id;
  
  -- Update template usage count
  UPDATE public.collection_templates 
  SET usage_count = usage_count + 1 
  WHERE id = template_id;
  
  RETURN new_collection_id;
END;
$function$;

-- 5. Remove the is_public column from collections table since we're using visibility
ALTER TABLE public.collections DROP COLUMN IF EXISTS is_public;

-- 6. Update RLS policies for collection_cards to be consistent
DROP POLICY IF EXISTS "Users can view cards in accessible collections" ON public.collection_cards;
DROP POLICY IF EXISTS "Collection owners can manage cards" ON public.collection_cards;

CREATE POLICY "collection_cards_select_policy" ON public.collection_cards
  FOR SELECT USING (
    collection_id IN (
      SELECT id FROM public.collections 
      WHERE visibility = 'public' OR user_id = auth.uid()
    )
  );

CREATE POLICY "collection_cards_insert_policy" ON public.collection_cards
  FOR INSERT WITH CHECK (
    collection_id IN (
      SELECT id FROM public.collections 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "collection_cards_update_policy" ON public.collection_cards
  FOR UPDATE USING (
    collection_id IN (
      SELECT id FROM public.collections 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "collection_cards_delete_policy" ON public.collection_cards
  FOR DELETE USING (
    collection_id IN (
      SELECT id FROM public.collections 
      WHERE user_id = auth.uid()
    )
  );

-- 7. Update collection_followers RLS policies to be consistent
DROP POLICY IF EXISTS "Users can view followers of public collections" ON public.collection_followers;
DROP POLICY IF EXISTS "Users can manage their own follows" ON public.collection_followers;

CREATE POLICY "collection_followers_select_policy" ON public.collection_followers
  FOR SELECT USING (
    collection_id IN (
      SELECT id FROM public.collections 
      WHERE visibility = 'public' OR user_id = auth.uid()
    ) OR follower_id = auth.uid()
  );

CREATE POLICY "collection_followers_insert_policy" ON public.collection_followers
  FOR INSERT WITH CHECK (follower_id = auth.uid());

CREATE POLICY "collection_followers_delete_policy" ON public.collection_followers
  FOR DELETE USING (follower_id = auth.uid());
