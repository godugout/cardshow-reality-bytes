
-- Complete cleanup of all collections RLS policies and functions to fix infinite recursion
-- This will remove ALL existing policies and functions, then create clean ones

-- First, disable RLS temporarily to avoid issues during cleanup
ALTER TABLE public.collections DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies (including any we might have missed)
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'collections' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.collections', policy_record.policyname);
    END LOOP;
END $$;

-- Drop ALL functions that might reference collections table
DROP FUNCTION IF EXISTS public.can_view_collection(uuid, uuid);
DROP FUNCTION IF EXISTS public.can_view_collection(uuid);
DROP FUNCTION IF EXISTS public.is_collection_owner(uuid, uuid);
DROP FUNCTION IF EXISTS public.is_collection_owner(uuid);
DROP FUNCTION IF EXISTS public.get_collection_owner(uuid);
DROP FUNCTION IF EXISTS public.check_collection_access(uuid);

-- Re-enable RLS
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;

-- Create the simplest possible policies without any function calls or subqueries
CREATE POLICY "collections_select_policy" ON public.collections
  FOR SELECT USING (
    visibility = 'public' OR user_id = auth.uid()
  );

CREATE POLICY "collections_insert_policy" ON public.collections
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "collections_update_policy" ON public.collections
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "collections_delete_policy" ON public.collections
  FOR DELETE USING (user_id = auth.uid());
