
-- Function to increment article view count
CREATE OR REPLACE FUNCTION public.increment_article_views(article_id UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE public.knowledge_base 
  SET view_count = view_count + 1 
  WHERE id = article_id;
END;
$$;
