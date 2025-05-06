
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "./utils.ts";
import { handleChats } from "./handlers/chats.ts";
import { handleMessages } from "./handlers/messages.ts";
import { handleSendMessage } from "./handlers/send-message.ts";
import { handleToggleAI } from "./handlers/toggle-ai.ts";

serve(async (req) => {
  // Обработка CORS preflight запросов
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.split("/").filter(Boolean);
    
    // Логируем заголовки для отладки
    console.log("Request headers:", Object.fromEntries(req.headers.entries()));
    console.log("Path:", path);
    
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
      
      case "toggle-ai":
        return handleToggleAI(req);
        
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
