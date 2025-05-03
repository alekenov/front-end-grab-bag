
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Message, SupabaseMessage } from "@/types/chat";
import { Product } from "@/types/product";
import { supabase } from "@/integrations/supabase/client";

export function useChatMessages(currentChatId: string | null, chatAiEnabled: boolean = false) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch messages
  const { 
    data: messages = [],
    isLoading: messagesLoading,
    refetch: refetchMessages,
    error: messagesError
  } = useQuery({
    queryKey: ['messages', currentChatId],
    queryFn: async () => {
      if (!currentChatId) return [];
      
      try {
        console.log('Fetching messages for chat ID:', currentChatId);
        
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('chat_id', currentChatId)
          .order('created_at', { ascending: true });
          
        if (error) {
          console.error('Error fetching messages:', error);
          throw error;
        }
        
        console.log('Received messages:', data?.length || 0);
        
        // Convert Supabase data to our app format
        return data.map((msg: SupabaseMessage) => {
          const message: Message = {
            id: msg.id,
            content: msg.content || "",
            timestamp: msg.created_at || new Date().toISOString(),
            role: msg.is_from_user ? "USER" : "BOT"
          };
          
          // Add product info if available
          if (msg.has_product && msg.product_data) {
            try {
              const productData = typeof msg.product_data === 'string' 
                ? JSON.parse(msg.product_data) 
                : msg.product_data;
                
              message.product = {
                id: String(productData.id || ""),
                imageUrl: String(productData.imageUrl || ""),
                price: Number(productData.price) || 0
              };
            } catch (e) {
              console.error('Error parsing product data:', e);
            }
          }
          
          return message;
        });
      } catch (error) {
        console.error('Error in messages query:', error);
        return [];
      }
    },
    enabled: !!currentChatId
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ 
      content, 
      product, 
      chatId 
    }: { 
      content: string; 
      product?: Product; 
      chatId: string;
    }) => {
      const messageData = {
        chat_id: chatId,
        content,
        is_from_user: true,
        has_product: !!product,
        product_data: product ? {
          id: product.id,
          imageUrl: product.imageUrl, 
          price: product.price
        } : null
      };
      
      const { data, error } = await supabase
        .from('messages')
        .insert([messageData])
        .select();
        
      if (error) throw error;
      
      // После отправки сообщения обновляем список чатов
      queryClient.invalidateQueries({ queryKey: ['chats-api'] });
      // Принудительно обновляем список чатов
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ['chats-api'] });
      }, 300);
      
      // Demo AI response after delay
      if (chatAiEnabled) {
        setTimeout(async () => {
          const aiResponse = product
            ? `Спасибо за интерес к букету за ${product.price} ₸! Как вам помочь с выбором?`
            : `Спасибо за ваше сообщение! Чем я могу вам помочь?`;
            
          await supabase
            .from('messages')
            .insert([{
              chat_id: chatId,
              content: aiResponse,
              is_from_user: false
            }]);
            
          refetchMessages();
          // Обновляем список чатов после ответа бота
          queryClient.invalidateQueries({ queryKey: ['chats-api'] });
          queryClient.refetchQueries({ queryKey: ['chats-api'] });
        }, 1000);
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', currentChatId] });
    },
    onError: (error) => {
      console.error('Error sending message:', error);
      toast({
        title: "Ошибка отправки",
        description: "Не удалось отправить сообщение",
        variant: "destructive",
      });
    }
  });

  // Send message helper
  const sendMessage = async (content: string, product?: Product) => {
    if (!currentChatId) return;
    
    try {
      await sendMessageMutation.mutateAsync({ 
        content, 
        product, 
        chatId: currentChatId 
      });
      
      toast({
        title: "Сообщение отправлено",
        description: product ? "Товар добавлен в чат" : "Сообщение добавлено в чат",
      });
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error);
    }
  };

  return {
    messages,
    messagesLoading,
    messagesError,
    sendMessage
  };
}
