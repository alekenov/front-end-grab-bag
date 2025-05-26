
import { Product } from "@/types/product";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

interface UseProductActionsProps {
  product: Product;
  inChatMode: boolean;
}

export function useProductActions({ product, inChatMode }: UseProductActionsProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleAddToChat = () => {
    // Сохраняем выбранный товар в localStorage
    try {
      localStorage.setItem("selected_product", JSON.stringify(product));
      console.log("[useProductActions] Product saved to localStorage:", product);
      
      toast({
        title: "Товар добавлен",
        description: `${product.name || `Товар за ${product.price.toLocaleString()} ₸`} добавлен в чат`,
      });
      
      // Максимально агрессивное обновление кэша списка чатов
      queryClient.invalidateQueries({ queryKey: ['chats-api'] });
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ['chats-api'] });
        queryClient.refetchQueries({ queryKey: ['chats'] });
      }, 300);
      
      // Возвращаемся на страницу чата, если находимся в режиме выбора товара
      if (inChatMode) {
        // Получаем ID сохраненного чата
        const currentChatId = localStorage.getItem("current_chat_id");
        console.log("[useProductActions] Retrieved currentChatId for navigation:", currentChatId);
        
        // Переходим на главную страницу с указанием ID чата в URL
        if (currentChatId) {
          // Удаляем ID из localStorage
          localStorage.removeItem("current_chat_id");
          // Переходим к конкретному чату на главной странице
          setTimeout(() => {
            navigate(`/?chatId=${currentChatId}`);
          }, 100);
        } else {
          // Если по какой-то причине ID чата не был сохранен
          setTimeout(() => {
            navigate("/");
          }, 100);
        }
      }
    } catch (error) {
      console.error("[useProductActions] Error saving product:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить товар в чат",
        variant: "destructive",
      });
    }
  };

  return {
    handleAddToChat
  };
}
