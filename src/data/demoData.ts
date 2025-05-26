
import { Order, OrderItem, OrderStatus, PaymentStatus } from "@/types/order";
import { Product } from "@/types/product";
import { Chat, Message } from "@/types/chat";

// Expanded demo products
export const DEMO_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Букет 'Весенний'",
    price: 8900,
    imageUrl: "https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=300&h=300&fit=crop",
    category: "Букеты",
    description: "Нежный весенний букет из тюльпанов и нарциссов",
    availability: true,
    quantity: 15,
    createdAt: new Date().toISOString()
  },
  {
    id: "2",
    name: "Букет 'Летний'",
    price: 7500,
    imageUrl: "https://images.unsplash.com/photo-1563241527-3004b7be0fbb?w=300&h=300&fit=crop",
    category: "Букеты",
    description: "Яркий летний букет из подсолнухов и ромашек",
    availability: true,
    quantity: 8,
    createdAt: new Date().toISOString()
  },
  {
    id: "3",
    name: "Букет 'Классический'",
    price: 12000,
    imageUrl: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=300&h=300&fit=crop",
    category: "Букеты",
    description: "Элегантный букет из красных роз",
    availability: true,
    quantity: 20,
    createdAt: new Date().toISOString()
  },
  {
    id: "4",
    name: "Букет 'Нежность'",
    price: 9500,
    imageUrl: "https://images.unsplash.com/photo-1502307200623-ee0122ab7a2e?w=300&h=300&fit=crop",
    category: "Букеты",
    description: "Нежный букет из белых лилий и эустомы",
    availability: true,
    quantity: 12,
    createdAt: new Date().toISOString()
  },
  {
    id: "5",
    name: "Букет 'Осенний'",
    price: 6800,
    imageUrl: "https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?w=300&h=300&fit=crop",
    category: "Букеты",
    description: "Теплый осенний букет из хризантем",
    availability: true,
    quantity: 10,
    createdAt: new Date().toISOString()
  },
  {
    id: "6",
    name: "Композиция 'Радость'",
    price: 15000,
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop",
    category: "Композиции",
    description: "Праздничная композиция в корзине",
    availability: true,
    quantity: 5,
    createdAt: new Date().toISOString()
  }
];

// Expanded demo order items
export const DEMO_ORDER_ITEMS: OrderItem[] = [
  {
    id: "item-1",
    order_id: "ord-123",
    product_id: 1,
    product_name: "Букет 'Весенний'",
    product_image: "https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=300&h=300&fit=crop",
    quantity: 1,
    price: 8900,
    created_at: new Date().toISOString()
  },
  {
    id: "item-2",
    order_id: "ord-123",
    product_id: 2,
    product_name: "Букет 'Летний'",
    product_image: "https://images.unsplash.com/photo-1563241527-3004b7be0fbb?w=300&h=300&fit=crop",
    quantity: 2,
    price: 7500,
    created_at: new Date().toISOString()
  },
  {
    id: "item-3",
    order_id: "ord-456",
    product_id: 3,
    product_name: "Букет 'Классический'",
    product_image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=300&h=300&fit=crop",
    quantity: 1,
    price: 12000,
    created_at: new Date().toISOString()
  },
  {
    id: "item-4",
    order_id: "ord-789",
    product_id: 4,
    product_name: "Букет 'Нежность'",
    product_image: "https://images.unsplash.com/photo-1502307200623-ee0122ab7a2e?w=300&h=300&fit=crop",
    quantity: 1,
    price: 9500,
    created_at: new Date().toISOString()
  },
  {
    id: "item-5",
    order_id: "ord-101",
    product_id: 5,
    product_name: "Букет 'Осенний'",
    product_image: "https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?w=300&h=300&fit=crop",
    quantity: 3,
    price: 6800,
    created_at: new Date().toISOString()
  }
];

// Expanded demo orders with more realistic data
export const DEMO_ORDERS: Order[] = [
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
    delivery_address: "г. Москва, ул. Ленина, д. 10, кв. 25",
    delivery_date: new Date(Date.now() + 86400000).toISOString(),
    comment: "Позвонить за час до доставки",
    responsible_manager: "Алексей Смирнов",
    estimated_delivery_time: "45 минут",
    items: DEMO_ORDER_ITEMS.filter(item => item.order_id === "ord-123")
  },
  {
    id: "ord-456",
    customer_id: "cus-2",
    customer_name: "Петр Смирнов",
    customer_phone: "+7 (900) 987-65-43",
    chat_id: "demo-2",
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    status: "processing",
    total_amount: 12000,
    payment_status: "paid",
    delivery_address: "г. Москва, ул. Гагарина, д. 5, кв. 12",
    delivery_date: new Date(Date.now() + 172800000).toISOString(),
    comment: null,
    responsible_manager: "Елена Петрова",
    estimated_delivery_time: "30 минут",
    items: DEMO_ORDER_ITEMS.filter(item => item.order_id === "ord-456")
  },
  {
    id: "ord-789",
    customer_id: "cus-3",
    customer_name: "Елена Кузнецова",
    customer_phone: "+7 (900) 555-44-33",
    chat_id: "demo-3",
    created_at: new Date(Date.now() - 432000000).toISOString(),
    updated_at: new Date(Date.now() - 259200000).toISOString(),
    status: "completed",
    total_amount: 9500,
    payment_status: "paid",
    delivery_address: "г. Москва, ул. Пушкина, д. 15, кв. 7",
    delivery_date: new Date(Date.now() - 259200000).toISOString(),
    comment: "Оставить у консьержа",
    responsible_manager: "Дмитрий Иванов",
    items: DEMO_ORDER_ITEMS.filter(item => item.order_id === "ord-789")
  },
  {
    id: "ord-101",
    customer_id: "cus-4",
    customer_name: "Дмитрий Морозов",
    customer_phone: "+7 (900) 111-22-33",
    chat_id: "demo-4",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 43200000).toISOString(),
    status: "cancelled",
    total_amount: 20400,
    payment_status: "refunded",
    delivery_address: "г. Москва, ул. Тверская, д. 20, кв. 45",
    delivery_date: null,
    comment: "Клиент отменил заказ",
    responsible_manager: "Анна Козлова",
    items: DEMO_ORDER_ITEMS.filter(item => item.order_id === "ord-101")
  },
  {
    id: "ord-202",
    customer_id: "cus-5",
    customer_name: "Ольга Соколова",
    customer_phone: "+7 (900) 777-88-99",
    chat_id: "demo-5",
    created_at: new Date(Date.now() - 3600000).toISOString(),
    updated_at: new Date(Date.now() - 1800000).toISOString(),
    status: "processing",
    total_amount: 15000,
    payment_status: "paid",
    delivery_address: "г. Москва, ул. Арбат, д. 8, кв. 3",
    delivery_date: new Date(Date.now() + 7200000).toISOString(),
    comment: "Доставить после 18:00",
    responsible_manager: "Сергей Соколов",
    estimated_delivery_time: "2 часа",
    items: [{
      id: "item-6",
      order_id: "ord-202",
      product_id: 6,
      product_name: "Композиция 'Радость'",
      product_image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop",
      quantity: 1,
      price: 15000,
      created_at: new Date().toISOString()
    }]
  }
];

// Demo chats
export const DEMO_CHATS: Chat[] = [
  {
    id: "demo-1",
    name: "Анна Иванова",
    aiEnabled: true,
    unreadCount: 2,
    lastMessage: {
      content: "Спасибо за букет! Когда будет доставка?",
      timestamp: new Date(Date.now() - 300000).toISOString(),
      hasProduct: false,
      price: 0
    },
    source: "whatsapp"
  },
  {
    id: "demo-2",
    name: "Петр Смирнов",
    aiEnabled: false,
    unreadCount: 0,
    lastMessage: {
      content: "Заказ готов к доставке",
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      hasProduct: false,
      price: 0
    },
    source: "telegram"
  },
  {
    id: "demo-3",
    name: "Елена Кузнецова",
    aiEnabled: true,
    unreadCount: 0,
    lastMessage: {
      content: "Заказ доставлен, спасибо!",
      timestamp: new Date(Date.now() - 259200000).toISOString(),
      hasProduct: false,
      price: 0
    },
    source: "whatsapp"
  },
  {
    id: "demo-4",
    name: "Дмитрий Морозов",
    aiEnabled: false,
    unreadCount: 1,
    lastMessage: {
      content: "К сожалению, отменяю заказ",
      timestamp: new Date(Date.now() - 43200000).toISOString(),
      hasProduct: false,
      price: 0
    },
    source: "web"
  },
  {
    id: "demo-5",
    name: "Ольга Соколова",
    aiEnabled: true,
    unreadCount: 3,
    lastMessage: {
      content: "Можно доставить позже?",
      timestamp: new Date(Date.now() - 600000).toISOString(),
      hasProduct: false,
      price: 0
    },
    source: "whatsapp"
  }
];

// Demo messages for different chats
export const DEMO_MESSAGES: { [chatId: string]: Message[] } = {
  "demo-1": [
    {
      id: "msg-1-1",
      content: "Здравствуйте! Хочу заказать букет на день рождения",
      role: "USER",
      timestamp: new Date(Date.now() - 7200000).toISOString()
    },
    {
      id: "msg-1-2",
      content: "Добро пожаловать! Какой бюджет вы рассматриваете?",
      role: "BOT",
      sender: "OPERATOR",
      operatorName: "Алексей Смирнов",
      timestamp: new Date(Date.now() - 7100000).toISOString()
    },
    {
      id: "msg-1-3",
      content: "До 10000 рублей",
      role: "USER",
      timestamp: new Date(Date.now() - 7000000).toISOString()
    },
    {
      id: "msg-1-4",
      content: "Отлично! Рекомендую этот весенний букет",
      role: "BOT",
      sender: "OPERATOR",
      operatorName: "Алексей Смирнов",
      timestamp: new Date(Date.now() - 6900000).toISOString(),
      product: {
        id: "1",
        imageUrl: "https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=300&h=300&fit=crop",
        price: 8900
      }
    },
    {
      id: "msg-1-5",
      content: "Спасибо за букет! Когда будет доставка?",
      role: "USER",
      timestamp: new Date(Date.now() - 300000).toISOString()
    }
  ],
  "demo-2": [
    {
      id: "msg-2-1",
      content: "Нужен букет из роз",
      role: "USER",
      timestamp: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: "msg-2-2",
      content: "Классический букет из красных роз - отличный выбор!",
      role: "BOT",
      sender: "OPERATOR",
      operatorName: "Елена Петрова",
      timestamp: new Date(Date.now() - 3500000).toISOString(),
      product: {
        id: "3",
        imageUrl: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=300&h=300&fit=crop",
        price: 12000
      }
    },
    {
      id: "msg-2-3",
      content: "Заказ готов к доставке",
      role: "BOT",
      sender: "OPERATOR",
      operatorName: "Елена Петрова",
      timestamp: new Date(Date.now() - 1800000).toISOString()
    }
  ]
};
