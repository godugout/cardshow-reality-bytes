
-- Drop ALL existing policies on collections table to avoid conflicts
DROP POLICY IF EXISTS "Collections viewable by permission" ON public.collections;
DROP POLICY IF EXISTS "Users create own collections" ON public.collections;
DROP POLICY IF EXISTS "Owners update own collections" ON public.collections;
DROP POLICY IF EXISTS "Owners delete own collections" ON public.collections;
DROP POLICY IF EXISTS "Collections are viewable by authenticated users" ON public.collections;
DROP POLICY IF EXISTS "Users can create collections" ON public.collections;
DROP POLICY IF EXISTS "Users can update own collections" ON public.collections;
DROP POLICY IF EXISTS "Users can delete own collections" ON public.collections;
DROP POLICY IF EXISTS "Collections viewable by users" ON public.collections;
DROP POLICY IF EXISTS "Users create collections" ON public.collections;
DROP POLICY IF EXISTS "Users update collections" ON public.collections;
DROP POLICY IF EXISTS "Users delete collections" ON public.collections;
DROP POLICY IF EXISTS "Users can view public collections or their own" ON public.collections;
DROP POLICY IF EXISTS "Users can create their own collections" ON public.collections;
DROP POLICY IF EXISTS "Users can update their own collections" ON public.collections;
DROP POLICY IF EXISTS "Users can delete their own collections" ON public.collections;

-- Drop the problematic functions that cause recursion
DROP FUNCTION IF EXISTS public.can_view_collection(uuid, uuid);
DROP FUNCTION IF EXISTS public.is_collection_owner(uuid, uuid);

-- Create new, simplified RLS policies without recursion
CREATE POLICY "Collections select policy" ON public.collections
  FOR SELECT USING (
    visibility = 'public' 
    OR user_id = auth.uid()
    OR (
      visibility = 'shared' 
      AND EXISTS (
        SELECT 1 FROM public.collection_followers cf 
        WHERE cf.collection_id = id AND cf.follower_id = auth.uid()
      )
    )
  );

CREATE POLICY "Collections insert policy" ON public.collections
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Collections update policy" ON public.collections
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Collections delete policy" ON public.collections
  FOR DELETE USING (auth.uid() = user_id);
