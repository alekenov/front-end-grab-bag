
import { useQuery } from "@tanstack/react-query";
import { Chat } from "@/types/chat";
import { supabase } from "@/integrations/supabase/client";
import { CHAT_API_URL, getAuthSession } from "./chatApiUtils";

export const useChats = () => {
  return useQuery({
    queryKey: ['chats-api'],
    queryFn: async (): Promise<Chat[]> => {
      try {
        // Get current session
        const { accessToken } = await getAuthSession();
        
        // Try to fetch chats directly from Supabase
        const { data: supabaseChats, error: supabaseError } = await supabase
          .from('chats')
          .select('*')
          .order('updated_at', { ascending: false });
          
        if (!supabaseError && supabaseChats) {
          console.log('Получено чатов из Supabase:', supabaseChats.length);
          
          // Get the latest message for each chat
          const chatsWithMessages = await Promise.all(
            supabaseChats.map(async (chat) => {
              const { data: messages } = await supabase
                .from('messages')
                .select('content, created_at')
                .eq('chat_id', chat.id)
                .order('created_at', { ascending: false })
                .limit(1);
                
              return {
                id: chat.id,
                name: chat.name,
                aiEnabled: chat.ai_enabled,
                unreadCount: chat.unread_count || 0,
                lastMessage: messages && messages.length > 0 ? {
                  content: messages[0].content || "",
                  timestamp: messages[0].created_at || ""
                } : undefined,
                created_at: chat.created_at,
                updated_at: chat.updated_at
              };
            })
          );
          
          return chatsWithMessages;
        }
        
        // Fallback to Edge Function if Supabase direct query fails
        console.log('Trying to fetch chats via Edge Function API');
        
        const response = await fetch(`${CHAT_API_URL}/chats`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Не удалось загрузить список чатов");
        }
        
        const data = await response.json();
        return data.chats || [];
      } catch (error) {
        console.error('Error fetching chats:', error);
        throw error;
      }
    }
  });
};
