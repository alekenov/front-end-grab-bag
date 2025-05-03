
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, generateAIResponse } from "../utils.ts";

// Создаем клиент Supabase с сервисным ключом для полного доступа к API
const supabaseClient = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

// Обработчик отправки сообщений
export async function handleSendMessage(req: Request) {
  if (req.method === "POST") {
    try {
      const { chatId, content, product } = await req.json();
      
      if (!chatId || !content) {
        return new Response(
          JSON.stringify({ error: "Не указаны обязательные параметры" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          }
        );
      }

      // Проверка существования чата
      const { data: chatExists, error: chatError } = await supabaseClient
        .from("chats")
        .select("id, ai_enabled")
        .eq("id", chatId)
        .single();

      if (chatError || !chatExists) {
        return new Response(
          JSON.stringify({ error: "Указанный чат не существует" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 404,
          }
        );
      }

      // Добавление сообщения от пользователя
      const messageData = {
        chat_id: chatId,
        content,
        is_from_user: true,
        has_product: !!product,
        product_data: product ? {
          id: product.id,
          imageUrl: product.imageUrl,
          price: product.price
        } : null
      };
      
      console.log("Отправка сообщения:", messageData);
      
      const { data: newMessage, error: messageError } = await supabaseClient
        .from("messages")
        .insert([messageData])
        .select();

      if (messageError) throw messageError;

      // Обновление времени последнего сообщения в чате
      await supabaseClient
        .from("chats")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", chatId);
      
      // Если AI включен, генерируем ответ
      if (chatExists.ai_enabled) {
        // Формируем и отправляем ответ AI
        const aiResponse = await generateAIResponse(content, product);
        
        const aiMessageData = {
          chat_id: chatId,
          content: aiResponse,
          is_from_user: false
        };
        
        const { data: aiMessage, error: aiMessageError } = await supabaseClient
          .from("messages")
          .insert([aiMessageData])
          .select();

        if (aiMessageError) throw aiMessageError;
      }

      return new Response(JSON.stringify({ success: true, message: newMessage[0] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } catch (error) {
      console.error("Ошибка при отправке сообщения:", error);
      return new Response(JSON.stringify({ error: error.message || "Ошибка при отправке сообщения" }), {
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
