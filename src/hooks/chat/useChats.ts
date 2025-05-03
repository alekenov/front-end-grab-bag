
import { useApiQuery } from "@/hooks/api/useApiQuery";
import { Chat } from "@/types/chat";

// Интерфейс для структуры ответа API чатов
interface ChatsResponse {
  chats: Chat[];
}

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
        content: "Спасибо за доставку! Всё очень понравилось",
        timestamp: new Date(Date.now() - 86400000).toISOString()
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
  return useApiQuery<ChatsResponse>({
    endpoint: 'chat-api/chats',
    queryKey: ['chats-api'],
    options: {
      requiresAuth: true,
      fallbackData: DEMO_CHATS
    },
    queryOptions: {
      refetchOnWindowFocus: false
    },
    errorMessage: "Ошибка загрузки чатов"
  });
};
