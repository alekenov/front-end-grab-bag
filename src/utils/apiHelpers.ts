// Получаем базовый URL для API
export const getApiUrl = () => {
  // В продакшене используем относительный путь /api для проксирования через Cloudflare Pages
  // В разработке используем локальный Supabase или значение из конфигурации
  
  // Приоритеты:
  // 1. window.APP_CONFIG?.API_URL - для переопределения в рантайме
  // 2. import.meta.env.VITE_API_URL - из переменных окружения Vite
  // 3. /api - стандартный путь для продакшена
  // 4. http://localhost:8788/api - стандартный путь для локальной разработки
  
  return window.APP_CONFIG?.API_URL || 
         import.meta.env.VITE_API_URL || 
         (window.location.hostname === 'localhost' ? 'http://localhost:8788/api' : '/api');
};

// Функция для надежной загрузки с API с резервными данными
export async function fetchWithFallback<T>(
  url: string, 
  fallbackData: T, 
  options: RequestInit = {}
): Promise<T> {
  try {
    // Логируем информацию о запросе
    const endpoint = url.split('/').slice(-2).join('/');
    console.log(`📤 Отправка запроса: ${endpoint} (${options.method || 'GET'})`);
    
    // Расширяем таймаут для запросов
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      console.error(`⏱️ Превышен таймаут запроса: ${endpoint}`);
    }, 10000);
    
    const response = await fetch(url, { 
      ...options, 
      signal: controller.signal 
    });
    
    clearTimeout(timeoutId);
    
    console.log(`📥 Статус ответа: ${response.status} для ${endpoint}`);
    
    if (!response.ok) {
      // Пытаемся получить детали ошибки из тела ответа
      try {
        const errorDetails = await response.text();
        throw new Error(`Ошибка API (${response.status}): ${errorDetails || 'Без деталей'}`);
      } catch (detailsError) {
        throw new Error(`Ошибка API: ${response.status} (${response.statusText}) для ${endpoint}`);
      }
    }
    
    const text = await response.text();
    
    if (text) {
      console.log(`📦 Получены данные: ${endpoint} (${text.length} символов)`);
    } else {
      console.warn(`⚠️ Пустой ответ от ${endpoint}`);
    }
    
    try {
      return text ? JSON.parse(text) as T : fallbackData;
    } catch (parseError) {
      console.error(`🔄 Не удалось разобрать JSON от ${endpoint}:`, parseError);
      return fallbackData;
    }
  } catch (error) {
    const endpoint = url.split('/').pop() || url; // Get endpoint name for logging
    if (error instanceof Error) {
      console.error(`❌ Ошибка API при запросе ${endpoint}:`, error); // Log the full error object
      // Log specific messages based on error type
      if (error.message.includes('NetworkError') || error.message.includes('CORS')) {
         console.error('🔒 Возможная ошибка CORS. Проверьте настройки CORS на сервере или URL функции.');
      } else if (error.name === 'AbortError') {
         console.error('⏱️ Тайм-аут запроса. Сервер не ответил в течение 10 секунд.');
      } else {
         // Keep the fallback warning, but the main error is already logged above
         console.warn(`⚠️ [${endpoint}] Используются резервные данные.`); 
      }
    } else {
      // Log if it's not a standard Error object
      console.error(`❌ Неизвестная ошибка API при запросе ${endpoint}:`, error);
      console.warn(`⚠️ [${endpoint}] Используются резервные данные из-за неизвестной ошибки.`);
    }
    return fallbackData;
  }
}
