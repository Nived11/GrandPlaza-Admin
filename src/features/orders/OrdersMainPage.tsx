'use client';

import React, { useState } from 'react';
import { ChefHat, ShoppingBag, UtensilsCrossed, AlertCircle } from 'lucide-react';
import { useLiveOrders } from './hooks/useLiveOrders';
import OrderTabs from './components/OrderTabs';
import OrderCard from './components/OrderCard';
import KOTReceiptModal from './components/KOTReceiptModal';
import CustomerInvoiceModal from './components/CustomerInvoiceModal';
import OrderDetailsModal from './components/OrderDetailsModal';
import { AdminOrder } from './types/orderTypes';

export default function OrdersMainPage() {
  const {
    orders,
    stats,
    loading,
    isUpdating,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    paymentFilter,
    setPaymentFilter,
    autoRefresh,
    setAutoRefresh,
    soundEnabled,
    toggleSound,
    refreshOrders,
    updateStatus,
  } = useLiveOrders();

  // Selected Order for Modals
  const [kotOrder, setKotOrder] = useState<AdminOrder | null>(null);
  const [billOrder, setBillOrder] = useState<AdminOrder | null>(null);
  const [detailsOrder, setDetailsOrder] = useState<AdminOrder | null>(null);

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Page Title & Live Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Live Orders & Kitchen POS
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Kitchen Live
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Auto-confirmed kitchen tickets, thermal KOT printing, and delivery boy dispatch counter
          </p>
        </div>

        {/* Quick Kitchen Metric Pills */}
        <div className="flex items-center gap-3">
          <div className="bg-white border border-gray-100 rounded-2xl px-4 py-2.5 shadow-xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-black">
              <ChefHat size={18} />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                In Kitchen
              </span>
              <span className="text-base font-black text-slate-900">
                {stats.preparing} Active
              </span>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl px-4 py-2.5 shadow-xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black">
              <ShoppingBag size={18} />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                At Counter
              </span>
              <span className="text-base font-black text-slate-900">
                {stats.ready_for_pickup} Ready
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs, Search & Live Polling Controls */}
      <OrderTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        paymentFilter={paymentFilter}
        setPaymentFilter={setPaymentFilter}
        autoRefresh={autoRefresh}
        setAutoRefresh={setAutoRefresh}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        onRefresh={refreshOrders}
        loading={loading}
      />

      {/* Orders Grid */}
      {loading && orders.length === 0 ? (
        /* Loading Skeleton */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm animate-pulse space-y-4">
              <div className="flex justify-between items-center">
                <div className="h-6 w-24 bg-gray-200 rounded-lg" />
                <div className="h-5 w-20 bg-gray-200 rounded-full" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-3/4 bg-gray-200 rounded" />
                <div className="h-3 w-1/2 bg-gray-100 rounded" />
              </div>
              <div className="h-20 bg-gray-50 rounded-2xl" />
              <div className="h-10 bg-gray-200 rounded-2xl" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm space-y-4 max-w-lg mx-auto my-8">
          <div className="w-16 h-16 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center mx-auto">
            <UtensilsCrossed size={32} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">No Orders in this Section</h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-sm mx-auto">
              {searchQuery
                ? `No orders matching "${searchQuery}". Try a different search.`
                : activeTab === 'preparing'
                ? 'All kitchen orders have been prepared! Waiting for incoming customer orders.'
                : 'There are currently no orders under this status tab.'}
            </p>
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold transition hover:bg-slate-800 cursor-pointer"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        /* Active Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onUpdateStatus={updateStatus}
              onPrintKOT={(o) => setKotOrder(o)}
              onPrintBill={(o) => setBillOrder(o)}
              onViewDetails={(o) => setDetailsOrder(o)}
              isUpdating={isUpdating}
            />
          ))}
        </div>
      )}

      {/* KOT Thermal Print Modal */}
      <KOTReceiptModal
        order={kotOrder}
        isOpen={Boolean(kotOrder)}
        onClose={() => setKotOrder(null)}
      />

      {/* Customer Invoice Modal */}
      <CustomerInvoiceModal
        order={billOrder}
        isOpen={Boolean(billOrder)}
        onClose={() => setBillOrder(null)}
      />

      {/* Order Details Drawer/Modal */}
      <OrderDetailsModal
        order={detailsOrder}
        isOpen={Boolean(detailsOrder)}
        onClose={() => setDetailsOrder(null)}
        onUpdateStatus={updateStatus}
        onPrintKOT={(o) => setKotOrder(o)}
        onPrintBill={(o) => setBillOrder(o)}
        isUpdating={isUpdating}
      />
    </div>
  );
}
