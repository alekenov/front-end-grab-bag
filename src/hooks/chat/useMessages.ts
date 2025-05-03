
import { useApiQuery } from "@/hooks/api/useApiQuery";
import { Message } from "@/types/chat";

const DEMO_MESSAGES: Message[] = [
  {
    id: "demo-msg-1",
    content: "Здравствуйте! Чем я могу помочь вам сегодня?",
    role: "BOT",
    timestamp: new Date(Date.now() - 4 * 60000).toISOString()
  },
  {
    id: "demo-msg-2",
    content: "Я хотел бы узнать о доставке цветов",
    role: "USER",
    timestamp: new Date(Date.now() - 3 * 60000).toISOString()
  },
  {
    id: "demo-msg-3",
    content: "Мы осуществляем доставку ежедневно с 9:00 до 21:00. Стандартная доставка занимает 2-3 часа с момента подтверждения заказа. Также доступна экспресс-доставка в течение 1 часа за дополнительную плату.",
    role: "BOT",
    timestamp: new Date(Date.now() - 2 * 60000).toISOString()
  }
];

/**
 * Хук для получения сообщений чата с использованием общего API-клиента
 */
export const useMessages = (chatId: string | null) => {
  return useApiQuery<Message[]>({
    endpoint: chatId ? `chat-api/messages?chatId=${chatId}` : '',
    queryKey: ['messages-api', chatId],
    enabled: !!chatId,
    options: {
      requiresAuth: true,
      fallbackData: chatId?.startsWith('demo-') ? DEMO_MESSAGES : []
    },
    queryOptions: {
      retry: 1,
      refetchOnWindowFocus: false,
      select: (data) => {
        // Гарантируем, что data всегда будет массивом
        if (!data) return [];
        if (!Array.isArray(data)) {
          console.warn('useMessages: Received non-array data:', data);
          return [];
        }
        return data;
      }
    },
    errorMessage: "Ошибка загрузки сообщений"
  });
};
