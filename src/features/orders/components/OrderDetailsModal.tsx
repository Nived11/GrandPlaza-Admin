'use client';

import React from 'react';
import {
  X,
  Printer,
  Receipt,
  Clock,
  Phone,
  MapPin,
  AlertTriangle,
  CreditCard,
  ChefHat,
  PackageCheck,
  Bike,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { AdminOrder, OrderStatus, PaymentStatus } from '../types/orderTypes';

interface OrderDetailsModalProps {
  order: AdminOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: number, status: OrderStatus, paymentStatus?: PaymentStatus) => void;
  onPrintKOT: (order: AdminOrder) => void;
  onPrintBill: (order: AdminOrder) => void;
  isUpdating: boolean;
}

export default function OrderDetailsModal({
  order,
  isOpen,
  onClose,
  onUpdateStatus,
  onPrintKOT,
  onPrintBill,
  isUpdating,
}: OrderDetailsModalProps) {
  if (!isOpen || !order) return null;

  const formattedTime = new Date(order.created_at).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const formattedDate = new Date(order.created_at).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const statusColors: Record<OrderStatus, { bg: string; text: string; label: string }> = {
    pending: { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Pending (Kitchen)' },
    preparing: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Kitchen (Preparing)' },
    ready_for_pickup: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Food Ready (Packed)' },
    out_for_delivery: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Out for Delivery' },
    delivered: { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'Delivered' },
    cancelled: { bg: 'bg-rose-100', text: 'text-rose-800', label: 'Cancelled' },
  };

  const currentStatus = statusColors[order.status] || {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    label: order.status,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <span className="text-xl font-black">Order #{order.id}</span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${currentStatus.bg} ${currentStatus.text}`}>
              {currentStatus.label}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-gray-400 hover:text-white transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Customer Details */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                Customer Information
              </span>
              <p className="font-bold text-gray-900 text-base">{order.customer_name}</p>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Phone size={14} className="text-gray-400 shrink-0" />
                <a href={`tel:${order.customer_phone}`} className="font-semibold text-emerald-700 hover:underline">
                  {order.customer_phone}
                </a>
              </div>
              <div className="flex items-start gap-2 text-xs text-gray-600 pt-1">
                <MapPin size={14} className="text-gray-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{order.delivery_address}</span>
              </div>
            </div>

            {/* Payment & Timestamps */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                Payment & Timing
              </span>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Total Amount:</span>
                <span className="text-base font-black text-emerald-900">₹{parseFloat(order.total_price).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600 flex items-center gap-1.5">
                  <CreditCard size={14} className="text-gray-400" /> Payment:
                </span>
                <span className={`px-2 py-0.5 rounded font-black text-[11px] uppercase ${
                  order.payment_status === 'completed'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {order.payment_status === 'completed' ? 'PAID' : 'COD (Cash to Collect)'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-200/60">
                <span className="flex items-center gap-1">
                  <Clock size={12} /> Ordered:
                </span>
                <span className="font-medium text-gray-800">{formattedDate} at {formattedTime}</span>
              </div>
            </div>
          </div>

          {/* Special Cooking Instructions */}
          {order.special_instructions && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-xs font-black text-amber-900 uppercase mb-1">
                <AlertTriangle size={16} className="text-amber-600" />
                <span>Cooking / Chef Instructions:</span>
              </div>
              <p className="text-sm font-bold text-amber-950">"{order.special_instructions}"</p>
            </div>
          )}

          {/* Items List */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
              Order Items ({order.items.length})
            </h4>
            <div className="divide-y divide-gray-100 rounded-2xl border border-gray-100 overflow-hidden bg-white">
              {order.items.map((item, idx) => (
                <div key={item.id || idx} className="p-3.5 flex items-center justify-between hover:bg-gray-50/60 transition">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {item.quantity}×
                    </span>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{item.item_name}</p>
                      {item.variant_name && (
                        <span className="text-[11px] text-gray-500 font-medium">
                          Size: {item.variant_name}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-400 block">₹{item.unit_price} each</span>
                    <span className="text-sm font-bold text-gray-900">₹{item.line_total}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Workflow Action Steps */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
              Update Order Status
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                type="button"
                disabled={isUpdating || order.status === 'preparing'}
                onClick={() => onUpdateStatus(order.id, 'preparing')}
                className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition text-xs font-bold cursor-pointer ${
                  order.status === 'preparing'
                    ? 'border-orange-500 bg-orange-50 text-orange-800'
                    : 'border-gray-200 hover:border-orange-300 text-gray-700'
                }`}
              >
                <ChefHat size={18} className="text-orange-600" />
                <span>1. In Kitchen</span>
              </button>

              <button
                type="button"
                disabled={isUpdating || order.status === 'ready_for_pickup'}
                onClick={() => onUpdateStatus(order.id, 'ready_for_pickup')}
                className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition text-xs font-bold cursor-pointer ${
                  order.status === 'ready_for_pickup'
                    ? 'border-blue-500 bg-blue-50 text-blue-800'
                    : 'border-gray-200 hover:border-blue-300 text-gray-700'
                }`}
              >
                <PackageCheck size={18} className="text-blue-600" />
                <span>2. Food Ready</span>
              </button>

              <button
                type="button"
                disabled={isUpdating || order.status === 'out_for_delivery'}
                onClick={() => onUpdateStatus(order.id, 'out_for_delivery')}
                className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition text-xs font-bold cursor-pointer ${
                  order.status === 'out_for_delivery'
                    ? 'border-purple-500 bg-purple-50 text-purple-800'
                    : 'border-gray-200 hover:border-purple-300 text-gray-700'
                }`}
              >
                <Bike size={18} className="text-purple-600" />
                <span>3. Delivery Boy</span>
              </button>

              <button
                type="button"
                disabled={isUpdating || order.status === 'delivered'}
                onClick={() => onUpdateStatus(order.id, 'delivered', 'completed')}
                className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition text-xs font-bold cursor-pointer ${
                  order.status === 'delivered'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                    : 'border-gray-200 hover:border-emerald-300 text-gray-700'
                }`}
              >
                <CheckCircle2 size={18} className="text-emerald-600" />
                <span>4. Delivered</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
          {/* Cancel Order */}
          {order.status !== 'cancelled' && order.status !== 'delivered' && (
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => onUpdateStatus(order.id, 'cancelled')}
              className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1.5 transition cursor-pointer"
            >
              <XCircle size={15} /> Cancel Order
            </button>
          )}

          <div className="flex items-center gap-2.5 ml-auto">
            <button
              type="button"
              onClick={() => onPrintKOT(order)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer"
            >
              <Printer size={14} className="text-amber-400" />
              <span>Print KOT</span>
            </button>

            <button
              type="button"
              onClick={() => onPrintBill(order)}
              className="px-4 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer"
            >
              <Receipt size={14} className="text-amber-400" />
              <span>Print Bill</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
