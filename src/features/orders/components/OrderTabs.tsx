'use client';

import React from 'react';
import {
  ChefHat,
  PackageCheck,
  Bike,
  CheckCircle2,
  XCircle,
  Volume2,
  VolumeX,
  RefreshCw,
  Search,
  Filter,
  Printer,
} from 'lucide-react';
import { OrderStatus } from '../types/orderTypes';

interface OrderTabsProps {
  activeTab: 'all' | OrderStatus;
  setActiveTab: (tab: 'all' | OrderStatus) => void;
  stats: {
    total: number;
    preparing: number;
    ready_for_pickup: number;
    out_for_delivery: number;
    delivered: number;
    cancelled: number;
  };
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  paymentFilter: 'all' | 'pending' | 'completed';
  setPaymentFilter: (f: 'all' | 'pending' | 'completed') => void;
  autoRefresh: boolean;
  setAutoRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  soundEnabled: boolean;
  onToggleSound: () => void;
  autoPrintEnabled: boolean;
  onRequestToggleAutoPrint: () => void;
  onRefresh: () => void;
  loading: boolean;
}

export default function OrderTabs({
  activeTab,
  setActiveTab,
  stats,
  searchQuery,
  setSearchQuery,
  paymentFilter,
  setPaymentFilter,
  autoRefresh,
  setAutoRefresh,
  soundEnabled,
  onToggleSound,
  autoPrintEnabled,
  onRequestToggleAutoPrint,
  onRefresh,
  loading,
}: OrderTabsProps) {
  const tabs = [
    {
      id: 'preparing' as const,
      label: 'Kitchen / Preparing',
      count: stats.preparing,
      icon: <ChefHat size={16} />,
      activeClass: 'bg-orange-500 text-white shadow-md shadow-orange-500/25',
      badgeClass: 'bg-orange-600 text-white',
    },
    {
      id: 'ready_for_pickup' as const,
      label: 'Ready for Pickup',
      count: stats.ready_for_pickup,
      icon: <PackageCheck size={16} />,
      activeClass: 'bg-blue-600 text-white shadow-md shadow-blue-600/25',
      badgeClass: 'bg-blue-700 text-white',
    },
    {
      id: 'out_for_delivery' as const,
      label: 'Out for Delivery',
      count: stats.out_for_delivery,
      icon: <Bike size={16} />,
      activeClass: 'bg-purple-600 text-white shadow-md shadow-purple-600/25',
      badgeClass: 'bg-purple-700 text-white',
    },
    {
      id: 'delivered' as const,
      label: 'Delivered',
      count: stats.delivered,
      icon: <CheckCircle2 size={16} />,
      activeClass: 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25',
      badgeClass: 'bg-emerald-700 text-white',
    },
    {
      id: 'cancelled' as const,
      label: 'Cancelled',
      count: stats.cancelled,
      icon: <XCircle size={16} />,
      activeClass: 'bg-rose-600 text-white shadow-md shadow-rose-600/25',
      badgeClass: 'bg-rose-700 text-white',
    },
    {
      id: 'all' as const,
      label: 'All Orders',
      count: stats.total,
      icon: null,
      activeClass: 'bg-slate-900 text-white shadow-md shadow-slate-900/25',
      badgeClass: 'bg-slate-800 text-white',
    },
  ];

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Top Controls Bar: Search, Sound, Refresh, Payment filter */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5 sm:gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-gray-100 shadow-sm">
        
        {/* Search Input */}
        <div className="relative flex-grow w-full lg:max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID, Customer name or Phone..."
            className="w-full pl-10 pr-4 py-2 sm:py-2.5 bg-gray-50 border border-gray-200/80 rounded-xl text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition"
          />
        </div>

        {/* Right Controls */}
        <div className="flex items-center justify-between sm:justify-end flex-wrap gap-2 w-full lg:w-auto">
          {/* Payment Filter */}
          <div className="flex items-center gap-1 bg-gray-50 border border-gray-200/80 rounded-xl p-0.5 sm:p-1 text-xs font-semibold">
            <Filter size={13} className="text-gray-400 ml-1.5 hidden xs:block" />
            <button
              onClick={() => setPaymentFilter('all')}
              className={`px-2 sm:px-2.5 py-1.5 rounded-lg transition text-[11px] sm:text-xs cursor-pointer ${
                paymentFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setPaymentFilter('completed')}
              className={`px-2 sm:px-2.5 py-1.5 rounded-lg transition text-[11px] sm:text-xs cursor-pointer ${
                paymentFilter === 'completed'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Paid
            </button>
            <button
              onClick={() => setPaymentFilter('pending')}
              className={`px-2 sm:px-2.5 py-1.5 rounded-lg transition text-[11px] sm:text-xs cursor-pointer ${
                paymentFilter === 'pending'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              COD
            </button>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Auto-Print KOT Toggle with Protection */}
            <button
              type="button"
              onClick={onRequestToggleAutoPrint}
              title={autoPrintEnabled ? 'Kitchen Auto-Print is ACTIVE' : 'Kitchen Auto-Print is OFF'}
              className={`p-2 sm:p-2.5 rounded-xl border transition flex items-center gap-1 text-[11px] sm:text-xs font-bold cursor-pointer ${
                autoPrintEnabled
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs'
                  : 'bg-gray-50 border-gray-200 text-gray-400'
              }`}
            >
              <Printer size={15} className={autoPrintEnabled ? 'text-emerald-600' : 'text-gray-400'} />
              <span className="hidden sm:inline">Auto-Print:</span>
              <span
                className={`px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-black uppercase ${
                  autoPrintEnabled ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {autoPrintEnabled ? 'ON' : 'OFF'}
              </span>
            </button>

            {/* Sound Alert Toggle */}
            <button
              type="button"
              onClick={onToggleSound}
              title={soundEnabled ? 'Mute new order chime' : 'Enable new order sound'}
              className={`p-2 sm:p-2.5 rounded-xl border transition flex items-center gap-1 text-[11px] sm:text-xs font-bold cursor-pointer ${
                soundEnabled
                  ? 'bg-amber-50 border-amber-200 text-amber-800'
                  : 'bg-gray-50 border-gray-200 text-gray-400'
              }`}
            >
              {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
              <span className="hidden md:inline">{soundEnabled ? 'Sound' : 'Muted'}</span>
            </button>

            {/* Auto Refresh Toggle */}
            <button
              type="button"
              onClick={() => setAutoRefresh((prev) => !prev)}
              title="Toggle live 12s auto-refresh"
              className={`p-2 sm:p-2.5 rounded-xl border transition flex items-center gap-1.5 text-[11px] sm:text-xs font-bold cursor-pointer ${
                autoRefresh
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-gray-50 border-gray-200 text-gray-400'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-emerald-500 animate-ping' : 'bg-gray-400'}`} />
              <span className="hidden md:inline">Sync</span>
            </button>

            {/* Manual Refresh */}
            <button
              type="button"
              onClick={onRefresh}
              disabled={loading}
              title="Refresh Orders now"
              className="p-2 sm:p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition active:scale-95 cursor-pointer disabled:opacity-50 shrink-0"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Row: Edge to edge horizontal scroll on mobile */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 no-scrollbar -mx-3 px-3 sm:mx-0 sm:px-0">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                isActive
                  ? tab.activeClass
                  : 'bg-white hover:bg-gray-50 text-gray-600 border border-gray-100 shadow-xs'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              <span
                className={`ml-0.5 sm:ml-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black ${
                  isActive ? tab.badgeClass : 'bg-gray-100 text-gray-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

