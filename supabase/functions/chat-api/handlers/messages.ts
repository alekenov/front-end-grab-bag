
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../utils.ts";

// Создаем клиент Supabase с сервисным ключом для полного доступа к API
const supabaseClient = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

// Обработчик запросов к сообщениям
export async function handleMessages(req: Request, url: URL) {
  if (req.method === "GET") {
    const chatId = url.searchParams.get("chatId");
    
    if (!chatId) {
      return new Response(
        JSON.stringify({ error: "Не указан ID чата" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    try {
      // Получение сообщений для конкретного чата
      const { data: messages, error } = await supabaseClient
        .from("messages")
        .select("*")
        .eq("chat_id", chatId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      
      console.log(`Получено сообщений для чата ${chatId}:`, messages.length);

      // Преобразование сообщений в формат, ожидаемый фронтендом
      const formattedMessages = messages.map(msg => ({
        id: msg.id,
        content: msg.content,
        role: msg.is_from_user ? "USER" : "BOT",
        timestamp: msg.created_at,
        product: msg.has_product && msg.product_data ? {
          id: msg.product_data.id,
          imageUrl: msg.product_data.imageUrl,
          price: msg.product_data.price
        } : undefined
      }));

      return new Response(JSON.stringify({ messages: formattedMessages }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } catch (error) {
      console.error(`Ошибка при получении сообщений для чата ${chatId}:`, error);
      return new Response(JSON.stringify({ error: error.message || "Ошибка при получении сообщений" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
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
