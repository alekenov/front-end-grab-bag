
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Chat, SupabaseChat } from "@/types/chat";
import { supabase } from "@/integrations/supabase/client";

/**
 * Функция для нормализации ID чата
 * Преобразует числовые ID в формат demo-{id}
 */
const normalizeChatId = (chatId: string | null): string | null => {
  if (!chatId) return null;
  
  // Если это числовой ID без дефисов, преобразуем его в демо-формат
  if (!isNaN(Number(chatId)) && !chatId.includes('-')) {
    console.log('[useChatDetails] Converting numeric ID to demo format:', chatId);
    return `demo-${chatId}`;
  }
  
  return chatId;
};

export function useChatDetails(currentChatId: string | null) {
  const [chatName, setChatName] = useState<string>("");
  
  // Нормализуем ID чата для единообразия
  const normalizedChatId = normalizeChatId(currentChatId);
  const isDemoChat = normalizedChatId?.startsWith('demo-');
  
  // Логируем преобразование ID чата
  useEffect(() => {
    if (currentChatId) {
      console.log('[useChatDetails] Original chat ID:', currentChatId);
      console.log('[useChatDetails] Normalized chat ID:', normalizedChatId);
      console.log('[useChatDetails] Is demo chat:', isDemoChat);
    }
  }, [currentChatId, normalizedChatId, isDemoChat]);
  
  // Запрос деталей чата
  const { data: chatDetails, error: chatError } = useQuery({
    queryKey: ['chat', normalizedChatId],
    queryFn: async () => {
      if (!normalizedChatId) return null;
      
      console.log('[useChatDetails] Fetching details for chat:', normalizedChatId);
      
      try {
        // Проверяем, является ли чат демо-чатом
        if (isDemoChat) {
          console.log('[useChatDetails] Using demo chat data');
          const demoChat: Chat = {
            id: normalizedChatId,
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
          .eq('id', normalizedChatId)
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
        if (isDemoChat) {
          return {
            id: normalizedChatId,
            name: "Демо чат",
            aiEnabled: true,
            unreadCount: 0,
          };
        }
        
        // Возможно, подобрать fallback для отображения вместо ошибки
        return {
          id: normalizedChatId,
          name: "Чат недоступен",
          aiEnabled: false,
          unreadCount: 0,
          error: true
        };
      }
    },
    enabled: !!normalizedChatId,
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
    chatError,
    isDemoChat
  };
}
