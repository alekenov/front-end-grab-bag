import { Product } from "@/types/product";
import { useChats } from "./useChats";
import { useMessages } from "./useMessages";
import { useSendMessage } from "./useSendMessage";
import { useToggleAI } from "./useToggleAI";
import { ChatApiHook } from "./types";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

/**
 * Хук для унифицированного доступа к API чатов
 * Объединяет все операции с чатами в одном месте
 */
export function useChatApi(): ChatApiHook {
  // Получаем QueryClient для управления кэшем
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Настраиваем периодическое обновление данных
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log("[useChatApi] Periodic global chats refresh");
      queryClient.invalidateQueries({ queryKey: ['chats-api'] });
      queryClient.refetchQueries({ queryKey: ['chats-api'] });
    }, 10000); // Увеличил интервал обновления до 10 секунд

    return () => clearInterval(intervalId);
  }, [queryClient]);
  
  // Получаем данные о чатах
  const { 
    data: chatsData, 
    isLoading: isLoadingChats,
    error: chatsError,
    refetch: refetchChats
  } = useChats();

  // Проверяем структуру данных и извлекаем массив чатов
  // Добавляем логирование для отладки
  console.log("[useChatApi] Raw chats data:", chatsData);
  
  // Обеспечиваем, что chats всегда будет массивом
  const chats = chatsData?.chats || [];
  console.log("[useChatApi] Processed chats:", chats);

  const sendMessageMutation = useSendMessage();
  const toggleAIMutation = useToggleAI();

  // Функция для принудительного обновления списка чатов
  const forceRefreshChats = useCallback(() => {
    console.log("[useChatApi] Force refreshing chats");
    queryClient.invalidateQueries({ queryKey: ['chats-api'] });
    queryClient.invalidateQueries({ queryKey: ['chats'] });
    
    // Серия обновлений с задержкой для гарантированного обновления данных
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
    console.log('[DEBUG] useChatApi.getMessages вызван с chatId:', chatId);
    
    const { 
      data = [], 
      isLoading, 
      error, 
      refetch 
    } = useMessages(chatId);

    console.log('[DEBUG] useChatApi.getMessages получены данные от useMessages:', data);
    
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
    console.log("[useChatApi] Sending message:", { chatId, content, product });
    
    if (!content.trim()) {
      console.warn("[useChatApi] Attempted to send empty message");
      toast({
        title: "Ошибка отправки",
        description: "Нельзя отправить пустое сообщение",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const result = await sendMessageMutation.mutateAsync({ chatId, content, product });
      
      // Принудительно обновляем список чатов и сообщений
      queryClient.invalidateQueries({ queryKey: ['messages-api', chatId] });
      forceRefreshChats();
      
      // Явно запрашиваем обновление сообщений
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ['messages-api', chatId] });
      }, 300);
      
      return result;
    } catch (error) {
      console.error("[useChatApi] Error sending message:", error);
      toast({
        title: "Ошибка отправки",
        description: "Не удалось отправить сообщение",
        variant: "destructive",
      });
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
