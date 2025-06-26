
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { ThemeCard } from '../data/cardThemesData';

export const useCardGeneration = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Realistic pricing based on rarity
  const getRarityPricing = (rarity: string) => {
    const pricing = {
      common: { min: 1, max: 8, avg: 3 },
      uncommon: { min: 5, max: 20, avg: 12 },
      rare: { min: 15, max: 75, avg: 35 },
      epic: { min: 50, max: 200, avg: 100 },
      legendary: { min: 150, max: 800, avg: 350 },
      mythic: { min: 500, max: 2000, avg: 1000 }
    };
    return pricing[rarity as keyof typeof pricing] || pricing.common;
  };

  // Generate realistic supply numbers
  const getSupplyNumbers = (rarity: string) => {
    const supplies = {
      common: { min: 1000, max: 10000 },
      uncommon: { min: 500, max: 5000 },
      rare: { min: 100, max: 1000 },
      epic: { min: 50, max: 500 },
      legendary: { min: 10, max: 100 },
      mythic: { min: 1, max: 25 }
    };
    return supplies[rarity as keyof typeof supplies] || supplies.common;
  };

  // Generate realistic engagement numbers
  const getEngagementNumbers = (rarity: string) => {
    const baseMultiplier = {
      common: 1,
      uncommon: 2,
      rare: 4,
      epic: 8,
      legendary: 15,
      mythic: 30
    };
    const multiplier = baseMultiplier[rarity as keyof typeof baseMultiplier] || 1;
    
    return {
      view_count: Math.floor(Math.random() * 1000 * multiplier) + 10,
      favorite_count: Math.floor(Math.random() * 100 * multiplier) + 1
    };
  };

  const generateCards = async (theme: string, cards: ThemeCard[]) => {
    setIsLoading(true);
    setProgress(0);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in to create cards.',
          variant: 'destructive'
        });
        return;
      }

      let createdCount = 0;
      const totalCards = cards.length;

      for (const cardData of cards) {
        setProgress((createdCount / totalCards) * 100);
        
        const pricing = getRarityPricing(cardData.rarity);
        const supply = getSupplyNumbers(cardData.rarity);
        const engagement = getEngagementNumbers(cardData.rarity);
        
        // Add some randomness to pricing within the range
        const marketValue = Math.floor(
          Math.random() * (pricing.max - pricing.min) + pricing.min
        );
        
        const totalSupply = Math.floor(
          Math.random() * (supply.max - supply.min) + supply.min
        );

        const { error } = await supabase
          .from('cards')
          .insert({
            title: cardData.title,
            description: cardData.description,
            image_url: cardData.image_url,
            rarity: cardData.rarity as any,
            card_type: cardData.card_type as any,
            power: cardData.power,
            toughness: cardData.toughness,
            abilities: cardData.abilities,
            creator_id: user.id,
            is_public: true,
            visibility: 'public' as any,
            current_market_value: marketValue,
            base_price: Math.floor(marketValue * 0.8), // Base price slightly lower than market
            total_supply: totalSupply,
            current_supply: totalSupply,
            serial_number: cardData.serial_number || Math.floor(Math.random() * totalSupply) + 1,
            view_count: engagement.view_count,
            favorite_count: engagement.favorite_count,
            royalty_percentage: 5 + Math.random() * 10, // 5-15% royalty
            tags: [theme, cardData.card_type, cardData.rarity, 'sample-data'],
            is_tradeable: true,
            marketplace_listing: Math.random() > 0.7, // 30% chance of being listed
            verification_status: 'approved'
          });

        if (error) {
          console.error(`Error creating card ${cardData.title}:`, error);
        } else {
          createdCount++;
        }

        await new Promise(resolve => setTimeout(resolve, 100));
      }

      setProgress(100);
      
      toast({
        title: 'Cards Created Successfully',
        description: `Created ${createdCount} cards for the ${theme} theme.`
      });

      await createThemedCollection(theme, user.id);

    } catch (error) {
      console.error('Error generating cards:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate cards. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  };

  const createThemedCollection = async (theme: string, userId: string) => {
    try {
      const { data: collection, error: collectionError } = await supabase
        .from('collections')
        .insert({
          title: `${theme} Collection`,
          description: `A curated collection of ${theme.toLowerCase()} themed cards featuring rare and powerful cards from this theme.`,
          user_id: userId,
          visibility: 'public' as any,
          is_featured: Math.random() > 0.5, // 50% chance of being featured
          is_public: true
        })
        .select()
        .single();

      if (collectionError || !collection) {
        console.error('Error creating collection:', collectionError);
        return;
      }

      // Get recently created cards for this theme
      const { data: cards, error: cardsError } = await supabase
        .from('cards')
        .select('id')
        .contains('tags', [theme])
        .eq('creator_id', userId)
        .order('created_at', { ascending: false })
        .limit(15); // Include more cards in collections

      if (cardsError || !cards) {
        console.error('Error fetching theme cards:', cardsError);
        return;
      }

      const collectionCards = cards.map((card, index) => ({
        collection_id: collection.id,
        card_id: card.id,
        display_order: index
      }));

      const { error: cardInsertError } = await supabase
        .from('collection_cards')
        .insert(collectionCards);

      if (cardInsertError) {
        console.error('Error adding cards to collection:', cardInsertError);
      }

    } catch (error) {
      console.error('Error creating themed collection:', error);
    }
  };

  return {
    isLoading,
    progress,
    generateCards
  };
};
