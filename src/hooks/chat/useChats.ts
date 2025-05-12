
import { useApiQuery } from "@/hooks/api/useApiQuery";
import { Chat, SupabaseChat } from "@/types/chat";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { TEST_CHATS } from "@/data/mockData"; // Импортируем мок-данные

// Интерфейс для структуры ответа API чатов
interface ChatsResponse {
  chats: Chat[];
}

// Преобразование данных из Supabase в формат приложения
const mapSupabaseChatsToAppFormat = (chats: SupabaseChat[]): Chat[] => {
  return chats.map(chat => ({
    id: chat.id,
    name: chat.name || (chat.phone_number ? `WhatsApp ${chat.phone_number}` : "Новый контакт"),
    aiEnabled: chat.ai_enabled || false,
    unreadCount: chat.unread_count || 0,
    lastMessage: chat.last_message_content || chat.last_message_timestamp 
      ? {
          content: chat.last_message_content || "",
          timestamp: chat.last_message_timestamp || new Date().toISOString(),
          hasProduct: chat.last_message_has_product || false,
          price: chat.last_message_product_price || 0
        }
      : undefined,
    created_at: chat.created_at || undefined,
    updated_at: chat.updated_at || undefined,
    source: chat.source || "web" // Добавляем источник чата
  }));
};

/**
 * Хук для получения списка чатов с использованием общего API-клиента
 * В режиме разработки возвращает мок-данные
 */
export const useChats = () => {
  const queryClient = useQueryClient();

  // Настраиваем периодическое обновление данных
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log("Periodic chats refetch triggered");
      queryClient.invalidateQueries({ queryKey: ['chats-api'] });
      queryClient.refetchQueries({ queryKey: ['chats-api'] });
    }, 10000); // Интервал обновления 10 секунд

    return () => clearInterval(intervalId);
  }, [queryClient]);

  return useApiQuery<ChatsResponse>({
    endpoint: 'chat-api/chats',
    queryKey: ['chats-api'],
    options: {
      // Важно: установим requiresAuth в true, чтобы передавался заголовок авторизации
      requiresAuth: true,
      // Добавляем fallbackData для использования мок-данных при ошибке API
      fallbackData: { chats: TEST_CHATS }
    },
    queryOptions: {
      refetchOnWindowFocus: true,
      refetchInterval: 10000,
      staleTime: 5000,
      select: (data: any) => {
        console.log('Processing chats data:', data);
        
        // Если это мок-данные или ошибка API, возвращаем мок-данные
        if (!data || Object.keys(data).length === 0) {
          console.warn('Using mock chat data');
          return { chats: TEST_CHATS };
        }
        
        // Если data.chats есть и это массив, значит формат правильный
        if (data.chats && Array.isArray(data.chats)) {
          return data as ChatsResponse;
        }
        
        // Если данные пришли массивом от rpc функции
        if (Array.isArray(data)) {
          return { chats: mapSupabaseChatsToAppFormat(data as SupabaseChat[]) };
        }
        
        // В крайнем случае возвращаем мок-данные
        console.warn('Returning mock data due to incorrect data format:', data);
        return { chats: TEST_CHATS };
      }
    },
    errorMessage: "Ошибка загрузки чатов"
  });
};
