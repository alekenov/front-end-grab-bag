
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

export const useChats = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['chats-api'],
    queryFn: async (): Promise<Chat[]> => {
      try {
        // Сначала пробуем получить чаты напрямую из Supabase
        let response = await supabase
          .from('chats')
          .select('*')
          .order('updated_at', { ascending: false });
          
        if (!response.error && response.data && response.data.length > 0) {
          console.log('Получено чатов из Supabase:', response.data.length);
          
          // Получаем последнее сообщение для каждого чата
          const chatsWithMessages = await Promise.all(
            response.data.map(async (chat) => {
              const { data: messages } = await supabase
                .from('messages')
                .select('content, created_at')
                .eq('chat_id', chat.id)
                .order('created_at', { ascending: false })
                .limit(1);
                
              return {
                id: chat.id,
                name: chat.name,
                aiEnabled: chat.ai_enabled,
                unreadCount: chat.unread_count || 0,
                lastMessage: messages && messages.length > 0 ? {
                  content: messages[0].content || "",
                  timestamp: messages[0].created_at || ""
                } : undefined,
                created_at: chat.created_at,
                updated_at: chat.updated_at
              };
            })
          );
          
          return chatsWithMessages;
        }
        
        // Если не удалось получить через Supabase, пробуем API
        console.log('Пробуем получить чаты через API...');
        
        // Получаем сессию авторизации
        const { accessToken } = await getAuthSession();
        
        // Используем fetchWithFallback для надежности
        const apiUrl = `${getApiUrl()}/chats`;
        console.log(`Запрос к API: ${apiUrl}`);
        
        const data = await fetchWithFallback(
          apiUrl,
          { chats: DEMO_CHATS },
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (data.chats) {
          console.log(`Получено ${data.chats.length} чатов от API`);
          return data.chats;
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
