
import { supabase } from '@/integrations/supabase/client';

export const createThemedCollection = async (theme: string, userId: string) => {
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
