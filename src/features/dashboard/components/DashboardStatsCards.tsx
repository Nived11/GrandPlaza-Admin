'use client';

import React from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  ChefHat, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Bike,
  PackageCheck,
  Receipt
} from 'lucide-react';
import { DashboardKPIs, LivePipeline } from '../types/dashboardTypes';

interface DashboardStatsCardsProps {
  kpis: DashboardKPIs;
  livePipeline: LivePipeline;
  comparisonLabel: string;
}

export default function DashboardStatsCards({
  kpis,
  livePipeline,
  comparisonLabel,
}: DashboardStatsCardsProps) {
  const safeKpis = kpis || {
    total_revenue: 0,
    revenue_growth_pct: 0,
    total_orders: 0,
    orders_growth_pct: 0,
    avg_order_value: 0,
    completed_orders: 0,
    active_orders: 0,
    cancelled_orders: 0,
    total_customers: 0,
  };
  const safePipeline = livePipeline || {
    in_kitchen: 0,
    at_counter: 0,
    in_transit: 0,
    total_active: 0,
  };
  const isRevenuePositive = safeKpis.revenue_growth_pct >= 0;
  const isOrdersPositive = safeKpis.orders_growth_pct >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      
      {/* 1. Total Net Revenue */}
      <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-0 opacity-70 group-hover:scale-110 transition-transform" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Total Revenue
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
              <span className="text-base font-black">₹</span>
            </div>
          </div>

          <div className="mt-3">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              ₹{(safeKpis.total_revenue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
          </div>
        </div>

        <div className="relative z-10 mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 font-bold">
            <span
              className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-black ${
                isRevenuePositive
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {isRevenuePositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              {isRevenuePositive ? `+${safeKpis.revenue_growth_pct}%` : `${safeKpis.revenue_growth_pct}%`}
            </span>
            <span className="text-gray-400 text-[11px] font-normal">{comparisonLabel}</span>
          </div>
          <span className="text-[11px] font-semibold text-gray-500">
            {safeKpis.completed_orders} sales
          </span>
        </div>
      </div>

      {/* 2. Total Orders */}
      <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full -z-0 opacity-70 group-hover:scale-110 transition-transform" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Total Orders
            </span>
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center font-black">
              <ShoppingBag size={20} />
            </div>
          </div>

          <div className="mt-3">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {safeKpis.total_orders}
            </h2>
          </div>
        </div>

        <div className="relative z-10 mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 font-bold">
            <span
              className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-black ${
                isOrdersPositive
                  ? 'bg-orange-100 text-orange-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {isOrdersPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              {isOrdersPositive ? `+${safeKpis.orders_growth_pct}%` : `${safeKpis.orders_growth_pct}%`}
            </span>
            <span className="text-gray-400 text-[11px] font-normal">{comparisonLabel}</span>
          </div>
          <span className="text-[11px] font-semibold text-gray-500">
            {safeKpis.cancelled_orders} cancl.
          </span>
        </div>
      </div>

      {/* 3. Live Active Pipeline (In-Kitchen + Counter + Transit) */}
      <div className="bg-white rounded-3xl p-5 border border-purple-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -z-0 opacity-70 group-hover:scale-110 transition-transform" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              Live Pipeline
            </span>
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-black">
              <ChefHat size={20} />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {safePipeline.total_active}
            </h2>
            <span className="text-xs font-bold text-purple-700">Orders Active Now</span>
          </div>
        </div>

        <div className="relative z-10 mt-4 pt-3 border-t border-purple-50 grid grid-cols-3 gap-1 text-center text-[10px] font-bold text-gray-600">
          <div className="bg-orange-50 rounded-xl py-1 text-orange-900 border border-orange-100">
            <span className="block font-black text-xs text-orange-700">{safePipeline.in_kitchen}</span>
            <span>Kitchen</span>
          </div>
          <div className="bg-blue-50 rounded-xl py-1 text-blue-900 border border-blue-100">
            <span className="block font-black text-xs text-blue-700">{safePipeline.at_counter}</span>
            <span>Counter</span>
          </div>
          <div className="bg-purple-50 rounded-xl py-1 text-purple-900 border border-purple-100">
            <span className="block font-black text-xs text-purple-700">{safePipeline.in_transit}</span>
            <span>Transit</span>
          </div>
        </div>
      </div>

      {/* 4. Average Order Value (AOV) & Customers */}
      <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full -z-0 opacity-70 group-hover:scale-110 transition-transform" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Avg. Order Value
            </span>
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black">
              <Receipt size={20} />
            </div>
          </div>

          <div className="mt-3">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              ₹{(safeKpis.avg_order_value || 0).toFixed(2)}
            </h2>
          </div>
        </div>

        <div className="relative z-10 mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-gray-600 font-bold">
            <Users size={13} className="text-amber-600" />
            <span>{safeKpis.total_customers} Unique Customers</span>
          </div>
          <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
            AOV
          </span>
        </div>
      </div>

    </div>
  );
}
