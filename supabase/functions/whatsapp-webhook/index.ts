
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.37.0";

// Настройка CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Создание клиента Supabase с использованием env переменных
const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Функция для обработки/форматирования номера телефона WhatsApp
function formatPhoneNumber(phone: string): string {
  // Удаляем все нецифровые символы и обеспечиваем согласованный формат
  // WhatsApp API может присылать номера в формате с кодом страны или без него
  let cleanPhone = phone.replace(/\D/g, '');
  
  // Проверяем, начинается ли номер с кода страны
  if (cleanPhone.startsWith('7') && cleanPhone.length === 11) {
    return cleanPhone;
  } else if (cleanPhone.length === 10) {
    return '7' + cleanPhone;
  }
  
  // Для других форматов возвращаем как есть
  return cleanPhone;
}

serve(async (req) => {
  // Обработка CORS preflight запросов
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    // Получаем данные запроса
    let body;
    const contentType = req.headers.get("content-type") || "";
    
    if (contentType.includes("application/json")) {
      body = await req.json();
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await req.formData();
      body = Object.fromEntries(formData.entries());
    } else {
      throw new Error(`Unsupported content-type: ${contentType}`);
    }
    
    console.log("Received webhook data:", JSON.stringify(body));
    
    // Обработка верификационного запроса от WhatsApp
    if (req.method === "GET") {
      const url = new URL(req.url);
      const mode = url.searchParams.get("hub.mode");
      const token = url.searchParams.get("hub.verify_token");
      const challenge = url.searchParams.get("hub.challenge");
      
      // Проверка токена верификации
      const VERIFY_TOKEN = Deno.env.get("WHATSAPP_VERIFY_TOKEN") || "whatsapp_verification_token";
      
      if (mode === "subscribe" && token === VERIFY_TOKEN) {
        console.log("Webhook verified successfully");
        return new Response(challenge, { headers: corsHeaders, status: 200 });
      } else {
        console.error("Failed webhook verification");
        return new Response("Verification failed", { headers: corsHeaders, status: 403 });
      }
    }
    
    // Обработка входящих сообщений WhatsApp
    if (req.method === "POST") {
      // Проверяем наличие полезной нагрузки сообщения WhatsApp
      if (!body.entry || !Array.isArray(body.entry)) {
        throw new Error("Invalid webhook payload");
      }
      
      // Обработка каждой записи
      for (const entry of body.entry) {
        if (!entry.changes || !Array.isArray(entry.changes)) continue;
        
        for (const change of entry.changes) {
          if (!change.value || !change.value.messages || !Array.isArray(change.value.messages)) continue;
          
          // Обработка каждого сообщения
          for (const message of change.value.messages) {
            const rawPhoneNumber = message.from; // Номер телефона отправителя
            // Форматируем номер телефона для согласованности
            const from = formatPhoneNumber(rawPhoneNumber);
            
            const timestamp = new Date(parseInt(message.timestamp) * 1000).toISOString();
            let content = "";
            
            // Определяем тип сообщения и извлекаем содержимое
            if (message.text) {
              content = message.text.body;
            } else if (message.image) {
              content = "[Изображение]";
            } else if (message.video) {
              content = "[Видео]";
            } else if (message.audio) {
              content = "[Аудио]";
            } else if (message.document) {
              content = "[Документ]";
            } else {
              content = "[Неизвестный тип сообщения]";
            }
            
            console.log(`Processing message from ${from}: ${content}`);
            
            // 1. Проверяем наличие клиента с таким номером телефона
            const { data: customer, error: customerError } = await supabase
              .from("customers")
              .select("id")
              .eq("phone", from)
              .maybeSingle();
            
            let customerId;
            
            // 2. Если клиента нет, создаем нового
            if (!customer) {
              console.log(`Creating new customer for phone: ${from}`);
              const { data: newCustomer, error: newCustomerError } = await supabase
                .from("customers")
                .insert({
                  phone: from,
                  first_name: "WhatsApp",
                  last_name: from,
                  opt_in: true,
                  last_interaction: timestamp
                })
                .select("id")
                .single();
              
              if (newCustomerError) {
                console.error("Error creating customer:", newCustomerError);
                continue;
              }
              
              customerId = newCustomer.id;
            } else {
              customerId = customer.id;
              
              // Обновляем время последнего взаимодействия
              await supabase
                .from("customers")
                .update({ last_interaction: timestamp })
                .eq("id", customerId);
            }
            
            // 3. Проверяем, есть ли у клиента чат
            const { data: chatCustomer, error: chatCustomerError } = await supabase
              .from("chat_customers")
              .select("chat_id")
              .eq("customer_id", customerId)
              .maybeSingle();
            
            let chatId;
            
            if (!chatCustomer) {
              // 4. Если чата нет, создаем новый
              console.log(`Creating new chat for customer: ${customerId}`);
              const chatName = `WhatsApp: ${from}`;
              
              const { data: newChat, error: newChatError } = await supabase
                .from("chats")
                .insert({
                  name: chatName,
                  ai_enabled: true,
                  unread_count: 1,
                  source: "whatsapp"
                })
                .select("id")
                .single();
              
              if (newChatError) {
                console.error("Error creating chat:", newChatError);
                continue;
              }
              
              chatId = newChat.id;
              
              // Связываем чат с клиентом
              await supabase
                .from("chat_customers")
                .insert({
                  chat_id: chatId,
                  customer_id: customerId
                });
            } else {
              chatId = chatCustomer.chat_id;
              
              // Увеличиваем счетчик непрочитанных сообщений
              await supabase
                .from("chats")
                .update({ 
                  unread_count: supabase.rpc("increment", { row_id: chatId, table_name: "chats", column_name: "unread_count" }),
                  updated_at: timestamp
                })
                .eq("id", chatId);
            }
            
            // 5. Сохраняем сообщение
            await supabase
              .from("messages")
              .insert({
                chat_id: chatId,
                content: content,
                is_from_user: true,
                created_at: timestamp
              });
            
            console.log(`Message saved to chat ${chatId}`);
          }
        }
      }
      
      // Возвращаем успешный ответ для WhatsApp API
      return new Response(JSON.stringify({ status: "ok" }), { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      });
    }
    
    // Обработка неизвестного метода
    return new Response(JSON.stringify({ error: "Method not allowed" }), { 
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 405 
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    );
  }
});
