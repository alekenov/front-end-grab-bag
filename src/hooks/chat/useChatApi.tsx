
import { Product } from "@/types/product";
import { useChats } from "./useChats";
import { useMessages } from "./useMessages";
import { useSendMessage } from "./useSendMessage";
import { useToggleAI } from "./useToggleAI";
import { ChatApiHook } from "./types";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Хук для унифицированного доступа к API чатов
 * Объединяет все операции с чатами в одном месте
 */
export function useChatApi(): ChatApiHook {
  // Получаем QueryClient для управления кэшем
  const queryClient = useQueryClient();
  
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

  /**
   * Получение сообщений для выбранного чата
   */
  const getMessages = (chatId: string | null) => {
    const { 
      data = [], 
      isLoading, 
      error, 
      refetch 
    } = useMessages(chatId);

    return {
      data,
      isLoading,
      error,
      refetch
    };
  };

  /**
   * Отправка сообщения с принудительным обновлением списка чатов
   */
  const sendMessage = async (chatId: string, content: string, product?: Product) => {
    const result = await sendMessageMutation.mutateAsync({ chatId, content, product });
    
    // Принудительно обновляем список чатов после отправки сообщения
    queryClient.invalidateQueries({ queryKey: ['chats-api'] });
    
    return result;
  };

  return {
    chats,
    isLoadingChats,
    chatsError,
    refetchChats,
    getMessages,
    // Используем нашу обертку для отправки сообщений
    sendMessage,
    // Обертка над API для включения/выключения ИИ
    toggleAI: (chatId: string, enabled: boolean) => 
      toggleAIMutation.mutateAsync({ chatId, enabled }),
  };
}
