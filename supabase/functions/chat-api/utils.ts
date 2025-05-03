
// Вспомогательные функции для chat-api

// Настройка CORS для запросов с фронтенда
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Простая функция генерации ответов AI на основе шаблонов
export async function generateAIResponse(userMessage: string, product?: any): Promise<string> {
  // В будущем здесь можно использовать OpenAI или другие AI сервисы
  
  if (product) {
    return `Спасибо за интерес к нашему букету стоимостью ${product.price} ₸! Чем я могу помочь вам с выбором этого букета?`;
  }

  // Простые шаблоны ответов на основе ключевых слов в сообщении
  if (userMessage.toLowerCase().includes('доставк')) {
    return 'Доставка осуществляется в течение 2-3 часов с момента подтверждения заказа. Доставка бесплатна при заказе от 5000 ₸.';
  }
  
  if (userMessage.toLowerCase().includes('цен')) {
    return 'Цены на наши букеты начинаются от 3000 ₸. Точную стоимость можно узнать в каталоге на нашем сайте.';
  }
  
  if (userMessage.toLowerCase().includes('оплат')) {
    return 'Мы принимаем оплату наличными при получении, банковскими картами или онлайн-переводом.';
  }

  if (userMessage.toLowerCase().includes('роз')) {
    return 'У нас представлен широкий выбор букетов с розами разных сортов и цветов. Какой именно букет вы ищете?';
  }

  if (userMessage.toLowerCase().includes('тюльпан')) {
    return 'Тюльпаны доступны в сезон (весна) в различных цветовых вариациях. Хотите узнать о текущем наличии?';
  }

  // Стандартный ответ
  return 'Спасибо за ваше сообщение! Чем я могу вам помочь сегодня?';
}
