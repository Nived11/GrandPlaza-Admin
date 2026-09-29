import axiosInstance from '@/lib/axios';
import { OrderFilterParams, OrderStatus, PaymentStatus } from '../types/orderTypes';

export const getStaffOrdersApi = async (params: OrderFilterParams = {}) => {
  const query = new URLSearchParams();

  if (params.status && params.status !== 'all') {
    query.append('status', params.status);
  }
  if (params.payment_status && params.payment_status !== 'all') {
    query.append('payment_status', params.payment_status);
  }
  if (params.search && params.search.trim()) {
    query.append('search', params.search.trim());
  }
  if (params.page) {
    query.append('page', String(params.page));
  }

  const queryString = query.toString() ? `?${query.toString()}` : '';
  const response = await axiosInstance.get(`/orders/staff/orders${queryString}`);
  return response.data;
};

export const updateOrderStatusApi = async (
  orderId: number,
  status: OrderStatus,
  payment_status?: PaymentStatus
) => {
  const payload: { status: OrderStatus; payment_status?: PaymentStatus } = { status };
  if (payment_status) {
    payload.payment_status = payment_status;
  }

  const response = await axiosInstance.patch(
    `/orders/staff/orders/${orderId}/status`,
    payload
  );
  return response.data;
};
