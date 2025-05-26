
import { Order, OrdersFilter } from "@/types/order";
import { Product } from "@/types/product";
import { Chat, Message } from "@/types/chat";
import { DEMO_ORDERS, DEMO_PRODUCTS, DEMO_CHATS, DEMO_MESSAGES } from "@/data/demoData";

// LocalStorage keys
const STORAGE_KEYS = {
  ORDERS: 'demo_orders',
  PRODUCTS: 'demo_products', 
  CHATS: 'demo_chats',
  MESSAGES: 'demo_messages',
  DEMO_MODE: 'demo_mode_enabled'
} as const;

// Initialize demo data in localStorage
export const initializeDemoData = (): void => {
  console.log('[DemoStorage] Initializing demo data');
  
  // Enable demo mode
  localStorage.setItem(STORAGE_KEYS.DEMO_MODE, 'true');
  
  // Initialize orders if not exists
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(DEMO_ORDERS));
  }
  
  // Initialize products if not exists
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(DEMO_PRODUCTS));
  }
  
  // Initialize chats if not exists
  if (!localStorage.getItem(STORAGE_KEYS.CHATS)) {
    localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(DEMO_CHATS));
  }
  
  // Initialize messages if not exists
  if (!localStorage.getItem(STORAGE_KEYS.MESSAGES)) {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(DEMO_MESSAGES));
  }
};

// Check if demo mode is enabled
export const isDemoModeEnabled = (): boolean => {
  return localStorage.getItem(STORAGE_KEYS.DEMO_MODE) === 'true';
};

// Orders operations
export const getDemoOrders = (filters?: OrdersFilter): Order[] => {
  try {
    const ordersJson = localStorage.getItem(STORAGE_KEYS.ORDERS);
    let orders: Order[] = ordersJson ? JSON.parse(ordersJson) : DEMO_ORDERS;
    
    if (!filters) return orders;
    
    return orders.filter(order => {
      if (filters.status && order.status !== filters.status) return false;
      if (filters.dateFrom && new Date(order.created_at) < new Date(filters.dateFrom)) return false;
      if (filters.dateTo && new Date(order.created_at) > new Date(filters.dateTo)) return false;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const hasMatch = 
          order.id.toLowerCase().includes(searchLower) ||
          (order.customer_name && order.customer_name.toLowerCase().includes(searchLower)) ||
          (order.customer_phone && order.customer_phone.toLowerCase().includes(searchLower));
        if (!hasMatch) return false;
      }
      if (filters.customer_id && order.customer_id !== filters.customer_id) return false;
      if (filters.chat_id && order.chat_id !== filters.chat_id) return false;
      
      return true;
    });
  } catch (error) {
    console.error('[DemoStorage] Error getting orders:', error);
    return DEMO_ORDERS;
  }
};

export const getDemoOrderById = (orderId: string): Order | null => {
  try {
    const orders = getDemoOrders();
    return orders.find(order => order.id === orderId) || null;
  } catch (error) {
    console.error('[DemoStorage] Error getting order by ID:', error);
    return null;
  }
};

export const getDemoOrdersByChatId = (chatId: string): Order[] => {
  try {
    const orders = getDemoOrders();
    return orders.filter(order => order.chat_id === chatId);
  } catch (error) {
    console.error('[DemoStorage] Error getting orders by chat ID:', error);
    return [];
  }
};

export const saveDemoOrder = (order: Order): Order => {
  try {
    const orders = getDemoOrders();
    const index = orders.findIndex(o => o.id === order.id);
    
    if (index >= 0) {
      orders[index] = { ...order, updated_at: new Date().toISOString() };
    } else {
      orders.push({ ...order, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
    }
    
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    return order;
  } catch (error) {
    console.error('[DemoStorage] Error saving order:', error);
    throw error;
  }
};

export const deleteDemoOrder = (orderId: string): boolean => {
  try {
    const orders = getDemoOrders();
    const filteredOrders = orders.filter(order => order.id !== orderId);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(filteredOrders));
    return true;
  } catch (error) {
    console.error('[DemoStorage] Error deleting order:', error);
    return false;
  }
};

// Products operations
export const getDemoProducts = (): Product[] => {
  try {
    const productsJson = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return productsJson ? JSON.parse(productsJson) : DEMO_PRODUCTS;
  } catch (error) {
    console.error('[DemoStorage] Error getting products:', error);
    return DEMO_PRODUCTS;
  }
};

export const saveDemoProduct = (product: Product): Product => {
  try {
    const products = getDemoProducts();
    const index = products.findIndex(p => p.id === product.id);
    
    if (index >= 0) {
      products[index] = product;
    } else {
      products.push(product);
    }
    
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    return product;
  } catch (error) {
    console.error('[DemoStorage] Error saving product:', error);
    throw error;
  }
};

export const deleteDemoProduct = (productId: string): boolean => {
  try {
    const products = getDemoProducts();
    const filteredProducts = products.filter(product => product.id !== productId);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(filteredProducts));
    return true;
  } catch (error) {
    console.error('[DemoStorage] Error deleting product:', error);
    return false;
  }
};

// Chats operations
export const getDemoChats = (): Chat[] => {
  try {
    const chatsJson = localStorage.getItem(STORAGE_KEYS.CHATS);
    return chatsJson ? JSON.parse(chatsJson) : DEMO_CHATS;
  } catch (error) {
    console.error('[DemoStorage] Error getting chats:', error);
    return DEMO_CHATS;
  }
};

export const getDemoMessages = (chatId: string): Message[] => {
  try {
    const messagesJson = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    const allMessages = messagesJson ? JSON.parse(messagesJson) : DEMO_MESSAGES;
    return allMessages[chatId] || [];
  } catch (error) {
    console.error('[DemoStorage] Error getting messages:', error);
    return DEMO_MESSAGES[chatId] || [];
  }
};

export const saveDemoMessage = (chatId: string, message: Message): Message => {
  try {
    const messagesJson = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    const allMessages = messagesJson ? JSON.parse(messagesJson) : DEMO_MESSAGES;
    
    if (!allMessages[chatId]) {
      allMessages[chatId] = [];
    }
    
    allMessages[chatId].push(message);
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(allMessages));
    return message;
  } catch (error) {
    console.error('[DemoStorage] Error saving message:', error);
    throw error;
  }
};

// Reset demo data
export const resetDemoData = (): void => {
  console.log('[DemoStorage] Resetting demo data');
  localStorage.removeItem(STORAGE_KEYS.ORDERS);
  localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
  localStorage.removeItem(STORAGE_KEYS.CHATS);
  localStorage.removeItem(STORAGE_KEYS.MESSAGES);
  initializeDemoData();
};

// Export demo data
export const exportDemoData = (): string => {
  const data = {
    orders: getDemoOrders(),
    products: getDemoProducts(),
    chats: getDemoChats(),
    messages: localStorage.getItem(STORAGE_KEYS.MESSAGES)
  };
  return JSON.stringify(data, null, 2);
};

// Import demo data
export const importDemoData = (jsonData: string): boolean => {
  try {
    const data = JSON.parse(jsonData);
    
    if (data.orders) localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(data.orders));
    if (data.products) localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(data.products));
    if (data.chats) localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(data.chats));
    if (data.messages) localStorage.setItem(STORAGE_KEYS.MESSAGES, data.messages);
    
    return true;
  } catch (error) {
    console.error('[DemoStorage] Error importing data:', error);
    return false;
  }
};
