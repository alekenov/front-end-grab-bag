
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Настройка CORS для запросов с фронтенда
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Создаем клиент Supabase с сервисным ключом для полного доступа к API
const supabaseClient = createClient(
  // Используем переменные окружения для URL и ключей Supabase
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

serve(async (req) => {
  // Обработка CORS preflight запросов
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.split("/").filter(Boolean);
    
    // Извлекаем параметры запроса
    const endpoint = path[1]; // chat-api/[endpoint]
    
    // Базовые операции с чатами и сообщениями
    switch (endpoint) {
      case "chats":
        return handleChats(req, url);
      
      case "messages":
        return handleMessages(req, url);
      
      case "send":
        return handleSendMessage(req);
      
      default:
        return new Response(JSON.stringify({ error: "Неизвестный эндпоинт" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        });
    }
  } catch (error) {
    console.error("Ошибка обработки запроса:", error.message);
    
    return new Response(
      JSON.stringify({ error: error.message || "Внутренняя ошибка сервера" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

// Обработчик запросов к чатам
async function handleChats(req: Request, url: URL) {
  if (req.method === "GET") {
    // Оптимизированный запрос: получаем чаты вместе с их последними сообщениями одним запросом
    // Это решает проблему N+1 запросов
    const { data, error } = await supabaseClient.rpc('get_chats_with_last_messages');

    if (error) {
      console.error("Ошибка при получении чатов:", error);
      throw error;
    }
    
    console.log("Получено чатов с сообщениями:", data ? data.length : 0);
    
    // Преобразуем данные в формат, ожидаемый фронтендом
    const formattedChats = data.map(chat => ({
      id: chat.id,
      name: chat.name,
      aiEnabled: chat.ai_enabled,
      unreadCount: chat.unread_count || 0,
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
  }

  return new Response(
    JSON.stringify({ error: "Метод не поддерживается" }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 405,
    }
  );
}

// Обработчик запросов к сообщениям
async function handleMessages(req: Request, url: URL) {
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

    // Получение сообщений для конкретного чата
    const { data: messages, error } = await supabaseClient
      .from("messages")
      .select("*")
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    
    console.log(`Получено сообщений для чата ${chatId}:`, messages.length);
    
    // Логируем первое сообщение для отладки
    if (messages.length > 0) {
      console.log("Пример сообщения:", {
        id: messages[0].id,
        content: messages[0].content,
        is_from_user: messages[0].is_from_user,
        has_product: messages[0].has_product,
        product_data: messages[0].product_data
      });
    }

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
  }

  return new Response(
    JSON.stringify({ error: "Метод не поддерживается" }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 405,
    }
  );
}

// Обработчик отправки сообщений
async function handleSendMessage(req: Request) {
  if (req.method === "POST") {
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
  }

  return new Response(
    JSON.stringify({ error: "Метод не поддерживается" }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 405,
    }
  );
}

// Простая функция генерации ответов AI на основе шаблонов
async function generateAIResponse(userMessage: string, product?: any): Promise<string> {
  // В будущем здесь можно использовать OpenAI или другие AI сервисы
  
  if (product) {
    return `Спасибо за интерес к нашему букету стоимостью ${product.price} ₸! Чем я могу помочь вам с выбором этого букета?`;
  }

  // Простые шаблоны ответов на основе ключевых слов в сообщении
  if (userMessage.toLowerCase().includes('доставк')) {
    return 'Доставка осуществляется в течение 2-3 часов с момента подтверждения заказа. Доставка бесплатна при заказе от 5000 ₸.';
  }
  
  if (userMessage.toLowerCase().includes('цен')) {
    return 'Цены на наши букеты начинаются от 3000 ₸. Точную стоимость можно узнать в каталоге на нашем сайте.';
  }
  
  if (userMessage.toLowerCase().includes('оплат')) {
    return 'Мы принимаем оплату наличными при получении, банковскими картами или онлайн-переводом.';
  }

  if (userMessage.toLowerCase().includes('роз')) {
    return 'У нас представлен широкий выбор букетов с розами разных сортов и цветов. Какой именно букет вы ищете?';
  }

  if (userMessage.toLowerCase().includes('тюльпан')) {
    return 'Тюльпаны доступны в сезон (весна) в различных цветовых вариациях. Хотите узнать о текущем наличии?';
  }

  // Стандартный ответ
  return 'Спасибо за ваше сообщение! Чем я могу вам помочь сегодня?';
}
