
// Конфигурация API для различных окружений
window.APP_CONFIG = {
  // Определяем базовый URL API в зависимости от окружения
  API_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:54321/functions/v1' // Для локальной разработки
    : 'https://dkohweivbdwweyvyvcbc.supabase.co/functions/v1', // Для продакшн - прямая ссылка на Supabase Edge Functions
  
  // Версия приложения
  VERSION: '1.0.0',
  
  // Режим работы
  ENV: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'development'
    : 'production'
};

console.log('APP_CONFIG loaded:', window.APP_CONFIG);
