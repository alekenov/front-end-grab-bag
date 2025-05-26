
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Chat, Message } from "@/types/chat";
import { 
  initializeDemoData, 
  isDemoModeEnabled, 
  getDemoChats, 
  getDemoMessages, 
  saveDemoMessage 
} from "@/utils/demoStorage";

// Initialize demo data on module load
initializeDemoData();

export function useChatApi() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get chats
  const { data, isPending: isLoadingChats, error: chatsError, refetch: refetchChats } = useQuery({
    queryKey: ['chats-api'],
    queryFn: async () => {
      console.log('[useChatApi] Getting chats');
      
      if (isDemoModeEnabled()) {
        const chats = getDemoChats();
        console.log('[useChatApi] Demo chats returned:', chats.length);
        return { chats };
      }
      
      return { chats: [] };
    },
    refetchOnWindowFocus: false,
    refetchInterval: false, // Disable auto-refresh in demo mode
    retry: false
  });

  const chats = data?.chats || [];

  // Send message mutation
  const { mutateAsync: sendMessageMutation, isPending: isSendingMessage } = useMutation({
    mutationFn: async ({ chatId, content, product }: { chatId: string; content: string; product?: any }) => {
      console.log('[useChatApi] Sending message to chat:', chatId, content);
      
      if (isDemoModeEnabled()) {
        // Skip demo chat messages
        if (chatId.startsWith('demo-')) {
          console.log('[useChatApi] Skipping demo chat message save');
          return null;
        }
        
        const message: Message = {
          id: `msg-${Date.now()}-${Math.random()}`,
          content,
          role: "USER",
          timestamp: new Date().toISOString(),
          product: product ? {
            id: product.id,
            imageUrl: product.imageUrl,
            price: product.price
          } : undefined
        };
        
        return saveDemoMessage(chatId, message);
      }
      
      return null;
    },
    onError: (error) => {
      console.error('[useChatApi] Error sending message:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось отправить сообщение",
        variant: "destructive",
      });
    }
  });

  // Toggle AI mutation
  const { mutateAsync: toggleAIMutation, isPending: isTogglingAI } = useMutation({
    mutationFn: async ({ chatId, enabled }: { chatId: string; enabled: boolean }) => {
      console.log('[useChatApi] Toggle AI for chat:', chatId, enabled);
      
      if (isDemoModeEnabled()) {
        // In demo mode, just show a toast
        toast({
          title: `AI ${enabled ? 'включен' : 'выключен'}`,
          description: `AI был ${enabled ? 'включен' : 'выключен'} для демо-чата`,
        });
        return null;
      }
      
      return null;
    }
  });

  // Function to send message
  const sendMessage = async (chatId: string, content: string, product?: any) => {
    if (chatId.startsWith('demo-')) {
      console.log('[useChatApi] Skipping API call for demo chat:', chatId);
      toast({
        title: "Демо-режим",
        description: "В демо-режиме сообщения не сохраняются",
      });
      return null;
    }
    
    return await sendMessageMutation({ chatId, content, product });
  };

  // Function to toggle AI
  const toggleAI = async (chatId: string, enabled: boolean) => {
    if (chatId.startsWith('demo-')) {
      console.log('[useChatApi] Skipping API call for demo chat:', chatId);
      return null;
    }
    
    return await toggleAIMutation({ chatId, enabled });
  };

  // Function to get messages
  const getMessages = (chatId: string | null) => {
    return useQuery({
      queryKey: ['messages-api', chatId],
      enabled: !!chatId,
      queryFn: async () => {
        console.log('[useChatApi] Getting messages for chat:', chatId);
        
        if (!chatId) return [];
        
        if (isDemoModeEnabled()) {
          const messages = getDemoMessages(chatId);
          console.log('[useChatApi] Demo messages returned:', messages.length);
          return messages;
        }
        
        return [];
      },
      refetchOnWindowFocus: false,
      refetchInterval: false, // Disable auto-refresh in demo mode
      retry: false
    });
  };

  return {
    chats,
    isLoadingChats,
    chatsError,
    sendMessage,
    isSendingMessage,
    toggleAI,
    isTogglingAI,
    getMessages,
    refetchChats
  };
}
