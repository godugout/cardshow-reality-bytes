
-- Add onboarding tracking columns to creator_profiles table
ALTER TABLE public.creator_profiles 
ADD COLUMN onboarding_step text DEFAULT 'welcome',
ADD COLUMN onboarding_completed boolean DEFAULT false;

-- Create index for faster queries on onboarding status
CREATE INDEX idx_creator_profiles_onboarding ON public.creator_profiles(onboarding_completed, onboarding_step);
