
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
  };
  sendMessage: (chatId: string, content: string, product?: Product) => Promise<any>;
  toggleAI: (chatId: string, enabled: boolean) => Promise<any>;
}
