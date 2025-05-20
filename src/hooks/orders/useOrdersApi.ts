import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Order, OrderItem, OrdersFilter } from "@/types/order";
import { 
  mockOrders, 
  getFilteredMockOrders, 
  getMockOrderById, 
  getMockOrdersByChatId 
} from "@/data/mockOrders";

export const useOrdersApi = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get all orders with optional filtering
  const getOrders = (filters?: OrdersFilter) => {
    return useQuery({
      queryKey: ['orders', filters],
      queryFn: async () => {
        // Используем моковые данные вместо API
        console.log("Getting filtered orders with filters:", filters);
        return getFilteredMockOrders(filters);
      }
    });
  };

  // Get a specific order by ID
  const getOrderById = (orderId: string | null) => {
    return useQuery({
      queryKey: ['order', orderId],
      enabled: !!orderId && orderId !== "",
      queryFn: async () => {
        if (!orderId || orderId === "") return null;
        
        // Используем моковые данные вместо API
        console.log("Fetching order with ID:", orderId);
        const order = getMockOrderById(orderId);
        console.log("Order found:", order);
        return order;
      }
    });
  };

  // Create a new order
  const createOrder = useMutation({
    mutationFn: async (orderData: Partial<Order>) => {
      // Имитация создания заказа
      const newOrder: Order = {
        id: `ord-${Math.floor(Math.random() * 10000)}`,
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
      
      // Добавляем новый заказ в моковый массив
      mockOrders.push(newOrder);
      
      return newOrder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: "Заказ создан",
        description: "Новый заказ успешно создан"
      });
    },
    onError: (error: Error) => {
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
      // Находим заказ в моковых данных
      const orderIndex = mockOrders.findIndex(order => order.id === id);
      if (orderIndex === -1) {
        throw new Error("Заказ не найден");
      }
      
      // Обновляем заказ
      const updatedOrder = {
        ...mockOrders[orderIndex],
        ...data,
        updated_at: new Date().toISOString()
      };
      
      mockOrders[orderIndex] = updatedOrder;
      return updatedOrder;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', variables.id] });
      toast({
        title: "Заказ обновлен",
        description: "Информация о заказе успешно обновлена"
      });
    },
    onError: (error: Error) => {
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
      // Находим индекс заказа в моковых данных
      const orderIndex = mockOrders.findIndex(order => order.id === orderId);
      if (orderIndex === -1) {
        throw new Error("Заказ не найден");
      }
      
      // Удаляем заказ из массива
      mockOrders.splice(orderIndex, 1);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: "Заказ удален",
        description: "Заказ успешно удален из системы"
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Ошибка удаления заказа",
        description: error.message,
      });
    }
  });

  // Add order item
  const addOrderItem = useMutation({
    mutationFn: async ({ orderId, item }: { orderId: string, item: Partial<OrderItem> }) => {
      // Находим заказ в моковых данных
      const order = mockOrders.find(o => o.id === orderId);
      if (!order) {
        throw new Error("Заказ не найден");
      }
      
      // Создаем новый элемент заказа
      const newItem: OrderItem = {
        id: `item-${Math.floor(Math.random() * 10000)}`,
        order_id: orderId,
        product_id: item.product_id || 0,
        product_name: item.product_name,
        product_image: item.product_image,
        quantity: item.quantity || 1,
        price: item.price || 0,
        created_at: new Date().toISOString()
      };
      
      // Если у заказа нет массива items, создаем его
      if (!order.items) {
        order.items = [];
      }
      
      // Добавляем элемент к заказу
      order.items.push(newItem);
      
      // Обновляем общую сумму заказа
      order.total_amount = (order.items || []).reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
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
      // Находим заказ в моковых данных
      const order = mockOrders.find(o => o.id === orderId);
      if (!order || !order.items) {
        throw new Error("Заказ или элементы заказа не найдены");
      }
      
      // Находим индекс элемента для удаления
      const itemIndex = order.items.findIndex(item => item.id === itemId);
      if (itemIndex === -1) {
        throw new Error("Элемент заказа не найден");
      }
      
      // Удаляем элемент из заказа
      order.items.splice(itemIndex, 1);
      
      // Обновляем общую сумму заказа
      order.total_amount = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
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

  // Get orders by chat ID
  const getOrdersByChatId = (chatId: string | null) => {
    return useQuery({
      queryKey: ['orders', 'chat', chatId],
      enabled: !!chatId,
      queryFn: async () => {
        if (!chatId) return [];
        // Используем моковые данные вместо API
        return getMockOrdersByChatId(chatId);
      }
    });
  };

  return {
    getOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
    addOrderItem,
    removeOrderItem,
    getOrdersByChatId
  };
};

export default useOrdersApi;
