
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Chat, SupabaseChat } from "@/types/chat";
import { supabase } from "@/integrations/supabase/client";

export function useChatDetails(currentChatId: string | null) {
  const [chatName, setChatName] = useState("");
  
  // Fetch chat details
  const { data: chatDetails, error: chatError } = useQuery({
    queryKey: ['chat', currentChatId],
    queryFn: async () => {
      if (!currentChatId) return null;
      
      try {
        // Проверяем, является ли чат демо-чатом
        if (currentChatId.startsWith('demo-')) {
          // Для демо-чатов возвращаем заглушку
          const demoChat: Chat = {
            id: currentChatId,
            name: "Демо чат",
            aiEnabled: true,
            unreadCount: 0,
          };
          return demoChat;
        }
        
        const { data, error } = await supabase
          .from('chats')
          .select('*')
          .eq('id', currentChatId)
          .single();
          
        if (error) {
          console.error('Error fetching chat details:', error);
          throw error;
        }
        
        // Convert Supabase data to our app format
        const supabaseChat = data as SupabaseChat;
        const chat: Chat = {
          id: supabaseChat.id,
          name: supabaseChat.name || (supabaseChat.phone_number ? `WhatsApp ${supabaseChat.phone_number}` : "Новый контакт"),
          aiEnabled: supabaseChat.ai_enabled || false,
          unreadCount: supabaseChat.unread_count || 0,
          created_at: supabaseChat.created_at || undefined,
          updated_at: supabaseChat.updated_at || undefined,
          source: supabaseChat.source || "web"
        };
        
        return chat;
      } catch (error) {
        console.error('Error in chat details query:', error);
        
        // Возвращаем пустой объект для демо режима при ошибке
        if (currentChatId.startsWith('demo-')) {
          const demoChat: Chat = {
            id: currentChatId,
            name: "Демо чат",
            aiEnabled: true,
            unreadCount: 0,
          };
          return demoChat;
        }
        
        return null;
      }
    },
    enabled: !!currentChatId,
    staleTime: 30000 // Кешируем данные на 30 секунд
  });

  useEffect(() => {
    if (chatDetails) {
      setChatName(chatDetails.name || "");
      console.log("[useChatDetails] Chat details loaded:", chatDetails);
    }
  }, [chatDetails]);

  // Логируем ошибки для отладки
  useEffect(() => {
    if (chatError) {
      console.error('[useChatDetails] Chat details error:', chatError);
    }
  }, [chatError]);

  return {
    chatDetails,
    chatName,
    setChatName,
    chatError
  };
}
