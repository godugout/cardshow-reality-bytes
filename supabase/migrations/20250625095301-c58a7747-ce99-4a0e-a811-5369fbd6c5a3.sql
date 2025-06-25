
-- Fix collections RLS policies by removing all existing policies and creating clean, non-recursive ones

-- Drop ALL existing policies on collections table to avoid conflicts
DROP POLICY IF EXISTS "Collections are viewable based on permissions" ON public.collections;
DROP POLICY IF EXISTS "Users can create collections" ON public.collections;
DROP POLICY IF EXISTS "Owners can update collections" ON public.collections;
DROP POLICY IF EXISTS "Owners can delete collections" ON public.collections;
DROP POLICY IF EXISTS "Users can view public collections or their own" ON public.collections;
DROP POLICY IF EXISTS "Users can create their own collections" ON public.collections;
DROP POLICY IF EXISTS "Users can update their own collections" ON public.collections;
DROP POLICY IF EXISTS "Users can delete their own collections" ON public.collections;
DROP POLICY IF EXISTS "Collections viewable by permission" ON public.collections;
DROP POLICY IF EXISTS "Users create own collections" ON public.collections;
DROP POLICY IF EXISTS "Owners update own collections" ON public.collections;
DROP POLICY IF EXISTS "Owners delete own collections" ON public.collections;

-- Drop existing functions if they exist to avoid conflicts
DROP FUNCTION IF EXISTS public.can_view_collection(uuid, uuid);
DROP FUNCTION IF EXISTS public.is_collection_owner(uuid, uuid);

-- Create clean, simple RLS policies without recursive references
CREATE POLICY "Users can view public collections" ON public.collections
  FOR SELECT USING (visibility = 'public');

CREATE POLICY "Users can view their own collections" ON public.collections
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view shared collections they follow" ON public.collections
  FOR SELECT USING (
    visibility = 'shared' 
    AND id IN (
      SELECT collection_id FROM public.collection_followers 
      WHERE follower_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own collections" ON public.collections
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own collections" ON public.collections
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own collections" ON public.collections
  FOR DELETE USING (auth.uid() = user_id);
