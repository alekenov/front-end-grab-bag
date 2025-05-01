
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { SendMessageParams } from "./types";
import { CHAT_API_URL, getAuthSession } from "./chatApiUtils";

export const useSendMessage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ chatId, content, product }: SendMessageParams) => {
      try {
        console.log('Sending message via API');
        
        // Get current session for API
        const { accessToken } = await getAuthSession();
        
        // Direct call to Supabase Edge Function
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
