
export type OrderStatus = 'new' | 'processing' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'cancelled' | 'refunded';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: number;
  product_name?: string;
  product_image?: string;
  quantity: number;
  price: number;
  created_at: string;
}

export interface Order {
  id: string;
  customer_id: string | null;
  customer_name?: string;
  customer_phone?: string;
  chat_id: string | null;
  created_at: string;
  updated_at: string;
  status: OrderStatus;
  total_amount: number;
  payment_status: PaymentStatus;
  delivery_address: string | null;
  delivery_date: string | null;
  comment: string | null;
  items?: OrderItem[];
  responsible_manager?: string;
  estimated_delivery_time?: string;
}

export interface OrdersFilter {
  status?: OrderStatus;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
  customer_id?: string;
  chat_id?: string;
}
