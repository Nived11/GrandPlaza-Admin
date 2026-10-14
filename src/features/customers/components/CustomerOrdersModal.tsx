'use client';

import React from 'react';
import {
  X,
  Phone,
  MessageSquare,
  ShoppingBag,
  IndianRupee,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Receipt,
  User,
} from 'lucide-react';
import { Customer, CustomerOrder } from '../hooks/useCustomer';

interface CustomerOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  orders: CustomerOrder[];
  loading: boolean;
}

export default function CustomerOrdersModal({
  isOpen,
  onClose,
  customer,
  orders,
  loading,
}: CustomerOrdersModalProps) {
  if (!isOpen || !customer) return null;

  // Clean phone number for WhatsApp
  const cleanPhone = customer.phone_number ? customer.phone_number.replace(/\D/g, '') : '';
  const waPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  const whatsappUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(
    `Hello ${customer.first_name || customer.username}, greetings from Empire Plaza!`
  )}`;

  const customerName =
    customer.first_name
      ? `${customer.first_name} ${customer.last_name || ''}`.trim()
      : customer.username;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-brand-green-dark to-slate-900 text-white p-5 sm:p-6 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-lg shrink-0 shadow-md">
              {customerName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white tracking-tight">
                  {customerName}
                </h3>
                {customer.customer_badge === 'VIP' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-400 text-slate-950 shadow-xs">
                    👑 VIP Patron
                  </span>
                )}
                {customer.customer_badge === 'REGULAR' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-400/20 text-emerald-300 border border-emerald-400/40">
                    🌟 Regular
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-200/80 font-medium mt-0.5">
                Customer #{customer.id} • {customer.phone_number} {customer.email && `• ${customer.email}`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Quick Contact & Metrics Summary Bar */}
        <div className="bg-gray-50 p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Quick Metrics */}
          <div className="flex items-center gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                Total Orders
              </span>
              <span className="text-sm font-black text-slate-900 flex items-center gap-1">
                <ShoppingBag size={14} className="text-orange-500" />
                {customer.total_orders || orders.length} Orders
              </span>
            </div>

            <div className="h-7 w-px bg-gray-200" />

            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                Total Lifetime Spend
              </span>
              <span className="text-sm font-black text-emerald-700 flex items-center gap-0.5">
                ₹{Number(customer.total_spent || 0).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Quick Contact Buttons */}
          <div className="flex items-center gap-2">
            <a
              href={`tel:${customer.phone_number}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-gray-200 hover:border-emerald-500 text-slate-800 hover:text-emerald-700 font-bold text-xs shadow-xs transition active:scale-95"
            >
              <Phone size={13} className="text-emerald-600" />
              <span>Call</span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition active:scale-95"
            >
              <MessageSquare size={13} />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Orders List Container */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
              <Receipt size={14} className="text-emerald-700" />
              Order History ({orders.length})
            </h4>
            <span className="text-[10px] text-gray-400 font-bold">
              Sorted by Newest First
            </span>
          </div>

          {loading ? (
            <div className="py-12 text-center space-y-3">
              <Loader2 size={28} className="animate-spin text-emerald-600 mx-auto" />
              <p className="text-xs text-gray-500 font-medium">Loading customer order history...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-12 text-center text-gray-400 space-y-2">
              <ShoppingBag size={32} className="mx-auto text-gray-300" />
              <p className="text-xs font-semibold">No orders recorded for this customer yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((ord) => {
                const formattedDate = new Date(ord.created_at).toLocaleString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                });

                const isDelivered = ord.status === 'delivered';
                const isCancelled = ord.status === 'cancelled';
                const isCOD = ord.payment_status === 'pending';

                return (
                  <div
                    key={ord.id}
                    className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs hover:border-gray-200 transition space-y-3"
                  >
                    {/* Order Item Top Line */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-900">
                          Order #{ord.id}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium">
                          • {formattedDate}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Status Badge */}
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                            isDelivered
                              ? 'bg-emerald-100 text-emerald-800'
                              : isCancelled
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {ord.status.replace(/_/g, ' ')}
                        </span>

                        {/* Amount */}
                        <span className="text-xs font-black text-slate-900">
                          ₹{ord.total_price}
                        </span>
                      </div>
                    </div>

                    {/* Delivery Address */}
                    {ord.delivery_address && (
                      <div className="flex items-start gap-1.5 text-xs text-gray-600 bg-gray-50/80 p-2 rounded-xl">
                        <MapPin size={13} className="text-red-500 shrink-0 mt-0.5" />
                        <span className="text-[11px] truncate">{ord.delivery_address}</span>
                      </div>
                    )}

                    {/* Ordered Items summary */}
                    <div className="divide-y divide-gray-50 text-xs">
                      {ord.items.map((it) => (
                        <div key={it.id} className="py-1 flex items-center justify-between text-gray-700">
                          <span className="font-medium text-[11px]">
                            <span className="font-black text-slate-900">{it.quantity}x</span>{' '}
                            {it.item_name}{it.variant_name ? ` (${it.variant_name})` : ''}
                          </span>
                          <span className="text-[11px] font-bold text-slate-900">
                            ₹{it.line_total}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
