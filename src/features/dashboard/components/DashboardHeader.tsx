'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  RefreshCw, 
  UtensilsCrossed, 
  ArrowUpRight,
  Calendar,
  ChefHat
} from 'lucide-react';
import { DashboardPeriod } from '../types/dashboardTypes';

interface DashboardHeaderProps {
  period: DashboardPeriod;
  onPeriodChange: (p: DashboardPeriod) => void;
  periodLabel: string;
  autoRefresh: boolean;
  onToggleAutoRefresh: () => void;
  onRefresh: () => void;
  refreshing: boolean;
  activeOrdersCount: number;
}

export default function DashboardHeader({
  period,
  onPeriodChange,
  periodLabel,
  autoRefresh,
  onToggleAutoRefresh,
  onRefresh,
  refreshing,
  activeOrdersCount,
}: DashboardHeaderProps) {
  const periods: { id: DashboardPeriod; label: string }[] = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'year', label: 'This Year' },
    { id: 'all', label: 'All Time' },
  ];

  const [todayFormatted, setTodayFormatted] = React.useState('');

  React.useEffect(() => {
    setTodayFormatted(
      new Date().toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    );
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {/* Top Bar: Title, Date, Live Badge, POS button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-3xl border border-gray-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Restaurant Analytics & Overview
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live POS Sync
            </span>
          </div>

          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 font-medium">
            <Calendar size={13} className="text-gray-400" />
            <span>{todayFormatted}</span>
            <span>•</span>
            <span>Real-time Swiggy & POS performance metrics</span>
          </div>
        </div>

        {/* Action Buttons: Live Kitchen POS & Refresh */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Direct Link to Live Kitchen POS */}
          <Link
            href="/orders"
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition active:scale-95 cursor-pointer"
          >
            <ChefHat size={16} />
            <span>Live Kitchen POS</span>
            {activeOrdersCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-white text-orange-600 text-[10px] font-black">
                {activeOrdersCount}
              </span>
            )}
            <ArrowUpRight size={13} className="opacity-75" />
          </Link>

          {/* Sync / Refresh */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshing}
            title="Refresh analytics data"
            className="p-2.5 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 transition active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin text-orange-500' : ''} />
          </button>
        </div>
      </div>

      {/* Period Filter Tabs (Swiggy / Partner Style) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2.5 sm:p-3 rounded-2xl border border-gray-100 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          <span className="text-[11px] font-black uppercase text-gray-400 px-2 hidden md:inline">
            Period:
          </span>
          {periods.map((p) => {
            const isActive = period === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onPeriodChange(p.id)}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-100'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Auto Refresh Toggle Indicator */}
        <div className="flex items-center justify-end gap-2 text-xs">
          <button
            type="button"
            onClick={onToggleAutoRefresh}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-bold transition cursor-pointer ${
              autoRefresh
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-gray-50 border-gray-200 text-gray-500'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-emerald-500 animate-ping' : 'bg-gray-400'}`} />
            <span>Auto-Refresh: {autoRefresh ? '15s ON' : 'Paused'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
