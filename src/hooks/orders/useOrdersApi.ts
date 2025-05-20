
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/utils/apiClient";
import { useToast } from "@/hooks/use-toast";
import { Order, OrderItem, OrdersFilter } from "@/types/order";

export const useOrdersApi = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get all orders with optional filtering
  const getOrders = (filters?: OrdersFilter) => {
    return useQuery({
      queryKey: ['orders', filters],
      queryFn: async () => {
        const queryString = filters ? new URLSearchParams({
          ...(filters.status && { status: filters.status }),
          ...(filters.dateFrom && { dateFrom: filters.dateFrom.toISOString() }),
          ...(filters.dateTo && { dateTo: filters.dateTo.toISOString() }),
          ...(filters.search && { search: filters.search }),
          ...(filters.customer_id && { customer_id: filters.customer_id }),
          ...(filters.chat_id && { chat_id: filters.chat_id })
        }).toString() : '';
        
        const endpoint = `orders${queryString ? `?${queryString}` : ''}`;
        const response = await apiClient.get<{ orders: Order[] }>(endpoint);
        return response.orders || [];
      },
      meta: {
        onError: (error: Error) => {
          toast({
            variant: "destructive",
            title: "Ошибка загрузки заказов",
            description: error.message,
          });
        }
      }
    });
  };

  // Get a specific order by ID
  const getOrderById = (orderId: string | null) => {
    return useQuery({
      queryKey: ['order', orderId],
      enabled: !!orderId,
      queryFn: async () => {
        if (!orderId) return null;
        const response = await apiClient.get<{ order: Order & { items: OrderItem[] } }>(`orders/${orderId}`);
        return response.order || null;
      },
      meta: {
        onError: (error: Error) => {
          toast({
            variant: "destructive",
            title: "Ошибка загрузки заказа",
            description: error.message,
          });
        }
      }
    });
  };

  // Create a new order
  const createOrder = useMutation({
    mutationFn: async (orderData: Partial<Order>) => {
      const response = await apiClient.post<{ order: Order }>('orders', orderData);
      return response.order;
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
      const response = await apiClient.patch<{ order: Order }>(`orders/${id}`, data);
      return response.order;
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
      return await apiClient.delete(`orders/${orderId}`);
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

  // Add order items
  const addOrderItem = useMutation({
    mutationFn: async ({ orderId, item }: { orderId: string, item: Partial<OrderItem> }) => {
      const response = await apiClient.post<{ item: OrderItem }>(`orders/${orderId}/items`, item);
      return response.item;
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
      return await apiClient.delete(`orders/${orderId}/items/${itemId}`);
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
        const response = await apiClient.get<{ orders: Order[] }>(`orders/chat/${chatId}`);
        return response.orders || [];
      },
      meta: {
        onError: (error: Error) => {
          console.error("Ошибка загрузки заказов для чата:", error);
        }
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
