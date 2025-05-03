
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../utils.ts";

// Создаем клиент Supabase с сервисным ключом для полного доступа к API
const supabaseClient = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

// Обработчик запросов к чатам
export async function handleChats(req: Request, url: URL) {
  if (req.method === "GET") {
    try {
      // Получаем все чаты с их последними сообщениями
      const { data, error } = await supabaseClient.rpc('get_chats_with_last_messages');

      if (error) {
        console.error("Ошибка при получении чатов:", error);
        throw error;
      }
      
      console.log("Получено чатов с сообщениями:", data ? data.length : 0);
      
      // Преобразуем данные в формат, ожидаемый фронтендом
      const formattedChats = data.map(chat => ({
        id: chat.id,
        name: chat.name || (chat.phone_number ? `WhatsApp ${chat.phone_number}` : "Новый контакт"),
        phone_number: chat.phone_number || null,
        aiEnabled: chat.ai_enabled,
        unreadCount: chat.unread_count || 0,
        source: chat.source || "web", // Добавляем источник чата
        lastMessage: chat.last_message_content ? {
          content: chat.last_message_content,
          timestamp: chat.last_message_timestamp
        } : undefined,
        created_at: chat.created_at,
        updated_at: chat.updated_at
      }));

      return new Response(JSON.stringify({ chats: formattedChats }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } catch (error) {
      console.error("Ошибка при обработке запроса чатов:", error);
      return new Response(
        JSON.stringify({ error: error.message || "Внутренняя ошибка сервера" }),
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
