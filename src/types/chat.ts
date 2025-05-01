
export interface Message {
  id: string;
  content: string;
  role: "USER" | "BOT";
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

export interface Chat {
  id: string;
  name: string;
  aiEnabled: boolean;
  unreadCount?: number;
  lastMessage?: {
    content: string;
    timestamp: string;
  };
  // Добавляем поля, соответствующие Supabase
  created_at?: string;
  updated_at?: string;
}

// Добавляем интерфейс для данных из Supabase
export interface SupabaseChat {
  id: string;
  name: string;
  ai_enabled: boolean;
  unread_count: number | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface SupabaseMessage {
  id: string;
  chat_id: string;
  content: string;
  is_from_user: boolean | null;
  has_product: boolean | null;
  product_data: any | null;
  created_at: string | null;
}
