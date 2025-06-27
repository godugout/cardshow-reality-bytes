
-- Ensure the metadata column exists in the notifications table
ALTER TABLE public.notifications 
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Also ensure all other expected columns exist
ALTER TABLE public.notifications 
ADD COLUMN IF NOT EXISTS entity_type TEXT,
ADD COLUMN IF NOT EXISTS entity_id UUID;
