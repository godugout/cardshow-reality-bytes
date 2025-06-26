
-- Fix infinite recursion in collections RLS policies
-- Drop ALL existing policies on collections table to avoid conflicts
DROP POLICY IF EXISTS "Collections viewable by permission" ON public.collections;
DROP POLICY IF EXISTS "Users create own collections" ON public.collections;
DROP POLICY IF EXISTS "Owners update own collections" ON public.collections;
DROP POLICY IF EXISTS "Owners delete own collections" ON public.collections;
DROP POLICY IF EXISTS "Collections are viewable by authenticated users" ON public.collections;
DROP POLICY IF EXISTS "Users can create collections" ON public.collections;
DROP POLICY IF EXISTS "Users can update own collections" ON public.collections;
DROP POLICY IF EXISTS "Users can delete own collections" ON public.collections;

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS public.can_view_collection(uuid, uuid);
DROP FUNCTION IF EXISTS public.is_collection_owner(uuid, uuid);

-- Create new, simplified RLS policies without recursion
CREATE POLICY "Collections viewable by users" ON public.collections
  FOR SELECT USING (
    visibility = 'public' 
    OR user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.collection_followers cf 
      WHERE cf.collection_id = id AND cf.follower_id = auth.uid()
    )
  );

CREATE POLICY "Users create collections" ON public.collections
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update collections" ON public.collections
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users delete collections" ON public.collections
  FOR DELETE USING (auth.uid() = user_id);
