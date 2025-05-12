
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// CORS заголовки для разрешения кроссдоменных запросов
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

// Обработка ошибок API
export function handleApiError(error: any, status = 500) {
  console.error(`API Error: ${error.message}`);
  return new Response(
    JSON.stringify({
      error: error.message || "Произошла ошибка при обработке запроса",
    }),
    {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
}

// Обработка ошибок AI
export function handleAIError(error: any): string {
  console.error(`AI Error: ${error.message || error}`);
  return "Извините, возникла проблема при генерации ответа. Пожалуйста, попробуйте еще раз позже.";
}

// Функция для генерации AI ответа (добавлена)
export async function generateAIResponse(content: string): Promise<string> {
  try {
    // В будущем здесь будет интеграция с моделью AI
    // Пока возвращаем простой ответ
    return `Автоматический ответ на сообщение: "${content}"`;
  } catch (error) {
    return handleAIError(error);
  }
}

// Вспомогательная функция для валидации обязательных параметров
export function validateRequiredParams(params: Record<string, any>, requiredParams: string[]): string | null {
  for (const param of requiredParams) {
    if (!params[param]) {
      return `Отсутствует обязательный параметр: ${param}`;
    }
  }
  return null;
}

// Вспомогательная функция для безопасного получения значений из query-строки
export function getQueryParam(url: URL, name: string): string | null {
  return url.searchParams.get(name);
}
