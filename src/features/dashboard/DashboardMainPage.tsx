'use client';

import React from 'react';
import { useDashboardData } from './hooks/useDashboardData';
import DashboardHeader from './components/DashboardHeader';
import DashboardStatsCards from './components/DashboardStatsCards';
import RevenueChart from './components/RevenueChart';
import LivePipelineCard from './components/LivePipelineCard';
import TopSellingDishes from './components/TopSellingDishes';
import PaymentBreakdownCard from './components/PaymentBreakdownCard';
import RecentOrdersWidget from './components/RecentOrdersWidget';

export default function DashboardMainPage() {
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
      />

      {/* 2. Top Metric Cards (Revenue, Orders, Live Funnel, AOV) */}
      <DashboardStatsCards
        kpis={data?.kpis}
        livePipeline={data?.live_pipeline}
        comparisonLabel={data?.comparison_label || ''}
      />

      {/* 3. Middle Section: Sales Trend Chart & Live Kitchen Pipeline */}
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

      {/* 4. Lower Section: Top Selling Dishes & Payment Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Bestseller Food Items */}
        <TopSellingDishes
          items={data?.top_selling_items || []}
          periodLabel={data?.period_label || 'Today'}
        />

        {/* Payment Methods (Online vs COD) */}
        <PaymentBreakdownCard
          payment={data?.payment_breakdown}
          periodLabel={data?.period_label || 'Today'}
        />
      </div>

      {/* 5. Real-Time Recent Orders Feed */}
      <RecentOrdersWidget orders={data?.recent_orders || []} />

    </div>
  );
}
