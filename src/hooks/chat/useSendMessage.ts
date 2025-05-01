
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SendMessageParams } from "./types";
import { CHAT_API_URL, getAuthSession } from "./chatApiUtils";

export const useSendMessage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ chatId, content, product }: SendMessageParams) => {
      try {
        // Try sending via Supabase first
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
        
        const { data: supabaseData, error: supabaseError } = await supabase
          .from('messages')
          .insert([messageData])
          .select();
          
        if (!supabaseError) {
          const { data: chats } = await supabase
            .from('chats')
            .select('ai_enabled')
            .eq('id', chatId)
            .single();
            
          if (chats?.ai_enabled) {
            // Add automatic AI response
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
                
              queryClient.invalidateQueries({ queryKey: ['messages-api', chatId] });
            }, 1000);
          }
          
          return supabaseData;
        }
        
        // Fallback to Edge Function API if Supabase insert fails
        console.log('Trying to send message via Edge Function API');
        
        // Get current session for Edge Function
        const { accessToken } = await getAuthSession();
        
        const response = await fetch(`${CHAT_API_URL}/send`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ chatId, content, product })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Не удалось отправить сообщение");
        }
        
        return response.json();
      } catch (error) {
        console.error('Error sending message:', error);
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages-api', variables.chatId] });
      queryClient.invalidateQueries({ queryKey: ['chats-api'] });
      
      toast({
        title: "Сообщение отправлено",
        description: variables.product ? "Товар добавлен в чат" : "Сообщение добавлено в чат",
      });
    },
    onError: (error) => {
      console.error('Error sending message via API:', error);
      toast({
        title: "Ошибка отправки",
        description: "Не удалось отправить сообщение",
        variant: "destructive",
      });
    }
  });
};
