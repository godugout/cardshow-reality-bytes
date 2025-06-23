
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export const useTradePresence = (tradeId: string) => {
  const { user } = useAuth();

  const updatePresence = async (isTyping: boolean = false) => {
    if (!user || !tradeId) return;

    await supabase
      .from('trade_participants')
      .upsert({
        trade_id: tradeId,
        user_id: user.id,
        is_typing: isTyping,
        last_seen: new Date().toISOString(),
        presence_status: 'online',
      });
  };

  const setTyping = (isTyping: boolean) => {
    updatePresence(isTyping);
  };

  const markOnline = () => {
    updatePresence(false);
  };

  return { setTyping, markOnline };
};
