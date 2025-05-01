
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/chat";
import { getApiUrl } from "@/utils/apiHelpers";

// URL для API Edge Function (прямой доступ к Supabase Edge Functions)
export const CHAT_API_URL = `${getApiUrl()}/chat-api`;

// Анонимный токен доступа для использования, когда нет сессии
export const ANON_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrb2h3ZWl2YmR3d2V5dnl2Y2JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM1NjU4OTYsImV4cCI6MjA0OTE0MTg5Nn0.5mQbONpvpBmRkwYO8ZSxnRupYAQ36USXIZWeQxKQLxs";

// Утилита разбора данных о продукте
export const parseProductData = (productData: any) => {
  // Если productData — строка, пробуем распарсить её
  const data = typeof productData === 'string'
    ? JSON.parse(productData)
    : productData;
  
  // Проверяем, что данные имеют требуемую структуру
  if (data && 
      typeof data === 'object' && 
      'id' in data && 
      'imageUrl' in data && 
      'price' in data) {
    
    return {
      id: String(data.id),
      imageUrl: String(data.imageUrl),
      price: Number(data.price)
    };
  }
  
  return null;
};

// Получение текущей сессии аутентификации с обработкой анонимного доступа
export const getAuthSession = async () => {
  try {
    console.log('Получение сессии авторизации...');
    
    const { data: sessionData, error } = await supabase.auth.getSession();
    
    if (error) {
      console.warn('Ошибка получения сессии:', error.message);
      return {
        accessToken: ANON_TOKEN,
        session: null
      };
    }
    
    // Используем анонимный ключ, если нет сессии
    const accessToken = sessionData?.session?.access_token || ANON_TOKEN;
    
    console.log(`Токен получен: ${accessToken.substring(0, 15)}...`);
    
    return {
      accessToken,
      session: sessionData?.session
    };
  } catch (error) {
    console.error('Ошибка получения сессии:', error);
    
    // Возвращаем анонимный ключ в случае ошибки
    return {
      accessToken: ANON_TOKEN,
      session: null
    };
  }
};

// Форматирование сообщения из ответа Supabase
export const formatSupabaseMessage = (msg: any): Message => {
  const result: Message = {
    id: msg.id,
    content: msg.content || "",
    role: msg.is_from_user ? "USER" : "BOT",
    timestamp: msg.created_at || new Date().toISOString()
  };
  
  // Добавляем данные о продукте, если они доступны
  if (msg.has_product && msg.product_data) {
    const productData = parseProductData(msg.product_data);
    if (productData) {
      result.product = productData;
    }
  }
  
  return result;
};
