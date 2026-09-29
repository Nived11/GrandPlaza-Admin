'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowUpRight, Phone, Clock, ChevronRight } from 'lucide-react';
import { RecentOrder } from '../types/dashboardTypes';

interface RecentOrdersWidgetProps {
  orders: RecentOrder[];
}

export default function RecentOrdersWidget({ orders }: RecentOrdersWidgetProps) {
  if (!orders || orders.length === 0) {
    return null;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
      case 'preparing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-orange-100 text-orange-800 border border-orange-200">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            Kitchen
          </span>
        );
      case 'ready_for_pickup':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800 border border-blue-200">
            Counter Ready
          </span>
        );
      case 'out_for_delivery':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-800 border border-purple-200">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            In Transit
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
            Delivered
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-200">
            Cancelled
          </span>
        );
    }
  };

  const getTimeAgo = (dateStr: string) => {
    if (!dateStr) return 'Recently';
    const parsed = new Date(dateStr).getTime();
    if (isNaN(parsed)) return 'Recently';
    const diff = Math.max(0, Math.floor((Date.now() - parsed) / 60000));
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    const hours = Math.floor(diff / 60);
    return `${hours}h ago`;
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black">
            <ShoppingBag size={16} />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Recent Live Orders Feed
            </h3>
            <p className="text-[11px] text-gray-500">
              Latest transactions placed across customer apps
            </p>
          </div>
        </div>

        <Link
          href="/orders"
          className="text-xs font-bold text-slate-900 hover:text-emerald-700 flex items-center gap-1 hover:underline cursor-pointer"
        >
          <span>View All in POS</span>
          <ArrowUpRight size={13} />
        </Link>
      </div>

      {/* Orders Table / Cards */}
      <div className="mt-2 divide-y divide-gray-100">
        {orders.map((o) => (
          <div
            key={o.id}
            className="py-3 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-gray-50/60 rounded-2xl px-2 sm:px-3 -mx-2 sm:-mx-3 transition"
          >
            {/* Left: ID, Customer name, Phone */}
            <div className="flex items-center gap-3">
              <span className="font-black text-sm text-slate-900 bg-gray-100 px-2 py-1 rounded-xl">
                #{o.id}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs sm:text-sm text-slate-800">
                    {o.customer_name}
                  </span>
                  {getStatusBadge(o.status)}
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-500 font-medium">
                  <a
                    href={`tel:${o.customer_phone}`}
                    className="text-emerald-700 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Phone size={10} /> {o.customer_phone}
                  </a>
                  <span>•</span>
                  <span>{o.items_count} items</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-gray-400">
                    <Clock size={10} /> {getTimeAgo(o.created_at)}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Amount, Payment, Link */}
            <div className="flex items-center justify-between sm:justify-end gap-3 self-stretch sm:self-auto pt-1 sm:pt-0 border-t sm:border-t-0 border-gray-100">
              <div className="text-left sm:text-right">
                <span className="font-black text-sm sm:text-base text-slate-900 block">
                  ₹{o.total_price.toFixed(2)}
                </span>
                <span
                  className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    o.payment_status === 'completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {o.payment_status === 'completed' ? 'PAID' : 'COD'}
                </span>
              </div>

              <Link
                href="/orders"
                className="p-2 rounded-xl bg-gray-100 hover:bg-slate-900 hover:text-white text-gray-600 transition cursor-pointer"
                title="Open in Live Orders"
              >
                <ChevronRight size={15} />
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
