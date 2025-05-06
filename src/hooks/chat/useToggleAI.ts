
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { ToggleAIParams } from "./types";
import { apiClient } from "@/utils/apiClient";

interface ToggleAIResponse {
  enabled: boolean;
  chatId: string;
}

/**
 * Хук для включения/выключения ИИ в чате
 */
export const useToggleAI = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ chatId, enabled }: ToggleAIParams): Promise<ToggleAIResponse> => {
      try {
        console.log('Toggle AI via API');
        
        // Используем унифицированный API-клиент
        const response = await apiClient.post<ToggleAIResponse>(
          `chat-api/toggle-ai`, 
          { chatId, enabled }, 
          { requiresAuth: true }
        );
        return response;
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
