export type OrderStatus =
  | 'pending'
  | 'preparing'
  | 'ready_for_pickup'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'completed' | 'refunded';

export interface AdminOrderItem {
  id: number;
  menu_item: number | null;
  variant: number | null;
  item_name: string;
  variant_name: string;
  quantity: number;
  unit_price: string;
  line_total: string;
}

export interface AdminOrder {
  id: number;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  special_instructions: string;
  total_price: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  items: AdminOrderItem[];
  created_at: string;
  updated_at: string;
  payment_method?: string;
}

export interface OrderFilterParams {
  status?: string;
  payment_status?: string;
  search?: string;
  page?: number;
}
