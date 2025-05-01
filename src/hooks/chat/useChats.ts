import { useQuery } from "@tanstack/react-query";
import { Chat } from "@/types/chat";
import { useToast } from "@/hooks/use-toast";
import { CHAT_API_URL, getAuthSession } from "./chatApiUtils";
import { fetchWithFallback } from "@/utils/apiHelpers";

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
        console.log('Получение чатов через API...');
        
        // Получаем сессию авторизации
        const { accessToken } = await getAuthSession();
        
        // Используем API для получения чатов
        const apiUrl = `${CHAT_API_URL}/chats`;
        console.log(`Запрос к API: ${apiUrl}`);
        
        const apiData = await fetchWithFallback<{ chats?: Chat[] }>(
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
