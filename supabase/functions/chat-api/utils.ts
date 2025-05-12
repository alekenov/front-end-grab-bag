
// CORS заголовки для Edge функций
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Форматирование номера телефона для WhatsApp
 * Преобразует любой формат номера в стандартизированный для хранения и отображения
 */
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '';
  
  // Удаляем все не числовые символы
  let cleaned = phone.replace(/\D/g, '');
  
  // Если номер начинается с 8, заменяем на 7
  if (cleaned.startsWith('8') && cleaned.length === 11) {
    cleaned = '7' + cleaned.substring(1);
  }
  
  // Добавляем + в начало, если его нет и номер не пустой
  if (!cleaned.startsWith('+') && cleaned.length > 0) {
    cleaned = '+' + cleaned;
  }
  
  return cleaned;
};

// Создает имя чата на основе номера телефона
export const createChatNameFromPhone = (phone: string): string => {
  const formattedPhone = formatPhoneNumber(phone);
  return `WhatsApp ${formattedPhone}`;
};

// Обработка ошибки генерации AI ответа
export const handleAIError = (error: any): string => {
  console.error("AI Generation Error:", error);
  return "Произошла ошибка при генерации ответа. Пожалуйста, попробуйте снова позже.";
};
