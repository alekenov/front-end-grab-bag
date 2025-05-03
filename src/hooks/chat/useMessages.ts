
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
  const result = useApiQuery<{ messages: Message[] }>({
    endpoint: chatId ? `chat-api/messages?chatId=${chatId}` : '',
    queryKey: ['messages-api', chatId],
    enabled: !!chatId,
    options: {
      requiresAuth: true,
      fallbackData: chatId?.startsWith('demo-') 
        ? { messages: DEMO_MESSAGES } 
        : { messages: [] }
    },
    queryOptions: {
      retry: 1,
      refetchOnWindowFocus: true, // Обновлять при возврате на страницу
      refetchInterval: 5000, // Периодическое обновление каждые 5 секунд
      select: (data) => {
        // Проверяем, что data существует 
        if (!data) {
          console.warn('useMessages: No data received from API');
          return chatId?.startsWith('demo-') 
            ? { messages: DEMO_MESSAGES } 
            : { messages: [] };
        }
        
        // Если в data есть messages и это массив, используем его
        if (data && typeof data === 'object' && 'messages' in data && Array.isArray(data.messages)) {
          // Проверяем, что все сообщения имеют необходимые поля
          return {
            messages: data.messages.map(msg => ({
              id: msg.id || `msg-${Date.now()}-${Math.random()}`,
              content: msg.content || "",
              role: msg.role || "BOT",
              timestamp: msg.timestamp || new Date().toISOString(),
              product: msg.product
            }))
          };
        }
        
        // Если data - массив (старый формат API), преобразуем его
        if (Array.isArray(data)) {
          return {
            messages: data.map(msg => ({
              id: msg.id || `msg-${Date.now()}-${Math.random()}`,
              content: msg.content || "",
              role: msg.role || "BOT",
              timestamp: msg.timestamp || new Date().toISOString(),
              product: msg.product
            }))
          };
        }
        
        // Резервный вариант
        return chatId?.startsWith('demo-') 
          ? { messages: DEMO_MESSAGES } 
          : { messages: [] };
      }
    },
    errorMessage: "Ошибка загрузки сообщений"
  });
  
  // Убедимся, что возвращаем массив даже если data.messages равна null или undefined
  const safeData = result.data?.messages 
    ? result.data.messages 
    : (chatId?.startsWith('demo-') ? DEMO_MESSAGES : []);
  
  return {
    ...result,
    data: safeData
  };
};
