
export interface Message {
  id: string;
  content: string;
  role: "USER" | "BOT";
  sender?: "AI" | "OPERATOR"; // Информация о том, кто отправил сообщение
  operatorName?: string;      // Добавляем имя оператора
  timestamp: string;
  product?: {
    id: string;
    imageUrl: string;
    price: number;
  };
}

export interface MessagesByDate {
  [date: string]: Message[];
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Chat {
  id: string;
  name: string;
  aiEnabled: boolean;
  unreadCount?: number;
  lastMessage?: {
    content: string;
    timestamp: string;
    hasProduct?: boolean;
    price?: number;
  };
  // Добавляем поля, соответствующие Supabase
  created_at?: string;
  updated_at?: string;
  // Добавляем источник чата (whatsapp, telegram, web и т.д.)
  source?: string;
  // Добавляем теги чата
  tags?: Tag[];
  // Добавляем данные о клиенте
  customer?: {
    phone: string;
    firstName?: string;
    lastName?: string;
  };
  phone_number?: string; // Альтернативный способ хранения номера телефона
}

// Добавляем интерфейс для данных из Supabase
export interface SupabaseChat {
  id: string;
  name: string;
  phone_number?: string; // Добавлено для совместимости с WhatsApp
  ai_enabled: boolean;
  unread_count: number | null;
  created_at: string | null;
  updated_at: string | null;
  last_message_content?: string | null;
  last_message_timestamp?: string | null;
  last_message_has_product?: boolean | null;
  last_message_product_price?: number | null;
  source?: string | null; // Добавлен источник чата
  tags?: Tag[] | null; // Добавлены теги чата
  customer?: {
    phone: string;
    first_name?: string;
    last_name?: string;
  } | null;
}

export interface SupabaseMessage {
  id: string;
  chat_id: string;
  content: string;
  is_from_user: boolean | null;
  has_product: boolean | null;
  product_data: any | null;
  created_at: string | null;
  operator_name?: string | null; // Добавляем поле для имени оператора
}
