import { Message, SupabaseMessage } from "@/types/chat";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

// Демо-сообщения для случая, если не удалось получить реальные данные
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
 * Хук для получения сообщений чата через Supabase
 */
export const useMessages = (chatId: string | null) => {
  const result = useQuery({
    queryKey: ['messages', chatId],
    queryFn: async () => {
      // Если chatId не предоставлен
      if (!chatId) {
        console.log('[DEBUG] useMessages: Не указан ID чата');
        return [];
      }
      
      try {
        console.log('[DEBUG] useMessages: Запрос сообщений для чата', chatId);
        
        // Запрос данных из Supabase
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('chat_id', chatId)
          .order('created_at', { ascending: true });
        
        // Логирование ошибок
        if (error) {
          console.error('[DEBUG] useMessages: Ошибка запроса:', error);
          throw error;
        }
        
        // Если данные отсутствуют
        if (!data || data.length === 0) {
          console.log('[DEBUG] useMessages: Сообщения не найдены');
          return [];
        }
        
        console.log('[DEBUG] useMessages: Получено сообщений:', data.length);
        console.log('[DEBUG] useMessages: Первое сообщение:', data[0]);
        
        // Преобразуем данные в формат приложения
        return data.map((msg: any) => ({
          id: msg.id || `msg-${Date.now()}-${Math.random()}`,
          content: msg.content || '',
          timestamp: msg.created_at || new Date().toISOString(),
          role: msg.is_from_user ? 'USER' as const : 'BOT' as const,
          // Если есть данные о продукте
          ...(msg.has_product && msg.product_data ? {
            product: typeof msg.product_data === 'string' 
              ? JSON.parse(msg.product_data) 
              : msg.product_data
          } : {})
        }));
      } catch (error) {
        console.error('[DEBUG] useMessages: Критическая ошибка:', error);
        
        // При ошибке возвращаем демо-данные
        if (chatId.startsWith('demo-')) {
          return DEMO_MESSAGES;
        }
        
        return [];
      }
    },
    enabled: !!chatId,
    refetchOnWindowFocus: true,
    refetchInterval: 5000,
    retry: 1
  });
  
  return result;
};
