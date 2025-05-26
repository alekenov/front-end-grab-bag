
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { OrdersFilter, Order, OrderStatus } from "@/types/order";
import { useToast } from "@/hooks/use-toast";
import { 
  initializeDemoData, 
  isDemoModeEnabled, 
  getDemoOrders, 
  getDemoOrderById, 
  getDemoOrdersByChatId,
  saveDemoOrder,
  deleteDemoOrder
} from "@/utils/demoStorage";
import { generateOrderId } from "./utils/ordersMockUtils";

// Initialize demo data on module load
initializeDemoData();

/**
 * Main hook that provides all order-related functionality in demo mode
 */
export const useOrdersApi = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get orders with optional filters
  const getOrders = (filters?: OrdersFilter) => {
    return useQuery({
      queryKey: ['orders', filters],
      queryFn: async () => {
        console.log('[useOrdersApi] Getting orders with filters:', filters);
        
        if (isDemoModeEnabled()) {
          const orders = getDemoOrders(filters);
          console.log('[useOrdersApi] Demo orders returned:', orders.length);
          return orders;
        }
        
        // Fallback to empty array if not in demo mode
        return [];
      },
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: false,
      retry: false,
    });
  };

  // Get order by ID
  const getOrderById = (orderId: string | null) => {
    return useQuery({
      queryKey: ['order', orderId],
      enabled: !!orderId && orderId !== "",
      queryFn: async () => {
        console.log('[useOrdersApi] Getting order by ID:', orderId);
        
        if (!orderId || orderId === "") {
          return null;
        }
        
        if (isDemoModeEnabled()) {
          const order = getDemoOrderById(orderId);
          console.log('[useOrdersApi] Demo order found:', order);
          return order;
        }
        
        return null;
      },
      refetchOnWindowFocus: false,
      retry: 1,
    });
  };

  // Get orders by chat ID
  const getOrdersByChatId = (chatId: string | null) => {
    return useQuery({
      queryKey: ['orders', 'chat', chatId],
      enabled: !!chatId,
      queryFn: async () => {
        console.log('[useOrdersApi] Getting orders for chat ID:', chatId);
        
        if (!chatId) {
          return [];
        }
        
        if (isDemoModeEnabled()) {
          const orders = getDemoOrdersByChatId(chatId);
          console.log('[useOrdersApi] Demo orders for chat found:', orders.length);
          return orders;
        }
        
        return [];
      },
      refetchOnWindowFocus: false,
    });
  };

  // Create order mutation
  const createOrder = useMutation({
    mutationFn: async (orderData: Partial<Order>) => {
      console.log('[useOrdersApi] Creating order:', orderData);
      
      if (isDemoModeEnabled()) {
        const newOrder: Order = {
          id: generateOrderId(),
          customer_id: orderData.customer_id || null,
          customer_name: orderData.customer_name || "Новый клиент",
          customer_phone: orderData.customer_phone || null,
          chat_id: orderData.chat_id || null,
          status: orderData.status || "new",
          total_amount: orderData.total_amount || 0,
          payment_status: orderData.payment_status || "pending",
          delivery_address: orderData.delivery_address || null,
          delivery_date: orderData.delivery_date || null,
          comment: orderData.comment || null,
          items: orderData.items || [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        return saveDemoOrder(newOrder);
      }
      
      throw new Error('Demo mode not enabled');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: "Заказ создан",
        description: "Новый заказ успешно создан",
      });
    },
    onError: (error) => {
      console.error('[useOrdersApi] Error creating order:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось создать заказ",
        variant: "destructive",
      });
    }
  });

  // Update order mutation
  const updateOrder = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Order> }) => {
      console.log('[useOrdersApi] Updating order:', id, data);
      
      if (isDemoModeEnabled()) {
        const existingOrder = getDemoOrderById(id);
        if (!existingOrder) {
          throw new Error('Order not found');
        }
        
        const updatedOrder = { ...existingOrder, ...data };
        return saveDemoOrder(updatedOrder);
      }
      
      throw new Error('Demo mode not enabled');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: "Заказ обновлен",
        description: "Изменения сохранены",
      });
    },
    onError: (error) => {
      console.error('[useOrdersApi] Error updating order:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить заказ",
        variant: "destructive",
      });
    }
  });

  // Delete order mutation
  const deleteOrder = useMutation({
    mutationFn: async (orderId: string) => {
      console.log('[useOrdersApi] Deleting order:', orderId);
      
      if (isDemoModeEnabled()) {
        const success = deleteDemoOrder(orderId);
        if (!success) {
          throw new Error('Failed to delete order');
        }
        return orderId;
      }
      
      throw new Error('Demo mode not enabled');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: "Заказ удален",
        description: "Заказ успешно удален",
      });
    },
    onError: (error) => {
      console.error('[useOrdersApi] Error deleting order:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить заказ",
        variant: "destructive",
      });
    }
  });

  // Order item mutations (simplified for demo)
  const addOrderItem = useMutation({
    mutationFn: async (itemData: any) => {
      console.log('[useOrdersApi] Adding order item:', itemData);
      // Implementation would go here for demo mode
      return itemData;
    }
  });

  const removeOrderItem = useMutation({
    mutationFn: async (itemId: string) => {
      console.log('[useOrdersApi] Removing order item:', itemId);
      // Implementation would go here for demo mode
      return itemId;
    }
  });

  return {
    // Getter functions
    getOrders,
    getOrderById,
    getOrdersByChatId,
    
    // Mutations
    createOrder,
    updateOrder,
    deleteOrder,
    
    // Order item mutations
    addOrderItem,
    removeOrderItem
  };
};

export default useOrdersApi;
