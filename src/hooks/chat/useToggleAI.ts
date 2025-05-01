
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ToggleAIParams } from "./types";

export const useToggleAI = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ chatId, enabled }: ToggleAIParams) => {
      try {
        // Use Supabase client directly
        const { error } = await supabase
          .from('chats')
          .update({ ai_enabled: enabled })
          .eq('id', chatId);
          
        if (error) throw error;
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
