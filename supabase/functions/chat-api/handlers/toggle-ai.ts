
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../utils.ts";

// Создаем клиент Supabase с сервисным ключом для полного доступа к API
const supabaseClient = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

// Обработчик переключения AI в чате
export async function handleToggleAI(req: Request) {
  if (req.method === "POST") {
    try {
      const { chatId, enabled } = await req.json();
      
      if (!chatId || enabled === undefined) {
        return new Response(
          JSON.stringify({ error: "Не указаны обязательные параметры" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          }
        );
      }

      // Проверка существования чата
      const { error: checkError } = await supabaseClient
        .from("chats")
        .select("id")
        .eq("id", chatId)
        .single();

      if (checkError) {
        return new Response(
          JSON.stringify({ error: "Указанный чат не существует" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 404,
          }
        );
      }

      // Обновление статуса AI
      const { error: updateError } = await supabaseClient
        .from("chats")
        .update({ ai_enabled: enabled })
        .eq("id", chatId);

      if (updateError) throw updateError;

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `AI ${enabled ? 'включен' : 'выключен'} для чата` 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    } catch (error) {
      console.error("Ошибка при переключении AI:", error);
      return new Response(JSON.stringify({ error: error.message || "Ошибка при переключении AI" }), {
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
