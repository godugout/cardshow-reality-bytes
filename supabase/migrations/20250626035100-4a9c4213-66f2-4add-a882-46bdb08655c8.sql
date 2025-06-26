
-- Ensure gallery_preferences table has correct schema
-- Add any missing columns that the useGalleryPreferences hook expects
ALTER TABLE public.gallery_preferences 
ADD COLUMN IF NOT EXISTS layout_type TEXT DEFAULT 'circular' CHECK (layout_type IN ('circular', 'gallery_wall', 'spiral', 'grid', 'random_scatter'));

-- Ensure the environment_theme column exists with correct type
ALTER TABLE public.gallery_preferences 
ADD COLUMN IF NOT EXISTS environment_theme TEXT DEFAULT 'auto' CHECK (environment_theme IN ('auto', 'dark', 'light', 'cosmic', 'nature'));

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_gallery_preferences_user_id ON public.gallery_preferences(user_id);
