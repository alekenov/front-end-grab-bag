
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
      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
      
      console.log(`SUPABASE_URL установлен: ${!!supabaseUrl}`);
      console.log(`SUPABASE_SERVICE_ROLE_KEY установлен: ${!!supabaseKey}`);
      
      if (!supabaseUrl || !supabaseKey) {
        throw new Error("Отсутствуют переменные окружения SUPABASE_URL или SUPABASE_SERVICE_ROLE_KEY");
      }
      
      // Используем новую RPC функцию для получения чатов с тегами
      console.log("Вызываем RPC функцию get_chats_with_tags");
      const { data: chats, error } = await supabaseClient
        .rpc('get_chats_with_tags');
      
      if (error) {
        console.error("Ошибка при вызове RPC функции:", error);
        throw error;
      }
      
      console.log(`Получено ${chats?.length || 0} чатов`);
      if (Array.isArray(chats) && chats.length > 0) {
        console.log("Первые 3 чата:", chats.slice(0, 3));
      } else {
        console.log("Список чатов пуст или не является массивом:", chats);
      }
      
      // Проверяем, что данные получены корректно
      if (!chats || !Array.isArray(chats)) {
        console.error("Ошибка: данные чатов отсутствуют или имеют неверный формат");
        return new Response(
          JSON.stringify({ 
            error: "Данные чатов отсутствуют или имеют неверный формат",
            raw: chats
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          }
        );
      }
      
      // Преобразуем данные в формат, который ожидает фронтенд
      const formattedChats = chats.map((chat: any) => ({
        id: chat.id,
        name: chat.name,
        aiEnabled: chat.ai_enabled,
        unreadCount: chat.unread_count,
        source: chat.source || 'web',
        created_at: chat.created_at,
        updated_at: chat.updated_at,
        tags: chat.tags || [],
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
      console.error(`Стек ошибки: ${error.stack}`);
      
      return new Response(
        JSON.stringify({ 
          error: error.message || "Ошибка получения списка чатов",
          stack: error.stack
        }),
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
