
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
    name: chat.name || chat.phone_number || "Новый контакт",
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
      },
      source: "web"
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
      },
      source: "whatsapp"
    },
    {
      id: "demo-3",
      name: "Мария Иванова",
      aiEnabled: true,
      unreadCount: 5,
      lastMessage: {
        content: "Когда можно ожидать доставку?",
        timestamp: new Date(Date.now() - 30 * 60000).toISOString()
      },
      source: "telegram"
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
    }, 10000); // Увеличил интервал обновления до 10 секунд

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
      refetchInterval: 10000,      // Обновление каждые 10 секунд
      staleTime: 5000,            // Считаем данные устаревшими через 5 секунд
      select: (data: any) => {
        console.log('Processing chats data:', data);
        
        // Если данных нет или некорректный формат, используем демо-данные
        if (!data) {
          console.warn('No chats data received, using demo chats');
          return DEMO_CHATS;
        }
        
        // Если данные пришли от API в формате Supabase
        if (Array.isArray(data) && data.length > 0 && ('ai_enabled' in data[0])) {
          return { chats: mapSupabaseChatsToAppFormat(data as SupabaseChat[]) };
        }
        // Если данные пришли в формате хотя бы с полем chats и это массив
        if (data.chats && Array.isArray(data.chats)) {
          return data as ChatsResponse;
        }
        
        // Если данные пришли в другом формате, преобразуем в нужный
        if (Array.isArray(data)) {
          return { chats: data as Chat[] };
        }
        
        // В крайнем случае возвращаем демо-данные
        console.warn('Using demo chats due to incorrect data format:', data);
        return DEMO_CHATS;
      }
    },
    errorMessage: "Ошибка загрузки чатов"
  });
};
