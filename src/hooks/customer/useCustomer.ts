import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Интерфейс для данных о клиенте
export interface Customer {
  id: string;
  phone: string;
  first_name?: string;
  last_name?: string;
  opt_in?: boolean;
  metadata?: any;
  last_interaction?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Получить данные клиента, связанного с определенным чатом
 */
export const useCustomerByChatId = (chatId: string | null) => {
  return useQuery({
    queryKey: ['customer', chatId],
    queryFn: async () => {
      // Если chatId не предоставлен
      if (!chatId) {
        console.log('[DEBUG] useCustomerByChatId: Не указан ID чата');
        return null;
      }
      
      try {
        console.log('[DEBUG] useCustomerByChatId: Запрос данных клиента для чата', chatId);
        
        // Запрос данных через связь chat_customers
        const { data, error } = await supabase
          .from('chat_customers')
          .select(`
            customer_id,
            customers:customer_id (
              id, phone, first_name, last_name, opt_in
            )
          `)
          .eq('chat_id', chatId)
          .single();
        
        if (error) {
          console.error('[DEBUG] useCustomerByChatId: Ошибка запроса:', error);
          return null;
        }
        
        if (!data || !data.customers) {
          console.log('[DEBUG] useCustomerByChatId: Клиент не найден');
          return null;
        }
        
        console.log('[DEBUG] useCustomerByChatId: Получены данные клиента:', data.customers);
        
        return data.customers as Customer;
      } catch (error) {
        console.error('[DEBUG] useCustomerByChatId: Критическая ошибка:', error);
        return null;
      }
    },
    enabled: !!chatId,
    staleTime: 60000, // Кэшируем на 1 минуту
  });
};
