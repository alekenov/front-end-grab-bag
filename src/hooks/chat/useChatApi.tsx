
import { Product } from "@/types/product";
import { useChats } from "./useChats";
import { useMessages } from "./useMessages";
import { useSendMessage } from "./useSendMessage";
import { useToggleAI } from "./useToggleAI";
import { ChatApiHook } from "./types";

/**
 * Хук для унифицированного доступа к API чатов
 * Объединяет все операции с чатами в одном месте
 */
export function useChatApi(): ChatApiHook {
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

  return {
    chats,
    isLoadingChats,
    chatsError,
    refetchChats,
    getMessages,
    // Обертка над API для отправки сообщений
    sendMessage: (chatId: string, content: string, product?: Product) => 
      sendMessageMutation.mutateAsync({ chatId, content, product }),
    // Обертка над API для включения/выключения ИИ
    toggleAI: (chatId: string, enabled: boolean) => 
      toggleAIMutation.mutateAsync({ chatId, enabled }),
  };
}
