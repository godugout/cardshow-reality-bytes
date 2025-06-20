
-- Create card_type enum
CREATE TYPE public.card_type AS ENUM ('athlete', 'creature', 'spell', 'artifact', 'vehicle', 'character');

-- Create card_rarity enum (recreate to ensure all values)
DROP TYPE IF EXISTS public.card_rarity CASCADE;
CREATE TYPE public.card_rarity AS ENUM ('common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic');

-- Create sets table for card sets/collections
CREATE TABLE public.sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  release_date DATE,
  total_cards INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add new columns to cards table (including rarity if it doesn't exist)
ALTER TABLE public.cards 
ADD COLUMN IF NOT EXISTS rarity public.card_rarity DEFAULT 'common',
ADD COLUMN IF NOT EXISTS card_type public.card_type DEFAULT 'character',
ADD COLUMN IF NOT EXISTS power INTEGER,
ADD COLUMN IF NOT EXISTS toughness INTEGER,
ADD COLUMN IF NOT EXISTS mana_cost JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS abilities TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS set_id UUID REFERENCES public.sets(id),
ADD COLUMN IF NOT EXISTS serial_number INTEGER,
ADD COLUMN IF NOT EXISTS royalty_percentage DECIMAL(5,2) DEFAULT 5.00,
ADD COLUMN IF NOT EXISTS base_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS current_market_value DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS favorite_count INTEGER DEFAULT 0;

-- Create card_favorites table
CREATE TABLE public.card_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id UUID NOT NULL REFERENCES public.cards(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, card_id)
);

-- Enable RLS on new tables
ALTER TABLE public.sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.card_favorites ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for sets
CREATE POLICY "Anyone can view sets" ON public.sets
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create sets" ON public.sets
  FOR INSERT TO authenticated WITH CHECK (true);

-- Create RLS policies for card_favorites
CREATE POLICY "Users can view all favorites" ON public.card_favorites
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their own favorites" ON public.card_favorites
  FOR ALL USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_cards_card_type ON public.cards(card_type);
CREATE INDEX IF NOT EXISTS idx_cards_rarity ON public.cards(rarity);
CREATE INDEX IF NOT EXISTS idx_cards_set_id ON public.cards(set_id);
CREATE INDEX IF NOT EXISTS idx_cards_creator_public ON public.cards(creator_id, is_public);
CREATE INDEX IF NOT EXISTS idx_cards_market_value ON public.cards(current_market_value);
CREATE INDEX IF NOT EXISTS idx_card_favorites_user ON public.card_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_card_favorites_card ON public.card_favorites(card_id);

-- Create function to update favorite count
CREATE OR REPLACE FUNCTION update_card_favorite_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.cards SET favorite_count = favorite_count + 1 WHERE id = NEW.card_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.cards SET favorite_count = favorite_count - 1 WHERE id = OLD.card_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for favorite count updates
DROP TRIGGER IF EXISTS trigger_update_favorite_count ON public.card_favorites;
CREATE TRIGGER trigger_update_favorite_count
  AFTER INSERT OR DELETE ON public.card_favorites
  FOR EACH ROW EXECUTE FUNCTION update_card_favorite_count();

-- Insert sample sets
INSERT INTO public.sets (name, description, release_date, total_cards) VALUES
('Genesis Collection', 'The original Cardshow trading card collection featuring legendary athletes and mythical creatures', '2024-01-01', 100),
('Digital Legends', 'Premium digital-first collection showcasing the future of trading cards', '2024-03-15', 75),
('Sports Heroes 2024', 'Current season athletes and rising stars across all major sports', '2024-06-01', 120);

-- Insert sample cards with a fallback for creator_id
INSERT INTO public.cards (
  title, description, image_url, creator_id, card_type, rarity, power, toughness, 
  mana_cost, abilities, set_id, serial_number, total_supply, base_price, 
  current_market_value, is_public, royalty_percentage
) VALUES 
-- Sports Athletes
('Michael Lightning', 'Elite basketball player known for incredible speed and three-point accuracy', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400', COALESCE((SELECT id FROM auth.users LIMIT 1), gen_random_uuid()), 'athlete', 'legendary', 95, 85, '{"energy": 3, "speed": 2}', ARRAY['Quick Strike', 'Three Point Master', 'Leadership'], (SELECT id FROM public.sets WHERE name = 'Sports Heroes 2024' LIMIT 1), 1, 100, 299.99, 450.00, true, 7.5),

('Sarah Thunderstrike', 'Professional soccer midfielder with unmatched field vision', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400', COALESCE((SELECT id FROM auth.users LIMIT 1), gen_random_uuid()), 'athlete', 'epic', 88, 92, '{"energy": 2, "agility": 3}', ARRAY['Field Vision', 'Perfect Pass', 'Endurance'], (SELECT id FROM public.sets WHERE name = 'Sports Heroes 2024' LIMIT 1), 2, 250, 149.99, 225.00, true, 6.0),

-- Fantasy Creatures
('Ancient Fire Dragon', 'A legendary beast from the volcanic peaks, master of flame magic', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400', COALESCE((SELECT id FROM auth.users LIMIT 1), gen_random_uuid()), 'creature', 'mythic', 120, 100, '{"fire": 5, "earth": 2}', ARRAY['Flame Breath', 'Ancient Wisdom', 'Flying', 'Intimidate'], (SELECT id FROM public.sets WHERE name = 'Genesis Collection' LIMIT 1), 1, 50, 799.99, 1200.00, true, 10.0),

('Mystic Storm Wizard', 'Master of elemental magic with control over wind and lightning', 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400', COALESCE((SELECT id FROM auth.users LIMIT 1), gen_random_uuid()), 'character', 'legendary', 75, 60, '{"air": 3, "lightning": 2}', ARRAY['Lightning Bolt', 'Storm Shield', 'Teleport'], (SELECT id FROM public.sets WHERE name = 'Genesis Collection' LIMIT 1), 5, 150, 199.99, 285.00, true, 8.0),

-- Sci-fi Characters
('Cyber Warrior X7', 'Enhanced soldier from the future with advanced combat protocols', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400', COALESCE((SELECT id FROM auth.users LIMIT 1), gen_random_uuid()), 'character', 'epic', 110, 80, '{"tech": 4, "energy": 1}', ARRAY['Cyber Strike', 'Shield Protocol', 'Enhanced Reflexes'], (SELECT id FROM public.sets WHERE name = 'Digital Legends' LIMIT 1), 10, 200, 179.99, 220.00, true, 6.5),

('Quantum Speedster', 'Time-manipulating hero who can phase between dimensions', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400', COALESCE((SELECT id FROM auth.users LIMIT 1), gen_random_uuid()), 'character', 'legendary', 85, 70, '{"time": 3, "quantum": 2}', ARRAY['Phase Shift', 'Time Dilation', 'Speed Force'], (SELECT id FROM public.sets WHERE name = 'Digital Legends' LIMIT 1), 3, 100, 349.99, 425.00, true, 9.0),

-- Common/Uncommon cards for variety
('Forest Guardian', 'Peaceful protector of the ancient woodlands', 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400', COALESCE((SELECT id FROM auth.users LIMIT 1), gen_random_uuid()), 'creature', 'uncommon', 45, 65, '{"nature": 2, "earth": 1}', ARRAY['Healing Aura', 'Nature Bond'], (SELECT id FROM public.sets WHERE name = 'Genesis Collection' LIMIT 1), 25, 500, 29.99, 35.00, true, 4.0),

('Rookie Pitcher', 'Rising star in professional baseball with a killer fastball', 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=400', COALESCE((SELECT id FROM auth.users LIMIT 1), gen_random_uuid()), 'athlete', 'common', 65, 55, '{"energy": 1}', ARRAY['Fastball', 'Focus'], (SELECT id FROM public.sets WHERE name = 'Sports Heroes 2024' LIMIT 1), 50, 1000, 9.99, 12.00, true, 3.0),

('Tech Drone MK-II', 'Advanced reconnaissance drone with AI capabilities', 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400', COALESCE((SELECT id FROM auth.users LIMIT 1), gen_random_uuid()), 'artifact', 'rare', 30, 40, '{"tech": 2}', ARRAY['Scanner', 'Stealth Mode', 'Data Link'], (SELECT id FROM public.sets WHERE name = 'Digital Legends' LIMIT 1), 15, 300, 79.99, 95.00, true, 5.0),

('Shadow Assassin', 'Stealthy operative skilled in infiltration and elimination', 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=400', COALESCE((SELECT id FROM auth.users LIMIT 1), gen_random_uuid()), 'character', 'rare', 80, 45, '{"shadow": 2, "agility": 1}', ARRAY['Stealth Strike', 'Shadow Step', 'Poison Blade'], (SELECT id FROM public.sets WHERE name = 'Genesis Collection' LIMIT 1), 20, 400, 119.99, 140.00, true, 5.5);

-- Update sets with correct total_cards count
UPDATE public.sets SET total_cards = (
  SELECT COUNT(*) FROM public.cards WHERE set_id = public.sets.id
);

-- Enable realtime for cards table
ALTER TABLE public.cards REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.cards;
ALTER PUBLICATION supabase_realtime ADD TABLE public.card_favorites;
