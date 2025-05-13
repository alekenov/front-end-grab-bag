
import { Chat, Message, Tag } from "@/types/chat";
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
  currentChatId: string | null;
  setCurrentChatId: (id: string | null) => void;
  getChat: (chatId: string) => { 
    data: Chat | null; 
    isLoading: boolean; 
    error: any;
    refetch: () => Promise<any>;
  };
  getMessages: (chatId: string) => {
    data: Message[];
    isLoading: boolean;
    error: Error | null;
    refetch: () => void;
  };
  sendMessage: (chatId: string, content: string, product?: Product) => Promise<any>;
  toggleAI: (chatId: string, enabled: boolean) => Promise<any>;
  getChatTags: (chatId: string) => Tag[];
  setChatTags: (chatId: string, tags: Tag[]) => void;
  isLoading: boolean;
}
