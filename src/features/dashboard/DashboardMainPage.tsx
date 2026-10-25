'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { useDashboardData } from './hooks/useDashboardData';
import { getStaffOrdersApi } from '@/features/orders/api/orderApi';
import { getBookingsApi } from '@/features/booking/api/bookingApi';
import { getCustomersApi } from '@/features/customers/api/customerApi';
import { exportMasterWorkbookToExcel } from '@/utils/excelExport';
import DashboardHeader from './components/DashboardHeader';
import DashboardStatsCards from './components/DashboardStatsCards';
import RevenueChart from './components/RevenueChart';
import LivePipelineCard from './components/LivePipelineCard';
import TopSellingDishes from './components/TopSellingDishes';
import CategoryDistributionCard from './components/CategoryDistributionCard';
import OperationsHealthCard from './components/OperationsHealthCard';
import PaymentBreakdownCard from './components/PaymentBreakdownCard';
import RecentOrdersWidget from './components/RecentOrdersWidget';
import DashboardQuickActions from './components/DashboardQuickActions';
import FleetDistanceCard from './components/FleetDistanceCard';

export default function DashboardMainPage() {
  const [isExporting, setIsExporting] = useState(false);

  const {
    period,
    setPeriod,
    data,
    loading,
    refreshing,
    autoRefresh,
    setAutoRefresh,
    refetch,
  } = useDashboardData('today');

  const handleExportAll = async () => {
    try {
      setIsExporting(true);
      toast.info('📊 Preparing complete Master Excel report (Orders, Bookings, Customers)...');

      const [ordersRes, bookingsRes, customersRes] = await Promise.allSettled([
        getStaffOrdersApi({ page_size: 10000 }),
        getBookingsApi(),
        getCustomersApi(1, '', 'all'),
      ]);

      const orders =
        ordersRes.status === 'fulfilled'
          ? Array.isArray(ordersRes.value)
            ? ordersRes.value
            : ordersRes.value?.results || ordersRes.value?.data || []
          : [];

      const bookings =
        bookingsRes.status === 'fulfilled'
          ? Array.isArray(bookingsRes.value)
            ? bookingsRes.value
            : bookingsRes.value?.results || bookingsRes.value?.data || []
          : [];

      const customers =
        customersRes.status === 'fulfilled'
          ? Array.isArray(customersRes.value)
            ? customersRes.value
            : customersRes.value?.results || customersRes.value?.data || []
          : [];

      if (orders.length === 0 && bookings.length === 0 && customers.length === 0) {
        toast.warning('No records found to export.');
        return;
      }

      exportMasterWorkbookToExcel({
        orders,
        bookings,
        customers,
      });

      toast.success(
        `✅ Master Excel report generated! (${orders.length} orders, ${bookings.length} reservations, ${customers.length} patrons)`
      );
    } catch (err: any) {
      console.error('Failed to export master report:', err);
      toast.error(err?.message || 'Failed to export master report.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-3 sm:p-5 lg:p-8 space-y-4 sm:space-y-6">
      
      {/* 1. Header with Period Selector & Live Indicator */}
      <DashboardHeader
        period={period}
        onPeriodChange={setPeriod}
        periodLabel={data?.period_label || 'Today'}
        autoRefresh={autoRefresh}
        onToggleAutoRefresh={() => setAutoRefresh((prev) => !prev)}
        onRefresh={refetch}
        refreshing={refreshing}
        activeOrdersCount={data?.live_pipeline?.total_active ?? 0}
        onExportExcel={handleExportAll}
        isExporting={isExporting}
      />

      {/* 2. Top Metric Cards (Revenue, Orders, Live Funnel, AOV) */}
      <DashboardStatsCards
        kpis={data?.kpis}
        livePipeline={data?.live_pipeline}
        comparisonLabel={data?.comparison_label || ''}
      />

      {/* 3. Quick Restaurant Shortcuts Bar */}
      <DashboardQuickActions />

      {/* 4. Middle Section: Sales Trend Chart & Live Kitchen Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Interactive Visual Trend Chart (2 columns on desktop) */}
        <div className="lg:col-span-2">
          <RevenueChart
            timeline={data?.timeline || []}
            periodLabel={data?.period_label || 'Today'}
          />
        </div>

        {/* Live Pipeline & Order Status Funnel (1 column on desktop) */}
        <div className="lg:col-span-1">
          <LivePipelineCard
            pipeline={data?.live_pipeline}
            breakdown={data?.status_breakdown}
            periodLabel={data?.period_label || 'Today'}
          />
        </div>
      </div>

      {/* 5. Food Analytics: Top Selling Dishes & Category Sales Share */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-stretch">
        {/* Top Selling Food Items (Period vs All-Time Switcher) */}
        <div className="h-full">
          <TopSellingDishes
            items={data?.top_selling_items || []}
            allTimeItems={data?.all_time_top_selling || []}
            periodLabel={data?.period_label || 'Today'}
          />
        </div>

        {/* Category Sales Share */}
        <div className="h-full">
          <CategoryDistributionCard
            categories={data?.category_distribution || []}
            periodLabel={data?.period_label || 'Today'}
          />
        </div>
      </div>

      {/* 6. Operations, Fleet Ride & Payment Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch">
        {/* Kitchen Rush Hours & Fulfillment Health */}
        <div className="lg:col-span-1 h-full">
          <OperationsHealthCard
            metrics={data?.operations_metrics}
            livePipeline={data?.live_pipeline}
            periodLabel={data?.period_label || 'Today'}
          />
        </div>

        {/* 🏍️ Fleet & Delivery Boy Distance Tracking */}
        <div className="lg:col-span-1 h-full">
          <FleetDistanceCard
            metrics={data?.fleet_distance}
            periodLabel={data?.period_label || 'Today'}
          />
        </div>

        {/* Payment Methods (Online UPI vs COD) */}
        <div className="lg:col-span-1 h-full">
          <PaymentBreakdownCard
            payment={data?.payment_breakdown}
            periodLabel={data?.period_label || 'Today'}
          />
        </div>
      </div>

      {/* 7. Real-Time Recent Orders Feed */}
      <RecentOrdersWidget orders={data?.recent_orders || []} />

    </div>
  );
}
