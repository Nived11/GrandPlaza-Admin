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
        <div className="text-right shrink-0">
          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap ${
            order.payment_status === 'completed'
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              : 'bg-amber-100 text-amber-800 border border-amber-200'
          }`}>
            {order.payment_status === 'completed' ? 'PAID' : 'COD'}
          </span>
          <p className="text-sm sm:text-base font-black text-slate-900 mt-0.5">
            ₹{parseFloat(order.total_price).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Customer Quick Details */}
      <div className="px-4 sm:px-5 pt-3.5 pb-2 text-xs text-gray-600 space-y-1.5 border-b border-gray-100/70">
        <div className="flex items-center justify-between gap-2">
          <span className="font-bold text-slate-800 truncate">{order.customer_name}</span>
          <a
            href={`tel:${order.customer_phone}`}
            className="text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1 transition shrink-0"
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

      {/* Dynamic Workflow Status & Action Section */}
      <div className="p-4 bg-gray-50/80 border-t border-gray-100 space-y-2.5">
        
        {/* 1. KITCHEN ACTIVE: Mark Food Ready */}
        {isKitchenActive && (
          <button
            type="button"
            disabled={isUpdating}
            onClick={() => onUpdateStatus(order.id, 'ready_for_pickup')}
            className="w-full py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-98 cursor-pointer bg-orange-600 hover:bg-orange-700 text-white shadow-orange-600/20"
          >
            {isUpdating ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <PackageCheck size={16} />
            )}
            <span>Mark Food Ready (Move to Counter)</span>
          </button>
        )}

        {/* 2. READY FOR PICKUP: Live Waiting Status for Delivery Boys */}
        {order.status === 'ready_for_pickup' && (
          <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-3 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-amber-950">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                </span>
                <span>Request Sent to Delivery Boys</span>
              </div>
              <Bike size={16} className="text-amber-600 shrink-0" />
            </div>
            <p className="text-[11px] text-amber-900/80 leading-tight">
              Waiting for delivery partner to accept in their app & pick up at counter...
            </p>
            <div className="pt-1 flex items-center justify-between border-t border-amber-200/60 text-[11px]">
              <span className="text-amber-700/70 text-[10px]">Auto-moves on driver accept</span>
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => onUpdateStatus(order.id, 'out_for_delivery')}
                className="font-bold text-purple-700 hover:text-purple-950 underline cursor-pointer flex items-center gap-0.5"
              >
                <span>Manual Dispatch</span>
                <ChevronRight size={12} />
              </button>
            </div>
          </div>
        )}

        {/* 3. OUT FOR DELIVERY: In-Transit with Delivery Partner */}
        {order.status === 'out_for_delivery' && (
          <div className="bg-purple-50/90 border border-purple-200 rounded-2xl p-3 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-purple-950">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-600"></span>
                </span>
                <span>On the Road with Delivery Partner</span>
              </div>
              <Bike size={16} className="text-purple-700 shrink-0" />
            </div>

            {/* Assigned Delivery Boy Details (if available) */}
            {order.delivery_boy ? (
              <div className="bg-white rounded-xl p-2.5 border border-purple-100 flex items-center justify-between text-[11px]">
                <div>
                  <span className="font-bold text-slate-800 block">
                    {order.delivery_boy.name}
                    {order.delivery_boy.employee_id && (
                      <span className="text-[10px] text-purple-600 font-bold ml-1">
                        ({order.delivery_boy.employee_id})
                      </span>
                    )}
                  </span>
                  <a
                    href={`tel:${order.delivery_boy.phone}`}
                    className="text-emerald-700 font-semibold flex items-center gap-1 hover:underline"
                  >
                    <Phone size={10} /> {order.delivery_boy.phone}
                  </a>
                </div>
                <span className="text-[10px] font-black uppercase text-purple-800 bg-purple-100 px-2 py-0.5 rounded-full">
                  Assigned
                </span>
              </div>
            ) : (
              <p className="text-[11px] text-purple-900/80 leading-tight">
                Order in-transit. Delivery boy will complete via Driver App upon customer handover.
              </p>
            )}

            <div className="pt-0.5 flex items-center justify-between border-t border-purple-200/60 text-[11px]">
              <span className="text-purple-700/70 text-[10px]">Auto-completes on dropoff</span>
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => onUpdateStatus(order.id, 'delivered', 'completed')}
                className="font-bold text-emerald-700 hover:text-emerald-950 underline cursor-pointer flex items-center gap-0.5"
              >
                <span>Manual Mark Delivered</span>
                <ChevronRight size={12} />
              </button>
            </div>
          </div>
        )}

        {/* 4. DELIVERED: Completed Banner */}
        {order.status === 'delivered' && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-2.5 text-xs flex items-center justify-between text-emerald-900">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span className="font-bold">
                {order.delivery_boy ? `Delivered by ${order.delivery_boy.name}` : 'Delivered Successfully'}
              </span>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              Completed
            </span>
          </div>
        )}

        {/* Secondary Action Buttons (KOT, Bill, Details) */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          {/* KOT Print Button */}
          <button
            type="button"
            onClick={() => onPrintKOT(order)}
            title="Print Kitchen Ticket (KOT)"
            className="py-2 px-2 rounded-xl bg-white border border-gray-200 hover:border-slate-800 hover:bg-slate-900 hover:text-white text-gray-700 text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer active:scale-95"
          >
            <ChefHat size={14} className="text-amber-500 shrink-0" />
            <span>KOT</span>
          </button>

          {/* Bill Print Button */}
          <button
            type="button"
            onClick={() => onPrintBill(order)}
            title="Print Customer Bill"
            className="py-2 px-2 rounded-xl bg-white border border-gray-200 hover:border-emerald-800 hover:bg-emerald-900 hover:text-white text-gray-700 text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer active:scale-95"
          >
            <Receipt size={14} className="text-emerald-600 shrink-0" />
            <span>Bill</span>
          </button>

          {/* Full Details Button */}
          <button
            type="button"
            onClick={() => onViewDetails(order)}
            className="py-2 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1 transition shadow-xs cursor-pointer active:scale-95"
          >
            <span>Details</span>
            <ChevronRight size={14} className="shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
}
