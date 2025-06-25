
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseErrorHandler } from '@/hooks/useSupabaseErrorHandler';

interface CardSet {
  id: string;
  name: string;
  description?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  release_date?: string;
  total_cards?: number;
}

export const useCardSets = (): { sets: CardSet[]; isLoading: boolean } => {
  const { handleError } = useSupabaseErrorHandler();

  const { data: sets = [], isLoading }: UseQueryResult<CardSet[], Error> = useQuery({
    queryKey: ['card-sets'] as const,
    queryFn: async (): Promise<CardSet[]> => {
      try {
        const { data, error } = await supabase
          .from('sets')
          .select('id, name, description, is_published, created_at, updated_at, release_date, total_cards')
          .eq('is_published', true)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return (data || []) as CardSet[];
      } catch (error) {
        handleError(error, {
          operation: 'fetch_sets',
          table: 'sets'
        });
        throw error;
      }
    }
  });

  return { sets, isLoading };
};
