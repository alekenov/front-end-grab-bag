
import { Chat, SupabaseChat } from '@/types/chat';

export function formatPhoneNumber(phone: string): string {
  // Удаляем все нецифровые символы
  let cleanPhone = phone.replace(/\D/g, '');
  
  // Если номер начинается с 7 и длина 11 символов (российский формат)
  if (cleanPhone.startsWith('7') && cleanPhone.length === 11) {
    // Форматируем как +7 (XXX) XXX-XX-XX
    return `+${cleanPhone[0]} (${cleanPhone.substring(1, 4)}) ${cleanPhone.substring(4, 7)}-${cleanPhone.substring(7, 9)}-${cleanPhone.substring(9, 11)}`;
  }
  
  // Если номер начинается с 8 и длина 11 символов (российский формат)
  if (cleanPhone.startsWith('8') && cleanPhone.length === 11) {
    // Форматируем как +7 (XXX) XXX-XX-XX (заменяем 8 на +7)
    return `+7 (${cleanPhone.substring(1, 4)}) ${cleanPhone.substring(4, 7)}-${cleanPhone.substring(7, 9)}-${cleanPhone.substring(9, 11)}`;
  }
  
  // Если длина 10 символов (российский номер без кода страны)
  if (cleanPhone.length === 10) {
    // Добавляем код страны и форматируем
    return `+7 (${cleanPhone.substring(0, 3)}) ${cleanPhone.substring(3, 6)}-${cleanPhone.substring(6, 8)}-${cleanPhone.substring(8, 10)}`;
  }
  
  // Для других форматов возвращаем исходный номер
  return phone;
}

// Преобразование данных из Supabase в формат приложения
export function mapSupabaseChatToAppFormat(chat: SupabaseChat): Chat {
  return {
    id: chat.id,
    name: chat.name || (chat.phone_number ? `Клиент ${formatPhoneNumber(chat.phone_number)}` : "Новый контакт"),
    aiEnabled: chat.ai_enabled || false,
    unreadCount: chat.unread_count || 0,
    lastMessage: chat.last_message_content || chat.last_message_timestamp 
      ? {
          content: chat.last_message_content || "",
          timestamp: chat.last_message_timestamp || new Date().toISOString(),
          hasProduct: chat.last_message_has_product || false,
          price: chat.last_message_product_price || 0
        }
      : undefined,
    created_at: chat.created_at || undefined,
    updated_at: chat.updated_at || undefined,
    source: chat.source || "web",
    tags: chat.tags || [],
    phone_number: chat.phone_number,
    customer: chat.customer
  };
}
