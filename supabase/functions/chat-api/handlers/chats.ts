
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../utils.ts";
import type { SupabaseChat } from "../../../../src/types/chat.ts";

// Создаем клиент Supabase с сервисным ключом для полного доступа к API
const supabaseClient = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

// Обработчик запроса списка чатов
export async function handleChats(req: Request) {
  if (req.method === "GET") {
    console.log("Получение списка чатов");
    
    try {
      // Используем RPC функцию для получения всех чатов с последними сообщениями
      const { data: chats, error } = await supabaseClient
        .rpc('get_chats_with_last_messages');
      
      if (error) throw error;
      
      console.log(`Получено ${chats?.length || 0} чатов`);
      console.log("Первые 3 чата:", chats?.slice(0, 3));
      
      // Преобразуем данные в формат, который ожидает фронтенд
      const formattedChats = chats.map((chat: any) => ({
        id: chat.id,
        name: chat.name,
        aiEnabled: chat.ai_enabled,
        unreadCount: chat.unread_count,
        source: chat.source || 'web',
        created_at: chat.created_at,
        updated_at: chat.updated_at,
        lastMessage: chat.last_message_content || chat.last_message_timestamp ? {
          content: chat.last_message_content || "",
          timestamp: chat.last_message_timestamp,
          hasProduct: chat.last_message_has_product || false,
          price: chat.last_message_product_price
        } : undefined
      }));
      
      console.log("Форматированные чаты:", formattedChats.slice(0, 3));
      
      return new Response(
        JSON.stringify({ chats: formattedChats }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    } catch (error) {
      console.error(`Ошибка при получении списка чатов: ${error.message}`);
      return new Response(
        JSON.stringify({ error: error.message || "Ошибка получения списка чатов" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }
  }

  return new Response(
    JSON.stringify({ error: "Метод не поддерживается" }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 405,
    }
  );
}
