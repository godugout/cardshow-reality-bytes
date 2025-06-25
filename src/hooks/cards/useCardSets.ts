
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseErrorHandler } from '@/hooks/useSupabaseErrorHandler';

export const useCardSets = () => {
  const { handleError } = useSupabaseErrorHandler();

  const { data: sets = [], isLoading } = useQuery({
    queryKey: ['card-sets'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('sets')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data;
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
