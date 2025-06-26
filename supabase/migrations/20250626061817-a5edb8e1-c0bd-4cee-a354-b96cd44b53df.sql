
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
DROP POLICY IF EXISTS "Collections viewable by users" ON public.collections;
DROP POLICY IF EXISTS "Users create collections" ON public.collections;
DROP POLICY IF EXISTS "Users update collections" ON public.collections;
DROP POLICY IF EXISTS "Users delete collections" ON public.collections;

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS public.can_view_collection(uuid, uuid);
DROP FUNCTION IF EXISTS public.is_collection_owner(uuid, uuid);

-- Create security definer functions to avoid recursion
CREATE OR REPLACE FUNCTION public.can_view_collection(collection_id uuid, user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.collections c
    WHERE c.id = collection_id
    AND (
      c.visibility = 'public' 
      OR c.user_id = user_id
      OR EXISTS (
        SELECT 1 FROM public.collection_followers cf 
        WHERE cf.collection_id = collection_id AND cf.follower_id = user_id
      )
    )
  );
$$;

CREATE OR REPLACE FUNCTION public.is_collection_owner(collection_id uuid, user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.collections c
    WHERE c.id = collection_id AND c.user_id = user_id
  );
$$;

-- Create new, simpler RLS policies using functions
CREATE POLICY "Collections viewable by permission" ON public.collections
  FOR SELECT USING (public.can_view_collection(id));

CREATE POLICY "Users create own collections" ON public.collections
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owners update own collections" ON public.collections
  FOR UPDATE USING (public.is_collection_owner(id));

CREATE POLICY "Owners delete own collections" ON public.collections
  FOR DELETE USING (public.is_collection_owner(id));

-- Grant execute permissions on the functions
GRANT EXECUTE ON FUNCTION public.can_view_collection TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_collection_owner TO authenticated;
