
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

// Функция для генерации AI ответа
export async function generateAIResponse(content: string): Promise<string> {
  try {
    console.log("Generating AI response for:", content);
    
    // Простые правила для автоматических ответов
    if (content.toLowerCase().includes("привет") || content.toLowerCase().includes("здравствуйте")) {
      return "Здравствуйте! Чем я могу помочь вам сегодня?";
    } else if (content.toLowerCase().includes("спасибо")) {
      return "Пожалуйста! Всегда рад помочь.";
    } else if (content.toLowerCase().includes("цветы") || content.toLowerCase().includes("букет")) {
      return "У нас большой выбор цветов и букетов на любой вкус. Могу предложить розы, тюльпаны, хризантемы или составить индивидуальный букет по вашему желанию.";
    } else if (content.toLowerCase().includes("цена") || content.toLowerCase().includes("стоимость")) {
      return "Стоимость наших букетов начинается от 3000 тенге. Конечная цена зависит от выбранных цветов и размера букета.";
    } else if (content.toLowerCase().includes("доставка")) {
      return "Мы осуществляем доставку по всему городу. Стандартная доставка занимает 2-3 часа. Также доступна экспресс-доставка в течение 1 часа.";
    } else {
      // Общий ответ для других запросов
      return `Спасибо за ваше сообщение: "${content}". Наш менеджер скоро с вами свяжется для уточнения деталей.`;
    }
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
