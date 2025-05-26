
import { useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Хук для управления автообновлением данных чата
 */
export function useChatUpdates(chatId: string | null, isDemoChat: boolean = false) {
  const queryClient = useQueryClient();

  // Функция принудительного обновления
  const forceRefresh = useCallback(() => {
    if (!chatId) return;
    
    console.log("[useChatUpdates] Force refreshing chat data for:", chatId);
    
    // Инвалидируем все связанные запросы
    queryClient.invalidateQueries({ queryKey: ['chats-api'] });
    queryClient.invalidateQueries({ queryKey: ['chats'] });
    queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
    queryClient.invalidateQueries({ queryKey: ['messages-api', chatId] });
    
    // Принудительно перезапрашиваем данные
    setTimeout(() => {
      queryClient.refetchQueries({ queryKey: ['chats-api'] });
      queryClient.refetchQueries({ queryKey: ['chats'] });
      queryClient.refetchQueries({ queryKey: ['messages', chatId] });
      queryClient.refetchQueries({ queryKey: ['messages-api', chatId] });
    }, 300);
  }, [chatId, queryClient]);

  // Обновление после отправки сообщения
  const refreshAfterMessage = useCallback(() => {
    if (!chatId || isDemoChat) return;
    
    console.log("[useChatUpdates] Refreshing after message for:", chatId);
    
    // Немедленно инвалидируем кэш
    queryClient.invalidateQueries({ queryKey: ['messages-api', chatId] });
    queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
    queryClient.invalidateQueries({ queryKey: ['chats-api'] });
    queryClient.invalidateQueries({ queryKey: ['chats'] });
    
    // Перезапрашиваем с разными интервалами для надежности
    setTimeout(() => {
      queryClient.refetchQueries({ queryKey: ['messages-api', chatId] });
      queryClient.refetchQueries({ queryKey: ['messages', chatId] });
    }, 300);
    
    setTimeout(() => {
      queryClient.refetchQueries({ queryKey: ['messages-api', chatId] });
      queryClient.refetchQueries({ queryKey: ['messages', chatId] });
    }, 1000);
    
    setTimeout(() => {
      queryClient.refetchQueries({ queryKey: ['chats-api'] });
      queryClient.refetchQueries({ queryKey: ['chats'] });
    }, 500);
    
    setTimeout(() => {
      queryClient.refetchQueries({ queryKey: ['chats-api'] });
      queryClient.refetchQueries({ queryKey: ['chats'] });
    }, 1500);
  }, [chatId, isDemoChat, queryClient]);

  // Настройка периодического обновления
  useEffect(() => {
    if (!chatId || isDemoChat) return;
    
    const intervalId = setInterval(() => {
      console.log("[useChatUpdates] Periodic refresh triggered for:", chatId);
      queryClient.invalidateQueries({ queryKey: ['messages-api', chatId] });
      queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
      queryClient.refetchQueries({ queryKey: ['messages-api', chatId] });
      queryClient.refetchQueries({ queryKey: ['messages', chatId] });
    }, 10000); // Обновление каждые 10 секунд

    return () => clearInterval(intervalId);
  }, [chatId, isDemoChat, queryClient]);

  return {
    forceRefresh,
    refreshAfterMessage
  };
}
