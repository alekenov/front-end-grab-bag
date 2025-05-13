
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { SendMessageParams } from "./types";
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
        console.log('[useSendMessage] Sending message via API', { chatId, content, hasProduct: !!product });
        
        if (!content.trim()) {
          throw new Error("Сообщение не может быть пустым");
        }
        
        // Используем унифицированный API-клиент
        const response = await apiClient.post(
          `chat-api/send`, 
          { chatId, content, product }, 
          { requiresAuth: true }
        );
        
        console.log('[useSendMessage] API response:', response);
        return response;
      } catch (error) {
        console.error('[useSendMessage] Error sending message:', error);
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      console.log('[useSendMessage] Message sent successfully! Updating queries...');
      
      // Сразу инвалидируем кэш сообщений для текущего чата
      queryClient.invalidateQueries({ queryKey: ['messages-api', variables.chatId] });
      queryClient.invalidateQueries({ queryKey: ['messages', variables.chatId] });
      
      // Немедленно инвалидируем кэш списка чатов
      queryClient.invalidateQueries({ queryKey: ['chats-api'] });
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      
      // Принудительно запрашиваем данные заново с разной задержкой
      // для гарантии обновления после обработки на сервере
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ['messages-api', variables.chatId] });
        queryClient.refetchQueries({ queryKey: ['messages', variables.chatId] });
      }, 300);
      
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ['messages-api', variables.chatId] });
        queryClient.refetchQueries({ queryKey: ['messages', variables.chatId] });
      }, 1000);
      
      // Принудительно обновляем список чатов с задержкой
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ['chats-api'] });
        queryClient.refetchQueries({ queryKey: ['chats'] });
      }, 500);
      
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ['chats-api'] });
        queryClient.refetchQueries({ queryKey: ['chats'] });
      }, 1500);
      
      toast({
        title: "Сообщение отправлено",
        description: variables.product ? "Товар добавлен в чат" : "Сообщение добавлено в чат",
      });
    },
    onError: (error) => {
      console.error('[useSendMessage] Error sending message via API:', error);
      toast({
        title: "Ошибка отправки",
        description: "Не удалось отправить сообщение",
        variant: "destructive",
      });
    }
  });
};
