-- Add CRD Series One and minting fields to cards table
ALTER TABLE public.cards 
ADD COLUMN IF NOT EXISTS series_one_number INTEGER,
ADD COLUMN IF NOT EXISTS image_locked BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS minting_status TEXT DEFAULT 'not_minted' CHECK (minting_status IN ('not_minted', 'preparing', 'minted', 'failed')),
ADD COLUMN IF NOT EXISTS locked_image_url TEXT,
ADD COLUMN IF NOT EXISTS minting_metadata JSONB DEFAULT '{}';

-- Create unique constraint for series_one_number (only for published cards)
CREATE UNIQUE INDEX IF NOT EXISTS idx_cards_series_one_number 
ON public.cards(series_one_number) 
WHERE series_one_number IS NOT NULL AND is_public = true;

-- Create sequence for series one numbers
CREATE SEQUENCE IF NOT EXISTS series_one_sequence START 1;

-- Function to assign series one number when publishing
CREATE OR REPLACE FUNCTION assign_series_one_number()
RETURNS TRIGGER AS $$
BEGIN
  -- Only assign series number when card is being published (is_public becomes true)
  IF NEW.is_public = true AND OLD.is_public = false AND NEW.series_one_number IS NULL THEN
    NEW.series_one_number := nextval('series_one_sequence');
    NEW.image_locked := true;
    NEW.locked_image_url := NEW.image_url;
  END IF;
  
  -- Prevent changes to locked fields once published
  IF OLD.is_public = true AND OLD.image_locked = true THEN
    NEW.series_one_number := OLD.series_one_number;
    NEW.image_locked := OLD.image_locked;
    NEW.locked_image_url := OLD.locked_image_url;
    NEW.image_url := OLD.locked_image_url; -- Ensure image_url stays locked
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for series one assignment
DROP TRIGGER IF EXISTS trigger_assign_series_one ON public.cards;
CREATE TRIGGER trigger_assign_series_one
  BEFORE UPDATE ON public.cards
  FOR EACH ROW
  EXECUTE FUNCTION assign_series_one_number();