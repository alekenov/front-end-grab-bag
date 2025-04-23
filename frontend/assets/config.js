// Конфигурация API для различных окружений
window.APP_CONFIG = {
  // Определяем базовый URL API в зависимости от окружения
  API_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8788/api' // Для локальной разработки
    : '/api', // Для продакшн (test.cvety.kz)
  
  // Версия приложения
  VERSION: '1.0.0',
  
  // Режим работы
  ENV: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'development'
    : 'production'
};
