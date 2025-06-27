
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CardTemplate {
  id: string;
  name: string;
  description: string | null;
  category: string;
  preview_url: string | null;
  template_data: any;
  creator_id: string | null;
  is_public: boolean;
  is_premium: boolean;
  usage_count: number;
  created_at: string;
}

export const useCardTemplates = (category?: string) => {
  return useQuery({
    queryKey: ['card-templates', category],
    queryFn: async () => {
      let query = supabase
        .from('card_templates')
        .select('*')
        .eq('is_public', true)
        .order('usage_count', { ascending: false });

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as CardTemplate[];
    },
  });
};

export const useTemplateCategories = () => {
  return useQuery({
    queryKey: ['template-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('card_templates')
        .select('category')
        .eq('is_public', true);

      if (error) throw error;

      const categories = [...new Set(data.map(item => item.category))];
      return categories;
    },
  });
};
