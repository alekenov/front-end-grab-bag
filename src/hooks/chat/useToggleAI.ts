
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { ToggleAIParams } from "./types";
import { CHAT_API_URL, getAuthSession } from "./chatApiUtils";

export const useToggleAI = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ chatId, enabled }: ToggleAIParams) => {
      try {
        console.log('Toggle AI via API');
        
        // Get current session for API
        const { accessToken } = await getAuthSession();
        
        const response = await fetch(`${CHAT_API_URL}/toggle-ai`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ chatId, enabled })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Не удалось изменить настройки AI");
        }
        
        return { chatId, enabled };
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
