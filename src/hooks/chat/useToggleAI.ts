
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { ToggleAIParams } from "./types";
import { apiClient } from "@/utils/apiClient";

/**
 * Хук для включения/выключения ИИ в чате
 */
export const useToggleAI = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ chatId, enabled }: ToggleAIParams) => {
      try {
        console.log('Toggle AI via API');
        
        // Используем унифицированный API-клиент
        return await apiClient.post(
          `chat-api/toggle-ai`, 
          { chatId, enabled },
          { requiresAuth: true }
        );
      } catch (error) {
        console.error('Error toggling AI:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['chats-api'] });
      toast({
        title: `AI ${data.enabled ? 'включен' : 'выключен'}`,
        description: `AI был ${data.enabled ? 'включен' : 'выключен'} для выбранного чата`,
      });
    },
    onError: (error) => {
      console.error('Error toggling AI:', error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось изменить настройки AI",
      });
    }
  });
};
