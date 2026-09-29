import axiosInstance from '@/lib/axios';
import { DashboardData, DashboardPeriod } from '../types/dashboardTypes';

export const getDashboardAnalyticsApi = async (period: DashboardPeriod = 'today'): Promise<DashboardData> => {
  const response = await axiosInstance.get(`/orders/staff/dashboard-analytics?period=${period}`);
  return response.data.data;
};
