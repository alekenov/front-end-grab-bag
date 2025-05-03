
import { useApiQuery } from "@/hooks/api/useApiQuery";
import { Chat, SupabaseChat } from "@/types/chat";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

// Интерфейс для структуры ответа API чатов
interface ChatsResponse {
  chats: Chat[];
}

// Преобразование данных из Supabase в формат приложения
const mapSupabaseChatsToAppFormat = (chats: SupabaseChat[]): Chat[] => {
  return chats.map(chat => ({
    id: chat.id,
    name: chat.name,
    aiEnabled: chat.ai_enabled,
    unreadCount: chat.unread_count || 0,
    lastMessage: chat.last_message_content || chat.last_message_time 
      ? {
          content: chat.last_message_content || "",
          timestamp: chat.last_message_time || new Date().toISOString(),
          hasProduct: chat.last_message_has_product || false,
          price: chat.last_message_product_price || 0
        }
      : undefined,
    created_at: chat.created_at || undefined,
    updated_at: chat.updated_at || undefined
  }));
};

// Демо-чаты для отображения, когда API недоступен
const DEMO_CHATS: ChatsResponse = {
  chats: [
    {
      id: "demo-1",
      name: "Анна Смирнова",
      aiEnabled: true,
      unreadCount: 2,
      lastMessage: {
        content: "Добрый день! Интересует букет на день рождения",
        timestamp: new Date().toISOString()
      }
    },
    {
      id: "demo-2",
      name: "Иван Петров",
      aiEnabled: false,
      unreadCount: 0,
      lastMessage: {
        content: "Букет за 10000 ₸",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        hasProduct: true,
        price: 10000
      }
    },
    {
      id: "demo-3",
      name: "Мария Иванова",
      aiEnabled: true,
      unreadCount: 5,
      lastMessage: {
        content: "Когда можно ожидать доставку?",
        timestamp: new Date(Date.now() - 30 * 60000).toISOString()
      }
    }
  ]
};

/**
 * Хук для получения списка чатов с использованием общего API-клиента
 */
export const useChats = () => {
  const queryClient = useQueryClient();

  // Настраиваем периодическое обновление данных
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log("Periodic chats refetch triggered");
      queryClient.invalidateQueries({ queryKey: ['chats-api'] });
      queryClient.refetchQueries({ queryKey: ['chats-api'] });
    }, 5000); // Обновляем каждые 5 секунд

    return () => clearInterval(intervalId);
  }, [queryClient]);

  return useApiQuery<ChatsResponse>({
    endpoint: 'chat-api/chats',
    queryKey: ['chats-api'],
    options: {
      requiresAuth: true,
      fallbackData: DEMO_CHATS
    },
    queryOptions: {
      refetchOnWindowFocus: true, // Будем обновлять данные при фокусе окна
      refetchInterval: 5000,      // Более частое обновление каждые 5 секунд
      staleTime: 1000,            // Считаем данные устаревшими уже через 1 секунду
      select: (data: any) => {
        console.log('Processing chats data:', data);
        
        // Если данные пришли от API в формате Supabase
        if (Array.isArray(data) && data.length > 0 && ('ai_enabled' in data[0])) {
          return { chats: mapSupabaseChatsToAppFormat(data as SupabaseChat[]) };
        }
        // Если данные пришли в формате нашего приложения или в виде fallbackData
        return data;
      }
    },
    errorMessage: "Ошибка загрузки чатов"
  });
};
