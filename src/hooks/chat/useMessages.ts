
import { useApiQuery } from "@/hooks/api/useApiQuery";
import { Message } from "@/types/chat";
import { TEST_MESSAGES, DEMO_MESSAGES } from "@/data/mockData"; // Импортируем мок-данные

/**
 * Хук для получения сообщений чата с использованием общего API-клиента
 * В режиме разработки возвращает мок-данные
 */
export const useMessages = (chatId: string | null) => {
  // Если это demo-чат, используем DEMO_MESSAGES
  const isDemoChat = chatId?.startsWith('demo-');
  const mockMessages = chatId ? TEST_MESSAGES[chatId] || [] : [];

  const result = useApiQuery<{ messages: Message[] }>({
    endpoint: chatId ? `chat-api/messages?chatId=${chatId}` : '',
    queryKey: ['messages-api', chatId],
    enabled: !!chatId,
    options: {
      requiresAuth: true,
      // Используем разные мок-данные в зависимости от типа чата
      fallbackData: { 
        messages: isDemoChat 
          ? DEMO_MESSAGES
          : mockMessages
      }
    },
    queryOptions: {
      retry: 1,
      refetchOnWindowFocus: true, // Обновлять при возврате на страницу
      refetchInterval: 5000, // Периодическое обновление каждые 5 секунд
      select: (data) => {
        // Проверяем, что data существует 
        if (!data) {
          console.warn('useMessages: No data received from API, using mock data');
          
          // Определяем, какие мок-данные использовать
          if (isDemoChat) {
            return { messages: DEMO_MESSAGES };
          } else if (chatId && TEST_MESSAGES[chatId]) {
            return { messages: TEST_MESSAGES[chatId] };
          } else {
            return { messages: [] };
          }
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
        
        // Резервный вариант - используем мок-данные
        console.warn('useMessages: Invalid data format from API, using mock data');
        if (isDemoChat) {
          return { messages: DEMO_MESSAGES };
        } else if (chatId && TEST_MESSAGES[chatId]) {
          return { messages: TEST_MESSAGES[chatId] };
        } else {
          return { messages: [] };
        }
      }
    },
    errorMessage: "Ошибка загрузки сообщений"
  });
  
  // Убедимся, что возвращаем массив даже если data.messages равна null или undefined
  const safeData = result.data?.messages 
    ? result.data.messages 
    : (isDemoChat 
        ? DEMO_MESSAGES 
        : (chatId && TEST_MESSAGES[chatId] ? TEST_MESSAGES[chatId] : []));
  
  return {
    ...result,
    data: safeData
  };
};
