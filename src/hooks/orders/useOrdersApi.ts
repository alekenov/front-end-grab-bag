
import { useGetOrders } from "./useGetOrders";
import { useGetOrderById } from "./useGetOrderById";
import { useGetOrdersByChatId } from "./useGetOrdersByChatId";
import { useOrderMutations } from "./useOrderMutations";
import { useOrderItemMutations } from "./useOrderItemMutations";
import { OrdersFilter } from "@/types/order";

/**
 * Main hook that combines all order-related functionality
 */
export const useOrdersApi = () => {
  // Order mutations
  const { createOrder, updateOrder, deleteOrder } = useOrderMutations();
  
  // Order item mutations
  const { addOrderItem, removeOrderItem } = useOrderItemMutations();

  return {
    // Getter functions - these return the actual query hooks
    getOrders: (filters?: OrdersFilter) => useGetOrders(filters),
    getOrderById: (orderId: string | null) => useGetOrderById(orderId),
    getOrdersByChatId: (chatId: string | null) => useGetOrdersByChatId(chatId),
    
    // Order mutations
    createOrder,
    updateOrder,
    deleteOrder,
    
    // Order item mutations
    addOrderItem,
    removeOrderItem
  };
};

export default useOrdersApi;
