
import { useState, useCallback } from 'react';
import { useChats } from './useChats';
import { useMessages } from './useMessages';
import { useSendMessage } from './useSendMessage';
import { useToggleAI } from './useToggleAI';
import { Chat, Message, SupabaseChat, Tag } from '@/types/chat';
import { Product } from '@/types/product';
import { mapSupabaseChatToAppFormat } from './chatApiUtils';
import { useApiQuery } from '@/hooks/api/useApiQuery';
import { useQueryClient } from '@tanstack/react-query';
import { ChatApiHook } from './types';

export const useChatApi = (): ChatApiHook => {
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const [chatTags, setChatTags] = useState<Record<string, Tag[]>>({});
  
  // Получаем список чатов
  const { 
    data: chatsData,
    isLoading: isLoadingChats,
    error: chatsError,
    refetch: refetchChats
  } = useChats();
  
  // Методы API для работы с чатами
  const { data: messages, isLoading: isMessagesLoading, error: messagesError, refetch: refetchMessages } = useMessages(currentChatId);
  const sendMessageMutation = useSendMessage();
  const toggleAIMutation = useToggleAI();
  
  // Функции-обертки для удобного использования
  const sendMessage = async (chatId: string, content: string, product?: Product) => {
    return await sendMessageMutation.mutateAsync({ chatId, content, product });
  };
  
  const toggleAI = async (chatId: string, enabled: boolean) => {
    return await toggleAIMutation.mutateAsync({ chatId, enabled });
  };
  
  // Получение информации о конкретном чате
  const getChat = (chatId: string) => {
    const result = useApiQuery<SupabaseChat>({
      endpoint: `chat-api/chat/${chatId}`,
      queryKey: ['chat-api', chatId],
      options: {
        requiresAuth: true
      },
      queryOptions: {
        select: (data: SupabaseChat) => mapSupabaseChatToAppFormat(data),
        enabled: !!chatId,
        staleTime: 10000
      },
      errorMessage: "Ошибка получения информации о чате"
    });
    
    // Преобразуем результат, чтобы он соответствовал ожидаемому типу возврата
    return {
      data: result.data as Chat | null,
      isLoading: result.isLoading,
      error: result.error,
      refetch: result.refetch
    };
  };
  
  // Получение сообщений для конкретного чата
  const getMessages = useCallback((chatId: string) => {
    if (chatId === currentChatId) {
      return {
        data: messages || [],
        isLoading: isMessagesLoading,
        error: messagesError,
        refetch: refetchMessages
      };
    }
    
    // Если запрашивается другой чат, запрашиваем его сообщения
    const { data, isLoading, error, refetch } = useMessages(chatId);
    return {
      data: data || [],
      isLoading,
      error,
      refetch
    };
  }, [currentChatId, messages, isMessagesLoading, messagesError, refetchMessages]);
  
  // Получение тегов для чата
  const getChatTags = (chatId: string): Tag[] => {
    return chatTags[chatId] || [];
  };
  
  // Установка тегов для чата
  const setChatTagsForChat = (chatId: string, tags: Tag[]) => {
    setChatTags(prev => ({
      ...prev,
      [chatId]: tags
    }));
    
    // Обновляем кэш запроса чатов
    queryClient.invalidateQueries({ queryKey: ['chats-api'] });
  };
  
  // Force refresh всех чатов
  const forceRefetchChats = useCallback(() => {
    console.log("[useChatApi] Force refreshing chats");
    queryClient.invalidateQueries({ queryKey: ['chats-api'] });
    refetchChats();
  }, [queryClient, refetchChats]);
  
  return {
    chats: chatsData?.chats || [],
    isLoadingChats,
    chatsError,
    refetchChats: forceRefetchChats,
    currentChatId,
    setCurrentChatId,
    getChat,
    getMessages,
    sendMessage,
    toggleAI,
    getChatTags,
    setChatTags: setChatTagsForChat,
    isLoading: isLoadingChats
  };
};
