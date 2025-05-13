
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

export type ChatApiHook = {
  chats: Chat[];
  currentChatId: string | null;
  setCurrentChatId: (id: string | null) => void;
  getChat: (chatId: string) => { 
    data: Chat | null; 
    isLoading: boolean; 
    error: any;
    refetch: () => Promise<any>;
  };
  getMessages: (chatId: string) => { 
    data: Message[]; 
    isLoading: boolean; 
    error: any;
    refetch: () => Promise<any>;
  };
  sendMessage: (chatId: string, content: string, product?: Product) => Promise<void>;
  toggleAI: (chatId: string, enabled: boolean) => Promise<void>;
  getChatTags: (chatId: string) => Tag[];
  setChatTags: (chatId: string, tags: Tag[]) => void;
  isLoading: boolean;
  refetchChats: () => void;
};

export const useChatApi = (): ChatApiHook => {
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const [chatTags, setChatTags] = useState<Record<string, Tag[]>>({});
  
  // Получаем список чатов
  const { 
    data: chatsData,
    isLoading: isChatsLoading,
    refetch: refetchChats
  } = useChats();
  
  // Методы API для работы с чатами
  const { data: messages, isLoading: isMessagesLoading, error: messagesError, refetch: refetchMessages } = useMessages(currentChatId);
  const { sendMessage } = useSendMessage();
  const { toggleAI } = useToggleAI();
  
  // Получение информации о конкретном чате
  const getChat = (chatId: string) => {
    return useApiQuery<SupabaseChat>({
      endpoint: `chat-api/chat/${chatId}`,
      queryKey: ['chat-api', chatId],
      options: {
        requiresAuth: true
      },
      queryOptions: {
        select: (data) => mapSupabaseChatToAppFormat(data),
        enabled: !!chatId,
        staleTime: 10000
      },
      errorMessage: "Ошибка получения информации о чате"
    });
  };
  
  // Получение сообщений для конкретного чата
  const getMessages = useCallback((chatId: string) => {
    if (chatId === currentChatId) {
      return {
        data: messages,
        isLoading: isMessagesLoading,
        error: messagesError,
        refetch: refetchMessages
      };
    }
    
    // Если запрашивается другой чат, запрашиваем его сообщения
    return useMessages(chatId);
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
    currentChatId,
    setCurrentChatId,
    getChat,
    getMessages,
    sendMessage,
    toggleAI,
    getChatTags: getChatTags,
    setChatTags: setChatTagsForChat,
    isLoading: isChatsLoading,
    refetchChats: forceRefetchChats
  };
};
