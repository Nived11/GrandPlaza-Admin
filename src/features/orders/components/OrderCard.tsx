'use client';

import React, { useState, useEffect } from 'react';
import {
  Printer,
  Receipt,
  Phone,
  MapPin,
  Clock,
  AlertTriangle,
  ChevronRight,
  PackageCheck,
  Bike,
  CheckCircle2,
  ChefHat,
  Loader2,
} from 'lucide-react';
import { AdminOrder, OrderStatus, PaymentStatus } from '../types/orderTypes';

interface OrderCardProps {
  order: AdminOrder;
  onUpdateStatus: (id: number, status: OrderStatus, paymentStatus?: PaymentStatus) => Promise<boolean>;
  onPrintKOT: (order: AdminOrder) => void;
  onPrintBill: (order: AdminOrder) => void;
  onViewDetails: (order: AdminOrder) => void;
  isUpdating: boolean;
}

export default function OrderCard({
  order,
  onUpdateStatus,
  onPrintKOT,
  onPrintBill,
  onViewDetails,
  isUpdating,
}: OrderCardProps) {
  const [elapsedMins, setElapsedMins] = useState(0);

  // Calculate elapsed time in minutes
  useEffect(() => {
    const calcMinutes = () => {
      const created = new Date(order.created_at).getTime();
      const now = Date.now();
      const diffMins = Math.max(0, Math.floor((now - created) / (1000 * 60)));
      setElapsedMins(diffMins);
    };

    calcMinutes();
    const timer = setInterval(calcMinutes, 30000);
    return () => clearInterval(timer);
  }, [order.created_at]);

  const isKitchenActive = order.status === 'pending' || order.status === 'preparing';

  // Primary Action Button Configuration based on current status
  const getPrimaryAction = () => {
    if (isKitchenActive) {
      return {
        label: 'Mark Food Ready',
        sublabel: 'Move to Packed / Counter',
        icon: <PackageCheck size={16} />,
        nextStatus: 'ready_for_pickup' as OrderStatus,
        className: 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-600/20',
      };
    }
    if (order.status === 'ready_for_pickup') {
      return {
        label: 'Handover to Delivery Boy',
        sublabel: 'Dispatch for delivery',
        icon: <Bike size={16} />,
        nextStatus: 'out_for_delivery' as OrderStatus,
        className: 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/20',
      };
    }
    if (order.status === 'out_for_delivery') {
      return {
        label: 'Mark Delivered',
        sublabel: 'Completed & Cash Collected',
        icon: <CheckCircle2 size={16} />,
        nextStatus: 'delivered' as OrderStatus,
        paymentStatus: 'completed' as PaymentStatus,
        className: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20',
      };
    }
    return null;
  };

  const primaryAction = getPrimaryAction();

  const statusBadge = () => {
    if (isKitchenActive) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-orange-100 text-orange-800 border border-orange-200">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          In Kitchen
        </span>
      );
    }
    if (order.status === 'ready_for_pickup') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-800 border border-blue-200">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          Ready at Counter
        </span>
      );
    }
    if (order.status === 'out_for_delivery') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-purple-100 text-purple-800 border border-purple-200">
          <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
          Out for Delivery
        </span>
      );
    }
    if (order.status === 'delivered') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
          <CheckCircle2 size={12} />
          Delivered
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-200">
        Cancelled
      </span>
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden relative group">
      
      {/* Top Bar */}
      <div className="p-4 sm:p-5 border-b border-gray-100 flex items-start justify-between gap-3 bg-gray-50/50">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              #{order.id}
            </span>
            {statusBadge()}
          </div>

          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 font-medium">
            <Clock size={13} className="text-gray-400" />
            <span>
              {elapsedMins === 0 ? 'Just now' : `${elapsedMins} mins ago`}
            </span>
            <span>•</span>
            <span>{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</span>
          </div>
        </div>

        {/* Payment Badge */}
        <div className="text-right">
          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
            order.payment_status === 'completed'
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              : 'bg-amber-100 text-amber-800 border border-amber-200'
          }`}>
            {order.payment_status === 'completed' ? 'PAID' : 'COD (COLLECT CASH)'}
          </span>
          <p className="text-sm sm:text-base font-black text-slate-900 mt-0.5">
            ₹{parseFloat(order.total_price).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Customer Quick Details */}
      <div className="px-4 sm:px-5 pt-3.5 pb-2 text-xs text-gray-600 space-y-1.5 border-b border-gray-100/70">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-800">{order.customer_name}</span>
          <a
            href={`tel:${order.customer_phone}`}
            className="text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1 transition"
          >
            <Phone size={12} /> {order.customer_phone}
          </a>
        </div>
        <div className="flex items-start gap-1 text-[11px] text-gray-500 line-clamp-1">
          <MapPin size={12} className="shrink-0 mt-0.5 text-gray-400" />
          <span className="truncate">{order.delivery_address}</span>
        </div>
      </div>

      {/* Item List Preview */}
      <div className="p-4 sm:p-5 flex-grow space-y-2">
        <div className="space-y-1.5">
          {order.items.map((item, idx) => (
            <div key={item.id || idx} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <span className="w-5 h-5 rounded bg-slate-100 text-slate-700 font-bold text-[11px] flex items-center justify-center shrink-0">
                  {item.quantity}
                </span>
                <span className="font-semibold text-slate-800 truncate">
                  {item.item_name}
                  {item.variant_name && (
                    <span className="text-[10px] text-gray-500 font-normal ml-1">
                      ({item.variant_name})
                    </span>
                  )}
                </span>
              </div>
              <span className="text-gray-500 text-[11px] shrink-0">₹{item.line_total}</span>
            </div>
          ))}
        </div>

        {/* Special Cooking Instructions Box */}
        {order.special_instructions && (
          <div className="mt-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 text-[11px]">
            <div className="flex items-center gap-1 font-bold text-amber-900 uppercase text-[10px] mb-0.5">
              <AlertTriangle size={12} className="text-amber-600 shrink-0" />
              <span>Chef Note:</span>
            </div>
            <p className="font-bold text-amber-950 leading-tight">
              "{order.special_instructions}"
            </p>
          </div>
        )}
      </div>

      {/* Bottom Actions Bar */}
      <div className="p-4 bg-gray-50/80 border-t border-gray-100 space-y-2.5">
        {/* Primary Status Step Button */}
        {primaryAction && (
          <button
            type="button"
            disabled={isUpdating}
            onClick={() => onUpdateStatus(order.id, primaryAction.nextStatus, primaryAction.paymentStatus)}
            className={`w-full py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-98 cursor-pointer ${primaryAction.className}`}
          >
            {isUpdating ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              primaryAction.icon
            )}
            <span>{primaryAction.label}</span>
          </button>
        )}

        {/* Secondary Quick Action Buttons */}
        <div className="flex items-center justify-between gap-1.5 pt-1">
          <div className="flex items-center gap-1.5">
            {/* KOT Print Button */}
            <button
              type="button"
              onClick={() => onPrintKOT(order)}
              title="Print Kitchen Ticket (KOT)"
              className="p-2 rounded-xl bg-white border border-gray-200 hover:border-slate-800 hover:bg-slate-900 hover:text-white text-gray-700 text-xs font-semibold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
            >
              <ChefHat size={14} className="text-amber-500" />
              <span className="hidden sm:inline">KOT</span>
            </button>

            {/* Bill Print Button */}
            <button
              type="button"
              onClick={() => onPrintBill(order)}
              title="Print Customer Bill"
              className="p-2 rounded-xl bg-white border border-gray-200 hover:border-emerald-800 hover:bg-emerald-900 hover:text-white text-gray-700 text-xs font-semibold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
            >
              <Receipt size={14} className="text-emerald-600" />
              <span className="hidden sm:inline">Bill</span>
            </button>
          </div>

          {/* Full Details Button */}
          <button
            type="button"
            onClick={() => onViewDetails(order)}
            className="p-2 px-3 rounded-xl bg-white border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-900 text-xs font-bold flex items-center gap-1 transition shadow-xs cursor-pointer ml-auto"
          >
            <span>Details</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
