
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../utils.ts";

// Создаем клиент Supabase с сервисным ключом для полного доступа к API
const supabaseClient = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

// Обработчик запросов к сообщениям конкретного чата
export async function handleMessages(req: Request, url: URL) {
  if (req.method === "GET") {
    const chatId = url.searchParams.get("chatId");
    
    if (!chatId) {
      return new Response(
        JSON.stringify({ error: "Chat ID is required" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }
    
    console.log(`Получение сообщений для чата ${chatId}`);
    
    try {
      // Получаем сообщения из базы данных
      const { data: messages, error } = await supabaseClient
        .from("messages")
        .select("*")
        .eq("chat_id", chatId)
        .order("created_at", { ascending: true });
      
      if (error) throw error;
      
      console.log(`Получено ${messages?.length || 0} сообщений`);
      
      // Преобразуем сообщения в формат, ожидаемый фронтендом
      const formattedMessages = (messages || []).map(msg => ({
        id: msg.id,
        content: msg.content,
        role: msg.is_from_user ? "USER" : "BOT",
        timestamp: msg.created_at,
        product: msg.has_product && msg.product_data ? {
          id: msg.product_data.id || "",
          imageUrl: msg.product_data.imageUrl || "",
          price: msg.product_data.price || 0
        } : undefined
      }));
      
      // Сбрасываем счетчик непрочитанных сообщений при запросе сообщений чата
      await supabaseClient
        .from("chats")
        .update({ unread_count: 0 })
        .eq("id", chatId);
      
      return new Response(
        JSON.stringify({ messages: formattedMessages }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    } catch (error) {
      console.error(`Ошибка при получении сообщений: ${error.message}`);
      return new Response(
        JSON.stringify({ error: error.message || "Ошибка получения сообщений" }),
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
