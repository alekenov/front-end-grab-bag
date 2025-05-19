
import { Chat, Message } from "@/types/chat";
import { Product } from "@/types/product";

export interface SendMessageParams {
  chatId: string;
  content: string;
  product?: Product;
}

export interface ToggleAIParams {
  chatId: string;
  enabled: boolean;
}

export interface ChatsResponse {
  chats: Chat[];
}

export interface ChatApiHook {
  chats: Chat[];
  isLoadingChats: boolean;
  chatsError: Error | null;
  refetchChats: () => void;
  getMessages: (chatId: string | null) => {
    data: Message[];
    isLoading: boolean;
    error: Error | null;
    refetch: () => void;
    isDemoChat?: boolean;
  };
  sendMessage: (chatId: string, content: string, product?: Product) => Promise<any>;
  isSendingMessage: boolean;
  toggleAI: (chatId: string, enabled: boolean) => Promise<any>;
  isTogglingAI: boolean;
}
