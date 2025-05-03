
import { Product } from "@/types/product";
import { useChats } from "./useChats";
import { useMessages } from "./useMessages";
import { useSendMessage } from "./useSendMessage";
import { useToggleAI } from "./useToggleAI";
import { ChatApiHook } from "./types";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useCallback } from "react";

/**
 * Хук для унифицированного доступа к API чатов
 * Объединяет все операции с чатами в одном месте
 */
export function useChatApi(): ChatApiHook {
  // Получаем QueryClient для управления кэшем
  const queryClient = useQueryClient();
  
  // Настраиваем периодическое обновление данных
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log("[useChatApi] Periodic global chats refresh");
      queryClient.invalidateQueries({ queryKey: ['chats-api'] });
      queryClient.refetchQueries({ queryKey: ['chats-api'] });
    }, 3000);

    return () => clearInterval(intervalId);
  }, [queryClient]);
  
  // Исправляем деструктуризацию данных, чтобы в chats всегда был массив
  const { 
    data, 
    isLoading: isLoadingChats,
    error: chatsError,
    refetch: refetchChats
  } = useChats();

  // Обеспечиваем, что chats всегда будет массивом
  const chats = Array.isArray(data) ? data : data?.chats || [];

  const sendMessageMutation = useSendMessage();
  const toggleAIMutation = useToggleAI();

  // Функция для принудительного обновления списка чатов
  const forceRefreshChats = useCallback(() => {
    console.log("[useChatApi] Force refreshing chats");
    queryClient.invalidateQueries({ queryKey: ['chats-api'] });
    queryClient.invalidateQueries({ queryKey: ['chats'] });
    
    // Серия обновлений с задержкой
    setTimeout(() => {
      queryClient.refetchQueries({ queryKey: ['chats-api'] });
      queryClient.refetchQueries({ queryKey: ['chats'] });
    }, 300);
    
    setTimeout(() => {
      queryClient.refetchQueries({ queryKey: ['chats-api'] });
      queryClient.refetchQueries({ queryKey: ['chats'] });
      refetchChats();
    }, 1000);
  }, [queryClient, refetchChats]);

  /**
   * Получение сообщений для выбранного чата
   */
  const getMessages = (chatId: string | null) => {
    const { 
      data, 
      isLoading, 
      error, 
      refetch 
    } = useMessages(chatId);

    // Гарантируем, что всегда возвращается массив
    const safeMessages = Array.isArray(data) ? data : [];

    return {
      data: safeMessages,
      isLoading,
      error,
      refetch
    };
  };

  /**
   * Отправка сообщения с принудительным обновлением списка чатов
   */
  const sendMessage = async (chatId: string, content: string, product?: Product) => {
    console.log("[useChatApi] Sending message:", { chatId, content, product });
    
    try {
      const result = await sendMessageMutation.mutateAsync({ chatId, content, product });
      
      // Принудительно обновляем список чатов
      forceRefreshChats();
      
      return result;
    } catch (error) {
      console.error("[useChatApi] Error sending message:", error);
      throw error;
    }
  };

  return {
    chats,
    isLoadingChats,
    chatsError,
    refetchChats: forceRefreshChats,
    getMessages,
    // Используем нашу обертку для отправки сообщений
    sendMessage,
    // Обертка над API для включения/выключения ИИ
    toggleAI: (chatId: string, enabled: boolean) => 
      toggleAIMutation.mutateAsync({ chatId, enabled }),
  };
}
