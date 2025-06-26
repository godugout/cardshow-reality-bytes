
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { ThemeCard } from '../data/cardThemesData';

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
            current_market_value: Math.floor(Math.random() * 100) + 10,
            tags: [theme, cardData.card_type, cardData.rarity]
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
          description: `A curated collection of ${theme.toLowerCase()} themed cards.`,
          user_id: userId,
          visibility: 'public' as any,
          is_featured: true
        })
        .select()
        .single();

      if (collectionError || !collection) {
        console.error('Error creating collection:', collectionError);
        return;
      }

      const { data: cards, error: cardsError } = await supabase
        .from('cards')
        .select('id')
        .contains('tags', [theme])
        .eq('creator_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

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
