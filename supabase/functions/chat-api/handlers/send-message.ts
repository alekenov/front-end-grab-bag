
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, handleAIError } from "../utils.ts";

// Создаем клиент Supabase с сервисным ключом для полного доступа к API
const supabaseClient = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

// Функция для генерации AI ответа
async function generateAIResponse(content: string): Promise<string> {
  try {
    // В будущем здесь будет интеграция с моделью AI
    // Пока возвращаем простой ответ
    return `Автоматический ответ на сообщение: "${content}"`;
  } catch (error) {
    return handleAIError(error);
  }
}

// Обработчик для отправки сообщения
export async function handleSendMessage(req: Request) {
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Метод не поддерживается" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 405,
      }
    );
  }

  try {
    const body = await req.json();
    const { chatId, content, product } = body;

    if (!chatId || !content) {
      return new Response(
        JSON.stringify({ error: "Отсутствуют необходимые параметры" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    console.log(`Отправка сообщения в чат ${chatId}: ${content}`);

    // Сохраняем сообщение пользователя
    const { data: userMessage, error: userMessageError } = await supabaseClient
      .from("messages")
      .insert({
        chat_id: chatId,
        content,
        is_from_user: true,
        has_product: product ? true : false,
        product_data: product || null
      })
      .select()
      .single();

    if (userMessageError) {
      console.error("Ошибка при сохранении сообщения пользователя:", userMessageError);
      throw userMessageError;
    }

    // Обновляем дату последнего взаимодействия с чатом
    await supabaseClient
      .from("chats")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", chatId);

    // Проверяем, включен ли AI для этого чата
    const { data: chatData, error: chatError } = await supabaseClient
      .from("chats")
      .select("ai_enabled")
      .eq("id", chatId)
      .single();

    if (chatError) {
      console.error("Ошибка при получении настроек чата:", chatError);
      throw chatError;
    }

    let botResponse = null;

    // Если AI включен, генерируем ответ
    if (chatData.ai_enabled) {
      // Генерация ответа AI
      const aiResponseText = await generateAIResponse(content);
      
      // Сохраняем ответ AI
      const { data: botMessage, error: botMessageError } = await supabaseClient
        .from("messages")
        .insert({
          chat_id: chatId,
          content: aiResponseText,
          is_from_user: false
        })
        .select()
        .single();

      if (botMessageError) {
        console.error("Ошибка при сохранении ответа AI:", botMessageError);
        throw botMessageError;
      }

      botResponse = botMessage;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        userMessage,
        botResponse
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error(`Ошибка при отправке сообщения: ${error.message}`);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Ошибка при отправке сообщения",
        stack: error.stack
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
}
