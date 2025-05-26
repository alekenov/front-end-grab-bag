
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Хук для управления навигацией в чатах
 */
export function useChatNavigation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Нормализация ID чата
  const normalizeChatId = useCallback((chatId: string | null): string | null => {
    if (!chatId) return null;
    return chatId;
  }, []);

  // Установка текущего чата
  const setCurrentChatId = useCallback((id: string | null) => {
    if (id) {
      console.log("[useChatNavigation] Setting current chat ID:", id);
      
      // Обновляем URL при выборе чата
      navigate(`/?chatId=${id}`, { replace: true });
      
      // Принудительно обновляем список чатов при смене чата
      queryClient.invalidateQueries({ queryKey: ['chats-api'] });
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ['chats-api'] });
        queryClient.refetchQueries({ queryKey: ['chats'] });
      }, 300);
    } else {
      navigate('/', { replace: true });
    }
  }, [navigate, queryClient]);

  // Навигация к товарам из чата
  const navigateToProducts = useCallback((currentChatId: string | null) => {
    if (currentChatId) {
      localStorage.setItem("current_chat_id", currentChatId);
      console.log("[useChatNavigation] Saved current chat ID before navigation:", currentChatId);
    }
    navigate('/products', { state: { fromChat: true } });
  }, [navigate]);

  // Возврат из товаров в чат
  const returnFromProducts = useCallback(() => {
    const savedChatId = localStorage.getItem("current_chat_id");
    if (savedChatId) {
      console.log("[useChatNavigation] Returning to chat:", savedChatId);
      setCurrentChatId(savedChatId);
      localStorage.removeItem("current_chat_id");
    } else {
      navigate('/');
    }
  }, [navigate, setCurrentChatId]);

  return {
    normalizeChatId,
    setCurrentChatId,
    navigateToProducts,
    returnFromProducts
  };
}
