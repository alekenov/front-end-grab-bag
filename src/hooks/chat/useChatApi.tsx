
import { useMessages } from "./useMessages";
import { useChats } from "./useChats";
import { useSendMessage } from "./useSendMessage";
import { useToggleAI } from "./useToggleAI";

export function useChatApi() {
  // Получаем список чатов
  const { data, isPending: isLoadingChats, error: chatsError, refetch: refetchChats } = useChats();
  const chats = data?.chats || [];

  // Хуки для различных операций с чатами
  const { mutateAsync: sendMessageMutation, isPending: isSendingMessage } = useSendMessage();
  const { mutateAsync: toggleAIMutation, isPending: isTogglingAI } = useToggleAI();

  // Функция для отправки сообщения в указанный чат
  const sendMessage = async (chatId: string, content: string, product?: any) => {
    // Проверяем, не является ли это демо-чатом
    if (chatId.startsWith('demo-')) {
      console.log('[useChatApi] Skipping API call for demo chat:', chatId);
      return null;
    }
    
    console.log(`[useChatApi] Sending message to chat ${chatId}: ${content}`);
    return await sendMessageMutation({ chatId, content, product });
  };

  // Функция для включения/выключения AI для чата
  const toggleAI = async (chatId: string, enabled: boolean) => {
    // Проверяем, не является ли это демо-чатом
    if (chatId.startsWith('demo-')) {
      console.log('[useChatApi] Skipping API call for demo chat:', chatId);
      return null;
    }
    
    console.log(`[useChatApi] Toggle AI for chat ${chatId}: ${enabled}`);
    return await toggleAIMutation({ chatId, enabled });
  };

  // Функция для получения сообщений чата
  const getMessages = (chatId: string | null) => {
    return useMessages(chatId);
  };

  return {
    chats,
    isLoadingChats,
    chatsError,
    sendMessage,
    isSendingMessage,
    toggleAI,
    isTogglingAI,
    getMessages,
    refetchChats
  };
}
