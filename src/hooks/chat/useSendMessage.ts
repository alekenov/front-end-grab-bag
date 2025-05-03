
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { SendMessageParams } from "./types";
import { CHAT_API_URL } from "./chatApiUtils";
import { apiClient } from "@/utils/apiClient";

/**
 * Хук для отправки сообщений в чат через API
 */
export const useSendMessage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ chatId, content, product }: SendMessageParams) => {
      try {
        console.log('Sending message via API');
        
        // Используем унифицированный API-клиент
        return await apiClient.post(
          `chat-api/send`, 
          { chatId, content, product },
          { requiresAuth: true }
        );
      } catch (error) {
        console.error('Error sending message:', error);
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      console.log('Message sent successfully! Updating queries...');
      
      // Обновляем кэш сообщений для текущего чата
      queryClient.invalidateQueries({ queryKey: ['messages-api', variables.chatId] });
      
      // Максимально агрессивное обновление списка чатов
      queryClient.invalidateQueries({ queryKey: ['chats-api'] });
      
      // Принудительно обновляем список всех чатов
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ['chats-api'] });
      }, 500);
      
      setTimeout(() => {
        // Повторное обновление через дополнительную задержку
        queryClient.refetchQueries({ queryKey: ['chats-api'] });
      }, 1500);
      
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
