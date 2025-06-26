
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { ThemeCard } from '../data/cardThemesData';
import { calculateCardMetrics } from '../utils/cardPricingUtils';
import { createThemedCollection } from '../utils/collectionUtils';

export const useCardGeneration = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

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
        
        const metrics = calculateCardMetrics(cardData.rarity);

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
            current_market_value: metrics.marketValue,
            base_price: metrics.basePrice,
            total_supply: metrics.totalSupply,
            current_supply: metrics.totalSupply,
            serial_number: cardData.serial_number || Math.floor(Math.random() * metrics.totalSupply) + 1,
            view_count: metrics.viewCount,
            favorite_count: metrics.favoriteCount,
            royalty_percentage: metrics.royaltyPercentage,
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

  return {
    isLoading,
    progress,
    generateCards
  };
};
