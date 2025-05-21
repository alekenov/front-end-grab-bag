
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Order, OrderItem } from "@/types/order";
import { 
  mockOrders,
  addOrUpdateMockOrder,
  removeMockOrder,
  generateOrderId,
  generateOrderItemId,
  calculateOrderTotal
} from "./utils/ordersMockUtils";

/**
 * Hook for order creation, update, and deletion operations
 */
export const useOrderMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Create a new order
  const createOrder = useMutation({
    mutationFn: async (orderData: Partial<Order>) => {
      console.log("Creating new order with data:", orderData);
      
      // Create new order object
      const newOrder: Order = {
        id: generateOrderId(),
        customer_id: orderData.customer_id || null,
        customer_name: orderData.customer_name,
        customer_phone: orderData.customer_phone,
        chat_id: orderData.chat_id || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: orderData.status || 'new',
        total_amount: orderData.total_amount || 0,
        payment_status: orderData.payment_status || 'pending',
        delivery_address: orderData.delivery_address || null,
        delivery_date: orderData.delivery_date || null,
        comment: orderData.comment || null,
        items: []
      };
      
      // Add order to mock data
      mockOrders.push(newOrder);
      console.log("New order created:", newOrder);
      
      return newOrder;
    },
    onSuccess: (data) => {
      console.log("Order created successfully:", data);
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: "Заказ создан",
        description: "Новый заказ успешно создан"
      });
    },
    onError: (error: Error) => {
      console.error("Error creating order:", error);
      toast({
        variant: "destructive",
        title: "Ошибка создания заказа",
        description: error.message,
      });
    }
  });

  // Update an existing order
  const updateOrder = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: Partial<Order> }) => {
      console.log("Updating order:", id, "with data:", data);
      
      // Find order in mock data
      const orderIndex = mockOrders.findIndex(order => order.id === id);
      if (orderIndex === -1) {
        console.error("Order not found for update:", id);
        throw new Error("Заказ не найден");
      }
      
      // Update order
      const updatedOrder = {
        ...mockOrders[orderIndex],
        ...data,
        updated_at: new Date().toISOString()
      };
      
      mockOrders[orderIndex] = updatedOrder;
      console.log("Order updated:", updatedOrder);
      
      return updatedOrder;
    },
    onSuccess: (data, variables) => {
      console.log("Order updated successfully:", data);
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', variables.id] });
      toast({
        title: "Заказ обновлен",
        description: "Информация о заказе успешно обновлена"
      });
    },
    onError: (error: Error) => {
      console.error("Error updating order:", error);
      toast({
        variant: "destructive",
        title: "Ошибка обновления заказа",
        description: error.message,
      });
    }
  });

  // Delete an order
  const deleteOrder = useMutation({
    mutationFn: async (orderId: string) => {
      console.log("Deleting order:", orderId);
      
      const success = removeMockOrder(orderId);
      if (!success) {
        throw new Error("Заказ не найден");
      }
      
      console.log("Order deleted successfully");
      return { success: true };
    },
    onSuccess: (_, variables) => {
      console.log("Order deleted successfully:", variables);
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: "Заказ удален",
        description: "Заказ успешно удален из системы"
      });
    },
    onError: (error: Error) => {
      console.error("Error deleting order:", error);
      toast({
        variant: "destructive",
        title: "Ошибка удаления заказа",
        description: error.message,
      });
    }
  });

  return {
    createOrder,
    updateOrder,
    deleteOrder
  };
};
