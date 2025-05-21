
import { Order, OrderItem, OrdersFilter } from "@/types/order";
import { mockOrders, getFilteredMockOrders, getMockOrderById, getMockOrdersByChatId } from "@/data/mockOrders";

// Re-export mock data functions for use in hooks
export { 
  mockOrders,
  getFilteredMockOrders,
  getMockOrderById,
  getMockOrdersByChatId 
};

// Add or update an order in the mock data
export const addOrUpdateMockOrder = (order: Order): Order => {
  const index = mockOrders.findIndex(o => o.id === order.id);
  if (index >= 0) {
    mockOrders[index] = { ...order };
    return mockOrders[index];
  } else {
    mockOrders.push(order);
    return order;
  }
};

// Remove an order from mock data
export const removeMockOrder = (orderId: string): boolean => {
  const initialLength = mockOrders.length;
  const orderIndex = mockOrders.findIndex(order => order.id === orderId);
  
  if (orderIndex !== -1) {
    mockOrders.splice(orderIndex, 1);
    return initialLength > mockOrders.length;
  }
  
  return false;
};

// Generate a unique order ID
export const generateOrderId = (): string => {
  return `ord-${Math.floor(Math.random() * 10000)}`;
};

// Generate a unique order item ID
export const generateOrderItemId = (): string => {
  return `item-${Math.floor(Math.random() * 10000)}`;
};

// Calculate order total from items
export const calculateOrderTotal = (items: OrderItem[]): number => {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};
