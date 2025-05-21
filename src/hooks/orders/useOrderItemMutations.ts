
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { OrderItem } from "@/types/order";
import { mockOrders, generateOrderItemId, calculateOrderTotal } from "./utils/ordersMockUtils";

/**
 * Hook for order item operations (adding/removing items)
 */
export const useOrderItemMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Add order item
  const addOrderItem = useMutation({
    mutationFn: async ({ orderId, item }: { orderId: string, item: Partial<OrderItem> }) => {
      // Find order in mock data
      const order = mockOrders.find(o => o.id === orderId);
      if (!order) {
        throw new Error("Заказ не найден");
      }
      
      // Create new order item
      const newItem: OrderItem = {
        id: generateOrderItemId(),
        order_id: orderId,
        product_id: item.product_id || 0,
        product_name: item.product_name,
        product_image: item.product_image,
        quantity: item.quantity || 1,
        price: item.price || 0,
        created_at: new Date().toISOString()
      };
      
      // Initialize items array if it doesn't exist
      if (!order.items) {
        order.items = [];
      }
      
      // Add item to order
      order.items.push(newItem);
      
      // Update order total amount
      order.total_amount = calculateOrderTotal(order.items);
      
      return newItem;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] });
      toast({
        title: "Товар добавлен",
        description: "Товар успешно добавлен в заказ"
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Ошибка добавления товара",
        description: error.message,
      });
    }
  });

  // Remove order item
  const removeOrderItem = useMutation({
    mutationFn: async ({ orderId, itemId }: { orderId: string, itemId: string }) => {
      // Find order in mock data
      const order = mockOrders.find(o => o.id === orderId);
      if (!order || !order.items) {
        throw new Error("Заказ или элементы заказа не найдены");
      }
      
      // Find item index
      const itemIndex = order.items.findIndex(item => item.id === itemId);
      if (itemIndex === -1) {
        throw new Error("Элемент заказа не найден");
      }
      
      // Remove item from order
      order.items.splice(itemIndex, 1);
      
      // Update order total amount
      order.total_amount = calculateOrderTotal(order.items);
      
      return { success: true };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] });
      toast({
        title: "Товар удален",
        description: "Товар успешно удален из заказа"
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Ошибка удаления товара",
        description: error.message,
      });
    }
  });

  return {
    addOrderItem,
    removeOrderItem
  };
};
