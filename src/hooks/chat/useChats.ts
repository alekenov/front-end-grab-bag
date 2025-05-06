import { Chat, SupabaseChat } from "@/types/chat";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

// Интерфейс для структуры ответа API чатов
interface ChatsResponse {
  chats: Chat[];
}

// Преобразование данных из Supabase в формат приложения
const mapSupabaseChatsToAppFormat = (chats: SupabaseChat[]): Chat[] => {
  return chats.map(chat => ({
    id: chat.id,
    name: chat.name || chat.phone_number || "Новый контакт",
    aiEnabled: chat.ai_enabled || false,
    unreadCount: chat.unread_count || 0,
    lastMessage: chat.last_message_content || chat.last_message_timestamp 
      ? {
          content: chat.last_message_content || "",
          timestamp: chat.last_message_timestamp || new Date().toISOString(),
          hasProduct: chat.last_message_has_product || false,
          price: chat.last_message_product_price || 0
        }
      : undefined,
    created_at: chat.created_at || undefined,
    updated_at: chat.updated_at || undefined,
    source: chat.source || "web", // Добавляем источник чата
    phone_number: chat.phone_number // Добавляем номер телефона контакта
  }));
};

// Демо-чаты для отображения, когда API недоступен
const DEMO_CHATS: ChatsResponse = {
  chats: [
    {
      id: "demo-1",
      name: "Анна Смирнова",
      aiEnabled: true,
      unreadCount: 2,
      lastMessage: {
        content: "Добрый день! Интересует букет на день рождения",
        timestamp: new Date().toISOString()
      },
      source: "web",
      phone_number: "+7 (701) 555-1234"
    },
    {
      id: "demo-2",
      name: "Иван Петров",
      aiEnabled: false,
      unreadCount: 0,
      lastMessage: {
        content: "Букет за 10000 ₸",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        hasProduct: true,
        price: 10000
      },
      source: "whatsapp",
      phone_number: "+7 (702) 666-7890"
    },
    {
      id: "demo-3",
      name: "Мария Иванова",
      aiEnabled: true,
      unreadCount: 5,
      lastMessage: {
        content: "Когда можно ожидать доставку?",
        timestamp: new Date(Date.now() - 30 * 60000).toISOString()
      },
      source: "telegram",
      phone_number: "+7 (777) 123-4567"
    }
  ]
};

/**
 * Хук для получения списка чатов с использованием общего API-клиента
 */
export const useChats = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Настраиваем периодическое обновление данных
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log("Periodic chats refetch triggered");
      queryClient.invalidateQueries({ queryKey: ['chats-api'] });
      queryClient.refetchQueries({ queryKey: ['chats-api'] });
    }, 10000); // Увеличил интервал обновления до 10 секунд

    return () => clearInterval(intervalId);
  }, [queryClient]);

  // Используем прямой Supabase клиент вместо обычного API
  return useQuery<ChatsResponse, Error>({
    queryKey: ['chats-api'],
    queryFn: async () => {
      try {
        // Запрос к Supabase напрямую
        console.log('[DEBUG] Запрос чатов напрямую через Supabase клиент');
        const { data, error } = await supabase
          .from('chats')
          .select('*')
          .order('updated_at', { ascending: false });

        if (error) {
          console.error('[DEBUG] Ошибка Supabase запроса:', error);
          throw error;
        }

        console.log('[DEBUG] Получено чатов из Supabase:', data?.length || 0);
        return { chats: mapSupabaseChatsToAppFormat(data as SupabaseChat[]) };
      } catch (error) {
        console.error('[DEBUG] Ошибка при получении чатов:', error);
        
        // В случае ошибки используем демо-данные
        console.log('[DEBUG] Используем демо-данные из-за ошибки');
        return DEMO_CHATS;
      }
    },
    refetchOnWindowFocus: true,
    refetchInterval: 10000,
    staleTime: 5000
  });
};
