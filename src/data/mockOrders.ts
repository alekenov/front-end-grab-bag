
import { Order, OrderItem, OrderStatus, PaymentStatus } from "@/types/order";

// Моковые элементы заказа
export const mockOrderItems: OrderItem[] = [
  {
    id: "item-1",
    order_id: "ord-123",
    product_id: 1,
    product_name: "Букет 'Весенний'",
    product_image: "https://picsum.photos/id/15/200/200",
    quantity: 1,
    price: 8900,
    created_at: new Date().toISOString()
  },
  {
    id: "item-2",
    order_id: "ord-123",
    product_id: 2,
    product_name: "Букет 'Лето'",
    product_image: "https://picsum.photos/id/16/200/200",
    quantity: 2,
    price: 7500,
    created_at: new Date().toISOString()
  },
  {
    id: "item-3",
    order_id: "ord-456",
    product_id: 3,
    product_name: "Букет 'Классический'",
    product_image: "https://picsum.photos/id/17/200/200",
    quantity: 1,
    price: 12000,
    created_at: new Date().toISOString()
  },
  {
    id: "item-4",
    order_id: "ord-789",
    product_id: 4,
    product_name: "Букет 'Нежность'",
    product_image: "https://picsum.photos/id/18/200/200",
    quantity: 1,
    price: 9500,
    created_at: new Date().toISOString()
  }
];

// Моковые заказы
export const mockOrders: Order[] = [
  {
    id: "ord-123",
    customer_id: "cus-1",
    customer_name: "Анна Иванова",
    customer_phone: "+7 (900) 123-45-67",
    chat_id: "chat-1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status: "new",
    total_amount: 23900,
    payment_status: "pending",
    delivery_address: "г. Москва, ул. Ленина, д. 10, кв. 25",
    delivery_date: new Date(Date.now() + 86400000).toISOString(), // завтра
    comment: "Позвонить за час до доставки",
    items: mockOrderItems.filter(item => item.order_id === "ord-123")
  },
  {
    id: "ord-456",
    customer_id: "cus-2",
    customer_name: "Петр Смирнов",
    customer_phone: "+7 (900) 987-65-43",
    chat_id: "chat-1",
    created_at: new Date(Date.now() - 172800000).toISOString(), // 2 дня назад
    updated_at: new Date(Date.now() - 86400000).toISOString(), // вчера
    status: "processing",
    total_amount: 12000,
    payment_status: "paid",
    delivery_address: "г. Москва, ул. Гагарина, д. 5, кв. 12",
    delivery_date: new Date(Date.now() + 172800000).toISOString(), // через 2 дня
    comment: null,
    items: mockOrderItems.filter(item => item.order_id === "ord-456")
  },
  {
    id: "ord-789",
    customer_id: "cus-3",
    customer_name: "Елена Кузнецова",
    customer_phone: "+7 (900) 555-44-33",
    chat_id: "chat-2",
    created_at: new Date(Date.now() - 432000000).toISOString(), // 5 дней назад
    updated_at: new Date(Date.now() - 259200000).toISOString(), // 3 дня назад
    status: "completed",
    total_amount: 9500,
    payment_status: "paid",
    delivery_address: "г. Москва, ул. Пушкина, д. 15, кв. 7",
    delivery_date: new Date(Date.now() - 259200000).toISOString(), // 3 дня назад
    comment: "Оставить у консьержа",
    items: mockOrderItems.filter(item => item.order_id === "ord-789")
  },
  {
    id: "ord-101",
    customer_id: "cus-4",
    customer_name: "Дмитрий Морозов",
    customer_phone: "+7 (900) 111-22-33",
    chat_id: "chat-3",
    created_at: new Date(Date.now() - 86400000).toISOString(), // вчера
    updated_at: new Date(Date.now() - 43200000).toISOString(), // 12 часов назад
    status: "cancelled",
    total_amount: 15000,
    payment_status: "cancelled",
    delivery_address: null,
    delivery_date: null,
    comment: "Клиент отменил заказ",
    items: []
  }
];

// Функция для получения заказов с фильтрацией
export const getFilteredMockOrders = (filters?: any) => {
  if (!filters) return mockOrders;
  
  return mockOrders.filter(order => {
    // Фильтр по статусу
    if (filters.status && order.status !== filters.status) {
      return false;
    }
    
    // Фильтр по дате от
    if (filters.dateFrom && new Date(order.created_at) < new Date(filters.dateFrom)) {
      return false;
    }
    
    // Фильтр по дате до
    if (filters.dateTo && new Date(order.created_at) > new Date(filters.dateTo)) {
      return false;
    }
    
    // Фильтр по поиску
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const hasMatch = 
        order.id.toLowerCase().includes(searchLower) ||
        (order.customer_name && order.customer_name.toLowerCase().includes(searchLower)) ||
        (order.customer_phone && order.customer_phone.toLowerCase().includes(searchLower));
      
      if (!hasMatch) return false;
    }
    
    // Фильтр по ID клиента
    if (filters.customer_id && order.customer_id !== filters.customer_id) {
      return false;
    }
    
    // Фильтр по ID чата
    if (filters.chat_id && order.chat_id !== filters.chat_id) {
      return false;
    }
    
    return true;
  });
};

// Функция для получения заказа по ID
export const getMockOrderById = (orderId: string) => {
  return mockOrders.find(order => order.id === orderId) || null;
};

// Функция для получения заказов по ID чата
export const getMockOrdersByChatId = (chatId: string) => {
  return mockOrders.filter(order => order.chat_id === chatId);
};
