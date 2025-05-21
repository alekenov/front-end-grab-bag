
import { useQuery } from "@tanstack/react-query";
import { getMockOrdersByChatId } from "./utils/ordersMockUtils";

/**
 * Hook for fetching orders associated with a specific chat
 */
export const useGetOrdersByChatId = (chatId: string | null) => {
  return useQuery({
    queryKey: ['orders', 'chat', chatId],
    enabled: !!chatId,
    queryFn: async () => {
      try {
        if (!chatId) {
          console.log("Empty chat ID provided to getOrdersByChatId");
          return [];
        }
        
        console.log("Getting orders for chat ID:", chatId);
        const orders = getMockOrdersByChatId(chatId);
        console.log("Orders for chat found:", orders);
        return orders;
      } catch (error) {
        console.error("Error getting orders by chat ID:", error);
        return [];
      }
    },
    refetchOnWindowFocus: false,
  });
};
