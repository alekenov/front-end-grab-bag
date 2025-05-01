
import { useQuery } from "@tanstack/react-query";
import { Chat } from "@/types/chat";
import { supabase } from "@/integrations/supabase/client";
import { CHAT_API_URL, getAuthSession } from "./chatApiUtils";
import { useToast } from "@/hooks/use-toast";
import { getApiUrl, fetchWithFallback } from "@/utils/apiHelpers";

// Демо-чаты для отображения, когда API недоступен
const DEMO_CHATS: Chat[] = [
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
];

// Тип данных, возвращаемый SQL-функцией
interface ChatWithLastMessage {
  id: string;
  name: string;
  ai_enabled: boolean;
  unread_count: number;
  created_at: string;
  updated_at: string;
  last_message_content: string | null;
  last_message_timestamp: string | null;
}

export const useChats = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['chats-api'],
    queryFn: async (): Promise<Chat[]> => {
      try {
        console.log('Получение чатов оптимизированным способом...');
        
        // Сначала пробуем получить чаты вместе с последними сообщениями через SQL-функцию
        const { data, error } = await supabase.rpc<ChatWithLastMessage>('get_chats_with_last_messages');
        
        if (!error && data && data.length > 0) {
          console.log('Получено чатов из SQL-функции:', data.length);
          
          // Преобразуем данные в формат, ожидаемый фронтендом
          return data.map(chat => ({
            id: chat.id,
            name: chat.name,
            aiEnabled: chat.ai_enabled,
            unreadCount: chat.unread_count || 0,
            lastMessage: chat.last_message_content ? {
              content: chat.last_message_content,
              timestamp: chat.last_message_timestamp || new Date().toISOString()
            } : undefined,
            created_at: chat.created_at,
            updated_at: chat.updated_at
          }));
        }
        
        // Если SQL-функция недоступна, используем API
        console.log('SQL-функция недоступна, пробуем API...');
        
        // Получаем сессию авторизации
        const { accessToken } = await getAuthSession();
        
        // Используем fetchWithFallback для надежности
        const apiUrl = `${getApiUrl()}/chats`;
        console.log(`Запрос к API: ${apiUrl}`);
        
        const apiData = await fetchWithFallback(
          apiUrl,
          { chats: DEMO_CHATS },
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (apiData.chats) {
          console.log(`Получено ${apiData.chats.length} чатов от API`);
          return apiData.chats;
        }
        
        // Если всё равно не удалось, показываем демо-чаты
        console.log('Используем демо-чаты, так как API недоступен');
        return DEMO_CHATS;
        
      } catch (error) {
        console.error('Ошибка при загрузке чатов:', error);
        
        // Уведомление пользователя об ошибке
        toast({
          title: "Ошибка загрузки чатов",
          description: "Отображаются демонстрационные данные",
          variant: "destructive",
        });
        
        // Возвращаем демо-чаты в случае ошибки
        return DEMO_CHATS;
      }
    },
    retry: 1, // Одна повторная попытка в случае сетевых проблем
    refetchOnWindowFocus: false // Предотвращаем частые запросы
  });
};
