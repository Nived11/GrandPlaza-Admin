export type DashboardPeriod = 'today' | 'week' | 'month' | 'year' | 'all';

export interface DashboardKPIs {
  total_revenue: number;
  revenue_growth_pct: number;
  total_orders: number;
  orders_growth_pct: number;
  avg_order_value: number;
  completed_orders: number;
  active_orders: number;
  cancelled_orders: number;
  total_customers: number;
}

export interface LivePipeline {
  in_kitchen: number;
  at_counter: number;
  in_transit: number;
  total_active: number;
}

export interface StatusBreakdown {
  preparing: number;
  ready_for_pickup: number;
  out_for_delivery: number;
  delivered: number;
  cancelled: number;
}

export interface PaymentBreakdown {
  online_paid_count: number;
  online_paid_revenue: number;
  cod_count: number;
  cod_revenue: number;
}

export interface TimelinePoint {
  label: string;
  revenue: number;
  orders: number;
}

export interface TopSellingItem {
  name: string;
  category: string;
  dietary: 'VEG' | 'NON-VEG';
  quantity_sold: number;
  revenue: number;
}

export interface RecentOrder {
  id: number;
  customer_name: string;
  customer_phone: string;
  total_price: number;
  status: string;
  payment_status: string;
  items_count: number;
  created_at: string;
}

export interface DashboardData {
  period: DashboardPeriod;
  period_label: string;
  comparison_label: string;
  kpis: DashboardKPIs;
  live_pipeline: LivePipeline;
  status_breakdown: StatusBreakdown;
  payment_breakdown: PaymentBreakdown;
  timeline: TimelinePoint[];
  top_selling_items: TopSellingItem[];
  recent_orders: RecentOrder[];
}
