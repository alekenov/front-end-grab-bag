
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Chat, SupabaseChat } from "@/types/chat";
import { supabase } from "@/integrations/supabase/client";

export function useChatDetails(currentChatId: string | null) {
  const [chatName, setChatName] = useState<string>("");
  
  // Запрос деталей чата
  const { data: chatDetails, error: chatError } = useQuery({
    queryKey: ['chat', currentChatId],
    queryFn: async () => {
      if (!currentChatId) return null;
      
      console.log('[useChatDetails] Fetching details for chat:', currentChatId);
      
      try {
        // Проверяем, является ли чат демо-чатом
        if (currentChatId.startsWith('demo-')) {
          console.log('[useChatDetails] Using demo chat data');
          const demoChat: Chat = {
            id: currentChatId,
            name: "Демо чат",
            aiEnabled: true,
            unreadCount: 0,
          };
          return demoChat;
        }
        
        // Запрашиваем данные из Supabase
        const { data, error } = await supabase
          .from('chats')
          .select('*')
          .eq('id', currentChatId)
          .single();
          
        if (error) {
          console.error('[useChatDetails] Error fetching chat details:', error);
          throw error;
        }
        
        console.log('[useChatDetails] Raw chat data:', data);
        
        // Преобразуем данные из Supabase в формат приложения
        const supabaseChat = data as SupabaseChat;
        const chat: Chat = {
          id: supabaseChat.id,
          name: supabaseChat.name || (supabaseChat.phone_number ? `WhatsApp ${supabaseChat.phone_number}` : "Новый контакт"),
          aiEnabled: Boolean(supabaseChat.ai_enabled),
          unreadCount: supabaseChat.unread_count || 0,
          created_at: supabaseChat.created_at,
          updated_at: supabaseChat.updated_at,
          source: supabaseChat.source
        };
        
        console.log('[useChatDetails] Formatted chat data:', chat);
        return chat;
      } catch (error) {
        console.error('[useChatDetails] Error in chat details query:', error);
        
        // Возвращаем демо-чат для демо режима даже при ошибке
        if (currentChatId.startsWith('demo-')) {
          return {
            id: currentChatId,
            name: "Демо чат",
            aiEnabled: true,
            unreadCount: 0,
          };
        }
        
        return null;
      }
    },
    enabled: !!currentChatId,
    staleTime: 30000, // Кешируем данные на 30 секунд
    retry: 1
  });

  // Обновляем состояние имени чата при получении данных
  useEffect(() => {
    if (chatDetails) {
      console.log('[useChatDetails] Setting chat name:', chatDetails.name);
      setChatName(chatDetails.name || "");
    }
  }, [chatDetails]);

  // Логирование ошибок
  useEffect(() => {
    if (chatError) {
      console.error('[useChatDetails] Error fetching chat details:', chatError);
    }
  }, [chatError]);

  return {
    chatDetails,
    chatName,
    setChatName,
    chatError
  };
}
