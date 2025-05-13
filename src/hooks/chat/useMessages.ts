
import { useApiQuery } from "@/hooks/api/useApiQuery";
import { Message } from "@/types/chat";
import { TEST_MESSAGES, DEMO_MESSAGES } from "@/data/mockData"; // Импортируем мок-данные

// Пример имен операторов для тестовых данных
const OPERATOR_NAMES = ["Анна", "Михаил", "Елена", "Сергей", "Ольга"];

/**
 * Хук для получения сообщений чата с использованием общего API-клиента
 * В режиме разработки возвращает мок-данные
 */
export const useMessages = (chatId: string | null) => {
  // Если это demo-чат, используем DEMO_MESSAGES
  const isDemoChat = chatId?.startsWith('demo-');
  const mockMessages = chatId ? TEST_MESSAGES[chatId] || [] : [];

  // Функция для добавления случайного имени оператора к сообщениям BOT от оператора
  const addOperatorNames = (messages: Message[]): Message[] => {
    return messages.map(msg => {
      if (msg.role === "BOT" && msg.sender === "OPERATOR") {
        // Добавляем случайное имя оператора для тестовых данных
        const randomName = OPERATOR_NAMES[Math.floor(Math.random() * OPERATOR_NAMES.length)];
        return { ...msg, operatorName: msg.operatorName || randomName };
      }
      return msg;
    });
  };

  // Функция для обеспечения правильных типов сообщений
  const ensureCorrectMessageTypes = (messages: any[]): Message[] => {
    return messages.map(msg => ({
      id: msg.id || `msg-${Date.now()}-${Math.random()}`,
      content: msg.content || "",
      // Убедимся, что role всегда "USER" или "BOT"
      role: msg.role === "USER" || msg.role === "BOT" ? msg.role : (msg.role?.toString().toUpperCase() === "USER" ? "USER" : "BOT"),
      sender: msg.role === "USER" ? undefined : (msg.sender || (Math.random() > 0.5 ? "AI" : "OPERATOR")),
      operatorName: msg.operatorName,
      timestamp: msg.timestamp || new Date().toISOString(),
      product: msg.product
    }));
  };

  const result = useApiQuery<{ messages: Message[] }>({
    endpoint: chatId ? `chat-api/messages?chatId=${chatId}` : '',
    queryKey: ['messages-api', chatId],
    enabled: !!chatId,
    options: {
      requiresAuth: true,
      // Используем разные мок-данные в зависимости от типа чата
      fallbackData: { 
        messages: isDemoChat 
          ? addOperatorNames(ensureCorrectMessageTypes(DEMO_MESSAGES))
          : addOperatorNames(ensureCorrectMessageTypes(mockMessages))
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
            return { 
              messages: addOperatorNames(ensureCorrectMessageTypes(DEMO_MESSAGES))
            };
          } else if (chatId && TEST_MESSAGES[chatId]) {
            return { 
              messages: addOperatorNames(ensureCorrectMessageTypes(TEST_MESSAGES[chatId]))
            };
          } else {
            return { messages: [] };
          }
        }
        
        // Если в data есть messages и это массив, используем его
        if (data && typeof data === 'object' && 'messages' in data && Array.isArray(data.messages)) {
          // Проверяем, что все сообщения имеют необходимые поля и правильные типы
          return {
            messages: ensureCorrectMessageTypes(data.messages)
          };
        }
        
        // Если data - массив (старый формат API), преобразуем его
        if (Array.isArray(data)) {
          return {
            messages: ensureCorrectMessageTypes(data)
          };
        }
        
        // Резервный вариант - используем мок-данные
        console.warn('useMessages: Invalid data format from API, using mock data');
        if (isDemoChat) {
          return { 
            messages: addOperatorNames(ensureCorrectMessageTypes(DEMO_MESSAGES))
          };
        } else if (chatId && TEST_MESSAGES[chatId]) {
          return { 
            messages: addOperatorNames(ensureCorrectMessageTypes(TEST_MESSAGES[chatId]))
          };
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
        ? addOperatorNames(ensureCorrectMessageTypes(DEMO_MESSAGES))
        : (chatId && TEST_MESSAGES[chatId] ? addOperatorNames(ensureCorrectMessageTypes(TEST_MESSAGES[chatId])) : []));
  
  return {
    ...result,
    data: safeData
  };
};
