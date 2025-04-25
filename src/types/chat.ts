
export interface Message {
  id: string;
  content: string;
  role: "USER" | "BOT";
  timestamp: string;
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
}
