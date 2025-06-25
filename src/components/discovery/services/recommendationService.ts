
import { supabase } from '@/integrations/supabase/client';
import { transformToCardType } from '@/utils/cardTransforms';
import type { Card as CardType } from '@/types/card';

export async function getUserInteractions(userId: string): Promise<string[]> {
  try {
    const { data } = await supabase
      .from('card_favorites')
      .select('card_id')
      .eq('user_id', userId)
      .limit(10);
    
    return data?.map(f => f.card_id) || [];
  } catch (error) {
    console.error('Error fetching user interactions:', error);
    return [];
  }
}

export async function getTrendingCards(): Promise<CardType[]> {
  try {
    const { data } = await supabase
      .from('cards')
      .select('*, creator:profiles(username, avatar_url)')
      .eq('is_public', true)
      .order('view_count', { ascending: false })
      .limit(8);
    
    return (data || []).map(item => {
      try {
        return transformToCardType(item);
      } catch (error) {
        console.error('Error transforming card:', error, item);
        return null;
      }
    }).filter(Boolean) as CardType[];
  } catch (error) {
    console.error('Error fetching trending cards:', error);
    return [];
  }
}

export async function getSimilarCards(userInteractions: string[] | null): Promise<CardType[]> {
  try {
    if (!userInteractions?.length) {
      return getPopularCards();
    }

    const { data } = await supabase
      .from('cards')
      .select('*, creator:profiles(username, avatar_url)')
      .eq('is_public', true)
      .not('id', 'in', `(${userInteractions.join(',')})`)
      .order('favorite_count', { ascending: false })
      .limit(8);
    
    return (data || []).map(item => {
      try {
        return transformToCardType(item);
      } catch (error) {
        console.error('Error transforming card:', error, item);
        return null;
      }
    }).filter(Boolean) as CardType[];
  } catch (error) {
    console.error('Error fetching similar cards:', error);
    return [];
  }
}

export async function getNewReleases(): Promise<CardType[]> {
  try {
    const { data } = await supabase
      .from('cards')
      .select('*, creator:profiles(username, avatar_url)')
      .eq('is_public', true)
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })
      .limit(8);
    
    return (data || []).map(item => {
      try {
        return transformToCardType(item);
      } catch (error) {
        console.error('Error transforming card:', error, item);
        return null;
      }
    }).filter(Boolean) as CardType[];
  } catch (error) {
    console.error('Error fetching new releases:', error);
    return [];
  }
}

export async function getPopularCards(): Promise<CardType[]> {
  try {
    const { data } = await supabase
      .from('cards')
      .select('*, creator:profiles(username, avatar_url)')
      .eq('is_public', true)
      .order('favorite_count', { ascending: false })
      .limit(8);
    
    return (data || []).map(item => {
      try {
        return transformToCardType(item);
      } catch (error) {
        console.error('Error transforming card:', error, item);
        return null;
      }
    }).filter(Boolean) as CardType[];
  } catch (error) {
    console.error('Error fetching popular cards:', error);
    return [];
  }
}
