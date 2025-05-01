
import { Product } from "@/types/product";
import { useChats } from "./useChats";
import { useMessages } from "./useMessages";
import { useSendMessage } from "./useSendMessage";
import { useToggleAI } from "./useToggleAI";
import { ChatApiHook } from "./types";

export function useChatApi(): ChatApiHook {
  const { 
    data: chats = [], 
    isLoading: isLoadingChats,
    error: chatsError,
    refetch: refetchChats
  } = useChats();

  const sendMessageMutation = useSendMessage();
  const toggleAIMutation = useToggleAI();

  // Wrapping useMessages in a function to be called with a chatId
  const getMessages = (chatId: string | null) => {
    const { 
      data = [], 
      isLoading, 
      error, 
      refetch 
    } = useMessages(chatId);

    return {
      data,
      isLoading,
      error,
      refetch
    };
  };

  return {
    chats,
    isLoadingChats,
    chatsError,
    refetchChats,
    getMessages,
    sendMessage: (chatId: string, content: string, product?: Product) => 
      sendMessageMutation.mutateAsync({ chatId, content, product }),
    toggleAI: (chatId: string, enabled: boolean) => 
      toggleAIMutation.mutateAsync({ chatId, enabled }),
  };
}
