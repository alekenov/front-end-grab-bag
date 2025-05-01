
import { useQuery } from "@tanstack/react-query";
import { Message } from "@/types/chat";
import { supabase } from "@/integrations/supabase/client";
import { CHAT_API_URL, formatSupabaseMessage, getAuthSession } from "./chatApiUtils";

export const useMessages = (chatId: string | null) => {
  return useQuery({
    queryKey: ['messages-api', chatId],
    queryFn: async (): Promise<Message[]> => {
      if (!chatId) return [];
      
      try {
        console.log('Fetching messages for chat ID:', chatId);
        
        // Try to get messages directly from Supabase
        const { data: supabaseMessages, error: supabaseError } = await supabase
          .from('messages')
          .select('*')
          .eq('chat_id', chatId)
          .order('created_at', { ascending: true });
          
        if (!supabaseError && supabaseMessages) {
          console.log('Получено сообщений из Supabase:', supabaseMessages.length);
          return supabaseMessages.map(formatSupabaseMessage);
        }
        
        // Fallback to Edge Function if Supabase direct query fails
        console.log('Trying to fetch messages via Edge Function API');
        
        // Get current session for Edge Function
        const { accessToken } = await getAuthSession();
        
        const response = await fetch(`${CHAT_API_URL}/messages?chatId=${chatId}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Не удалось загрузить сообщения");
        }
        
        const data = await response.json();
        return data.messages || [];
        
      } catch (error) {
        console.error('Error fetching messages:', error);
        throw error;
      }
    },
    enabled: !!chatId
  });
};
