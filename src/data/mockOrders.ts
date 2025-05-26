
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
  },
  {
    id: "item-5",
    order_id: "ord-555",
    product_id: 5,
    product_name: "Букет 'Роскошь'",
    product_image: "https://picsum.photos/id/19/200/200",
    quantity: 1,
    price: 15000,
    created_at: new Date().toISOString()
  },
  {
    id: "item-6",
    order_id: "ord-666",
    product_id: 6,
    product_name: "Букет 'Минимализм'",
    product_image: "https://picsum.photos/id/20/200/200",
    quantity: 3,
    price: 5500,
    created_at: new Date().toISOString()
  },
  {
    id: "item-7",
    order_id: "ord-777",
    product_id: 7,
    product_name: "Букет 'Экзотика'",
    product_image: "https://picsum.photos/id/21/200/200",
    quantity: 1,
    price: 18000,
    created_at: new Date().toISOString()
  }
];

// Моковые заказы - добавим больше заказов для демонстрации
export const mockOrders: Order[] = [
  {
    id: "ord-123",
    customer_id: "cus-1",
    customer_name: "Анна Иванова",
    customer_phone: "+7 (900) 123-45-67",
    chat_id: "demo-1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status: "new",
    total_amount: 23900,
    payment_status: "pending",
    delivery_address: "г. Алматы, ул. Достык, д. 15, кв. 25",
    delivery_date: new Date(Date.now() + 86400000).toISOString(), // завтра
    comment: "Позвонить за час до доставки",
    items: mockOrderItems.filter(item => item.order_id === "ord-123"),
    responsible_manager: "Елена Петрова",
    estimated_delivery_time: "45 минут"
  },
  {
    id: "ord-456",
    customer_id: "cus-2",
    customer_name: "Петр Смирнов",
    customer_phone: "+7 (900) 987-65-43",
    chat_id: "demo-1",
    created_at: new Date(Date.now() - 172800000).toISOString(), // 2 дня назад
    updated_at: new Date(Date.now() - 86400000).toISOString(), // вчера
    status: "processing",
    total_amount: 12000,
    payment_status: "paid",
    delivery_address: "г. Алматы, ул. Абая, д. 5, кв. 12",
    delivery_date: new Date(Date.now() + 172800000).toISOString(), // через 2 дня
    comment: "Доставить вечером после 18:00",
    items: mockOrderItems.filter(item => item.order_id === "ord-456"),
    responsible_manager: "Алексей Смирнов",
    estimated_delivery_time: "60 минут"
  },
  {
    id: "ord-789",
    customer_id: "cus-3",
    customer_name: "Елена Кузнецова",
    customer_phone: "+7 (900) 555-44-33",
    chat_id: "demo-1",
    created_at: new Date(Date.now() - 432000000).toISOString(), // 5 дней назад
    updated_at: new Date(Date.now() - 259200000).toISOString(), // 3 дня назад
    status: "completed",
    total_amount: 9500,
    payment_status: "paid",
    delivery_address: "г. Алматы, ул. Сатпаева, д. 15, кв. 7",
    delivery_date: new Date(Date.now() - 259200000).toISOString(), // 3 дня назад
    comment: "Оставить у консьержа",
    items: mockOrderItems.filter(item => item.order_id === "ord-789"),
    responsible_manager: "Дмитрий Иванов"
  },
  {
    id: "ord-555",
    customer_id: "cus-1",
    customer_name: "Анна Иванова",
    customer_phone: "+7 (900) 123-45-67",
    chat_id: "demo-1",
    created_at: new Date(Date.now() - 604800000).toISOString(), // неделю назад
    updated_at: new Date(Date.now() - 604800000).toISOString(),
    status: "completed",
    total_amount: 15000,
    payment_status: "paid",
    delivery_address: "г. Алматы, ул. Достык, д. 15, кв. 25",
    delivery_date: new Date(Date.now() - 604800000).toISOString(),
    comment: "Юбилей свадьбы",
    items: mockOrderItems.filter(item => item.order_id === "ord-555"),
    responsible_manager: "Анна Козлова"
  },
  {
    id: "ord-666",
    customer_id: "cus-1",
    customer_name: "Анна Иванова",
    customer_phone: "+7 (900) 123-45-67",
    chat_id: "demo-1",
    created_at: new Date(Date.now() - 1209600000).toISOString(), // 2 недели назад
    updated_at: new Date(Date.now() - 1209600000).toISOString(),
    status: "completed",
    total_amount: 16500,
    payment_status: "paid",
    delivery_address: "г. Алматы, мкр. Самал-2, д. 78, кв. 45",
    delivery_date: new Date(Date.now() - 1209600000).toISOString(),
    comment: "День рождения мамы",
    items: mockOrderItems.filter(item => item.order_id === "ord-666"),
    responsible_manager: "Сергей Соколов"
  },
  {
    id: "ord-777",
    customer_id: "cus-1",
    customer_name: "Анна Иванова",
    customer_phone: "+7 (900) 123-45-67",
    chat_id: "demo-1",
    created_at: new Date(Date.now() - 1814400000).toISOString(), // 3 недели назад
    updated_at: new Date(Date.now() - 1814400000).toISOString(),
    status: "completed",
    total_amount: 18000,
    payment_status: "paid",
    delivery_address: "г. Алматы, ул. Розыбакиева, д. 289, офис 10",
    delivery_date: new Date(Date.now() - 1814400000).toISOString(),
    comment: "Корпоративный подарок",
    items: mockOrderItems.filter(item => item.order_id === "ord-777"),
    responsible_manager: "Елена Петрова"
  },
  {
    id: "ord-101",
    customer_id: "cus-4",
    customer_name: "Дмитрий Морозов",
    customer_phone: "+7 (900) 111-22-33",
    chat_id: "demo-2",
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
