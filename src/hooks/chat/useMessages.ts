
import { useApiQuery } from "@/hooks/api/useApiQuery";
import { Message } from "@/types/chat";
import { TEST_MESSAGES, DEMO_MESSAGES } from "@/data/mockData"; // Импортируем мок-данные

// Пример имен операторов для тестовых данных
const OPERATOR_NAMES = ["Анна", "Михаил", "Елена", "Сергей", "Ольга"];

// Кеш для хранения назначенных имен операторов по ID сообщения
// Это поможет сохранять имена между ре-рендерами
const operatorNameCache: Record<string, string> = {};

/**
 * Хук для получения сообщений чата с использованием общего API-клиента
 * В режиме разработки возвращает мок-данные
 */
export const useMessages = (chatId: string | null) => {
  // Если это demo-чат, используем DEMO_MESSAGES
  const isDemoChat = chatId?.startsWith('demo-');
  const mockMessages = chatId ? TEST_MESSAGES[chatId] || [] : [];

  // Функция для добавления детерминированного имени оператора на основе идентификатора сообщения
  const addOperatorNames = (messages: Message[]): Message[] => {
    return messages.map(msg => {
      if (msg.role === "BOT" && msg.sender === "OPERATOR") {
        if (msg.operatorName) {
          // Если имя уже задано в данных, оставляем его
          return msg;
        }
        
        // Проверяем, есть ли уже имя в кеше
        if (operatorNameCache[msg.id]) {
          return { ...msg, operatorName: operatorNameCache[msg.id] };
        }
        
        // Генерируем детерминированное имя на основе ID сообщения
        // Используем сумму кодов символов в ID как индекс в массиве имен
        const charSum = msg.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
        const nameIndex = charSum % OPERATOR_NAMES.length;
        const operatorName = OPERATOR_NAMES[nameIndex];
        
        // Сохраняем в кеше для последующих вызовов
        operatorNameCache[msg.id] = operatorName;
        
        return { ...msg, operatorName };
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
      refetchOnWindowFocus: false, // Отключаем автоматическое обновление при фокусе, чтобы имена не менялись
      refetchInterval: 10000, // Увеличиваем интервал обновления до 10 секунд
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
            messages: addOperatorNames(ensureCorrectMessageTypes(data.messages))
          };
        }
        
        // Если data - массив (старый формат API), преобразуем его
        if (Array.isArray(data)) {
          return {
            messages: addOperatorNames(ensureCorrectMessageTypes(data))
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
      },
      staleTime: 10000, // Данные считаются свежими в течение 10 секунд
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
