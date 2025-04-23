export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Перенаправляем все API запросы на Worker
    if (url.pathname.startsWith('/api/')) {
      // Заменяем домен на домен воркера
      url.hostname = 'whatsapp-webhook.alekenov.workers.dev';
      
      // Создаем новый запрос
      const newRequest = new Request(url.toString(), request);
      
      // Отправляем запрос на воркер
      return fetch(newRequest);
    }
    
    // Все остальные запросы обрабатываются Pages
    return env.ASSETS.fetch(request);
  }
};
