
import { useQuery } from "@tanstack/react-query";
import { Message } from "@/types/chat";
import { supabase } from "@/integrations/supabase/client";
import { CHAT_API_URL, formatSupabaseMessage, getAuthSession } from "./chatApiUtils";
import { useToast } from "@/hooks/use-toast";
import { getApiUrl, fetchWithFallback } from "@/utils/apiHelpers";

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

export const useMessages = (chatId: string | null) => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['messages-api', chatId],
    queryFn: async (): Promise<Message[]> => {
      if (!chatId) return [];
      
      // Для демо-чатов возвращаем демонстрационные сообщения
      if (chatId.startsWith('demo-')) {
        console.log('Возвращаем демо-сообщения для демо-чата');
        return DEMO_MESSAGES;
      }
      
      try {
        console.log('Загрузка сообщений для чата:', chatId);
        
        // Пытаемся получить сообщения напрямую из Supabase
        const { data: supabaseMessages, error: supabaseError } = await supabase
          .from('messages')
          .select('*')
          .eq('chat_id', chatId)
          .order('created_at', { ascending: true });
          
        if (!supabaseError && supabaseMessages && supabaseMessages.length > 0) {
          console.log('Получено сообщений из Supabase:', supabaseMessages.length);
          return supabaseMessages.map(formatSupabaseMessage);
        }
        
        // Запасной вариант: используем Edge Function API
        console.log('Пробуем получить сообщения через API');
        
        // Получаем токен авторизации
        const { accessToken } = await getAuthSession();
        
        // Используем fetchWithFallback для надежности
        const apiUrl = `${getApiUrl()}/messages?chatId=${chatId}`;
        console.log(`Запрос к API: ${apiUrl}`);
        
        const data = await fetchWithFallback<{ messages?: Message[] }>(
          apiUrl,
          { messages: [] },
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (data.messages && data.messages.length > 0) {
          console.log(`Получено ${data.messages.length} сообщений от API`);
          return data.messages;
        }
        
        // Если не удалось получить сообщения, возвращаем пустой массив
        return [];
        
      } catch (error) {
        console.error('Ошибка загрузки сообщений:', error);
        
        // Отображаем сообщение об ошибке
        toast({
          title: "Ошибка загрузки сообщений",
          description: "Не удалось загрузить историю сообщений",
          variant: "destructive",
        });
        
        return [];
      }
    },
    enabled: !!chatId,
    retry: 1, // Одна повторная попытка в случае сетевых проблем
    refetchOnWindowFocus: false // Предотвращаем частые запросы
  });
};
