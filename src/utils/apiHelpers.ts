
// Получаем базовый URL для API
export const getApiUrl = () => {
  // Используем API из конфигурации или локальный API
  return window.APP_CONFIG?.API_URL || '/api';
};

// Функция для надежной загрузки с API с резервными данными
export async function fetchWithFallback<T>(
  url: string, 
  fallbackData: T, 
  options: RequestInit = {}
): Promise<T> {
  try {
    console.log(`Запрос к: ${url}`);
    
    // Расширяем таймаут для запросов
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(url, { 
      ...options, 
      signal: controller.signal 
    });
    
    clearTimeout(timeoutId);
    
    console.log(`Статус ответа: ${response.status}`);
    
    if (!response.ok) {
      throw new Error(`Ошибка API: ${response.status}`);
    }
    
    const text = await response.text();
    console.log(`Получены данные (${text.length} символов)`);
    
    try {
      return text ? JSON.parse(text) as T : fallbackData;
    } catch (parseError) {
      console.error('Не удалось разобрать JSON:', parseError);
      return fallbackData;
    }
  } catch (error) {
    console.warn('Используются резервные данные из-за ошибки:', error);
    return fallbackData;
  }
}
