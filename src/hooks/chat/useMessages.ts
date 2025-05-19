
import { useApiQuery } from "@/hooks/api/useApiQuery";
import { Message } from "@/types/chat";
import { TEST_MESSAGES, DEMO_MESSAGES } from "@/data/mockData"; 

// Набор операторов для детерминированного назначения
const OPERATOR_NAMES = ["Анна", "Михаил", "Елена", "Сергей", "Ольга"];

// Кеш имен операторов для поддержания согласованности между рендерами
const operatorNameCache = new Map<string, string>();

/**
 * Функция для нормализации ID чата
 * Преобразует числовые ID в формат demo-{id}
 */
const normalizeChatId = (chatId: string | null): string | null => {
  if (!chatId) return null;
  
  // Если это числовой ID, преобразуем его в демо-формат
  if (!isNaN(Number(chatId)) && !chatId.includes('-')) {
    console.log(`[useMessages] Преобразование числового ID ${chatId} в demo-${chatId}`);
    return `demo-${chatId}`;
  }
  
  return chatId;
};

/**
 * Хук для получения сообщений чата
 */
export const useMessages = (chatId: string | null) => {
  // Нормализуем ID чата для единообразия
  const normalizedChatId = normalizeChatId(chatId);
  
  // Проверяем, является ли чат демо-чатом
  const isDemoChat = normalizedChatId?.startsWith('demo-');
  
  // В режиме разработки или при отсутствии API используем мок-данные
  const mockMessages = normalizedChatId && !isDemoChat ? TEST_MESSAGES[normalizedChatId] || [] : [];

  // Добавляем имена операторов детерминированным способом
  const addOperatorNames = (messages: Message[]): Message[] => {
    return messages.map(msg => {
      // Добавляем имя оператора только для сообщений от оператора
      if (msg.role === "BOT" && msg.sender === "OPERATOR") {
        // Если имя уже задано в данных, используем его
        if (msg.operatorName) {
          return msg;
        }
        
        // Проверяем кеш имен
        if (operatorNameCache.has(msg.id)) {
          return { ...msg, operatorName: operatorNameCache.get(msg.id) };
        }
        
        // Получаем детерминированное имя на основе ID сообщения
        const charSum = msg.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
        const nameIndex = charSum % OPERATOR_NAMES.length;
        const operatorName = OPERATOR_NAMES[nameIndex];
        
        // Сохраняем имя в кеше
        operatorNameCache.set(msg.id, operatorName);
        
        return { ...msg, operatorName };
      }
      return msg;
    });
  };

  // Обеспечиваем согласованные типы данных сообщений
  const normalizeMessages = (messages: any[]): Message[] => {
    return messages.map(msg => ({
      id: msg.id || `msg-${Date.now()}-${Math.random()}`,
      content: msg.content || "",
      role: msg.role === "USER" || msg.role === "BOT" ? msg.role : 
            (msg.is_from_user ? "USER" : "BOT"),
      sender: msg.role === "USER" ? undefined : 
              (msg.sender || (Math.random() > 0.5 ? "AI" : "OPERATOR")),
      operatorName: msg.operatorName,
      timestamp: msg.timestamp || msg.created_at || new Date().toISOString(),
      product: msg.product || (msg.has_product && msg.product_data ? {
        id: msg.product_data.id || "",
        imageUrl: msg.product_data.imageUrl || "",
        price: msg.product_data.price || 0
      } : undefined)
    }));
  };

  // Получаем данные через API или используем мок-данные
  const result = useApiQuery<{ messages: Message[] }>({
    endpoint: normalizedChatId ? `chat-api/messages?chatId=${normalizedChatId}` : '',
    queryKey: ['messages-api', normalizedChatId],
    enabled: !!normalizedChatId,
    options: {
      requiresAuth: false, // Меняем на false для тестирования
      fallbackData: { 
        messages: isDemoChat 
          ? addOperatorNames(normalizeMessages(DEMO_MESSAGES))
          : []
      }
    },
    queryOptions: {
      retry: 2,
      refetchOnWindowFocus: true,
      refetchInterval: 5000,
      select: (data) => {
        console.log('[useMessages] Raw data received:', data);
        
        if (!data) {
          console.warn('[useMessages] No data received, using fallback');
          return { 
            messages: isDemoChat 
              ? addOperatorNames(normalizeMessages(DEMO_MESSAGES))
              : []
          };
        }
        
        // Нормализуем данные в зависимости от формата ответа API
        if (data && typeof data === 'object') {
          if ('messages' in data && Array.isArray(data.messages)) {
            console.log('[useMessages] Using messages array from data object');
            return {
              messages: addOperatorNames(normalizeMessages(data.messages))
            };
          } else if (Array.isArray(data)) {
            console.log('[useMessages] Data is direct array, converting');
            return {
              messages: addOperatorNames(normalizeMessages(data))
            };
          }
        }
        
        console.warn('[useMessages] Invalid data format, using fallback');
        return { 
          messages: isDemoChat 
            ? addOperatorNames(normalizeMessages(DEMO_MESSAGES))
            : []
        };
      },
      staleTime: 5000,
    },
    errorMessage: "Ошибка загрузки сообщений"
  });
  
  // Обеспечиваем возврат массива даже при ошибке
  const safeMessages = Array.isArray(result.data?.messages) 
    ? result.data.messages 
    : (isDemoChat 
        ? addOperatorNames(normalizeMessages(DEMO_MESSAGES))
        : []);
  
  console.log(`[useMessages] Returning ${safeMessages.length} messages for chat ${normalizedChatId}`);
  
  return {
    ...result,
    data: safeMessages,
    isDemoChat
  };
};
