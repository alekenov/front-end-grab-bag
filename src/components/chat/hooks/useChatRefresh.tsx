
import { useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useChatApi } from "@/hooks/chat";
import { useToast } from "@/hooks/use-toast";

export function useChatRefresh(normalizedChatId: string | null, isDemoChat: boolean) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const chatApi = useChatApi();

  // Принудительное обновление данных
  const forceRefresh = useCallback(() => {
    if (!normalizedChatId) return;
    
    console.log("[useChatRefresh] Force refreshing data for chat:", normalizedChatId);
    
    // Инвалидируем запросы в кеше
    queryClient.invalidateQueries({ queryKey: ['messages-api', normalizedChatId] });
    queryClient.invalidateQueries({ queryKey: ['chat', normalizedChatId] });
    queryClient.invalidateQueries({ queryKey: ['chats-api'] });
    queryClient.invalidateQueries({ queryKey: ['orders', 'chat', normalizedChatId] });
    
    // Принудительно запрашиваем данные
    setTimeout(() => {
      const { refetch: refetchMessages } = chatApi.getMessages(normalizedChatId);
      refetchMessages();
      chatApi.refetchChats();
    }, 100);
  }, [normalizedChatId, queryClient, chatApi]);

  // Проверка товара в localStorage и инициализация
  useEffect(() => {
    if (!normalizedChatId) return;
    
    console.log("[useChatRefresh] Setting up chat refresh for:", normalizedChatId);
    
    // Обновляем данные при монтировании
    forceRefresh();
    
    // Проверяем наличие товара в localStorage
    const checkForProduct = () => {
      const selectedProductJson = localStorage.getItem("selected_product");
      if (selectedProductJson && normalizedChatId) {
        try {
          const product = JSON.parse(selectedProductJson);
          console.log("[useChatRefresh] Found product in localStorage:", product);
          
          // Не отправляем товар в демо-чат
          if (normalizedChatId.startsWith('demo-')) {
            console.log("[useChatRefresh] Skipping product send for demo chat");
            localStorage.removeItem("selected_product");
            return;
          }
          
          // Отправляем товар в чат
          chatApi.sendMessage(
            normalizedChatId, 
            `Букет за ${product.price.toLocaleString()} ₸`, 
            product
          ).then(() => {
            toast({
              title: "Товар добавлен",
              description: `Букет за ${product.price.toLocaleString()} ₸ добавлен в чат`,
            });
            
            // Удаляем товар из localStorage
            localStorage.removeItem("selected_product");
            
            // Обновляем UI
            forceRefresh();
          }).catch(err => {
            console.error("[useChatRefresh] Error sending product message:", err);
          });
        } catch (error) {
          console.error("[useChatRefresh] Error processing selected product:", error);
        }
      }
    };
    
    // Проверяем при монтировании
    checkForProduct();
    
    // Настраиваем интервал обновления
    const intervalId = setInterval(() => {
      console.log("[useChatRefresh] Checking for updates");
      if (!normalizedChatId.startsWith('demo-')) {
        const { refetch: refetchMessages } = chatApi.getMessages(normalizedChatId);
        refetchMessages();
        chatApi.refetchChats();
      }
    }, 5000);
    
    // Очистка при размонтировании
    return () => {
      clearInterval(intervalId);
      console.log("[useChatRefresh] Cleaning up for chat:", normalizedChatId);
    };
  }, [normalizedChatId, chatApi, toast, forceRefresh]);

  return { forceRefresh };
}
