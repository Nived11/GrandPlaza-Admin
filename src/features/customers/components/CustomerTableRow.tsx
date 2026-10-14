'use client';

import React from 'react';
import { Mail, Phone, MapPin, Ban, CheckCircle, ShoppingBag, Eye, Award } from 'lucide-react';
import type { Customer } from '../hooks/useCustomer';

interface CustomerTableRowProps {
  customer: Customer;
  onToggleBlock: (id: number) => void;
  onViewOrders: (customer: Customer) => void;
}

const CustomerTableRow = ({
  customer,
  onToggleBlock,
  onViewOrders,
}: CustomerTableRowProps) => {
  const customerName = customer.first_name
    ? `${customer.first_name} ${customer.last_name || ''}`.trim()
    : customer.username;

  const totalOrders = customer.total_orders || 0;
  const totalSpent = Number(customer.total_spent || 0);

  return (
    <tr className="border-b border-brand-gold/10 hover:bg-brand-gold/5 transition-colors">
      
      {/* 👤 Customer Name, ID & VIP Badge */}
      <td className="px-4 sm:px-6 py-4 text-left">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-green-dark/10 text-brand-green-dark font-black text-xs flex items-center justify-center shrink-0">
            {customerName.charAt(0).toUpperCase()}
          </div>
          <div className="text-left min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <p className="text-xs sm:text-sm font-black text-brand-green-dark truncate">
                {customerName}
              </p>
              {customer.customer_badge === 'VIP' && (
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 shadow-xs">
                  👑 VIP
                </span>
              )}
              {customer.customer_badge === 'REGULAR' && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                  🌟 Regular
                </span>
              )}
            </div>
            <p className="text-[9px] text-gray-400 font-bold mt-0.5">
              #{customer.id}
            </p>
          </div>
        </div>
      </td>

      {/* 📦 Total Orders Placed */}
      <td className="px-4 sm:px-6 py-4 text-left">
        <button
          onClick={() => onViewOrders(customer)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-950 font-black text-xs transition cursor-pointer group"
          title="Click to view customer orders"
        >
          <ShoppingBag size={13} className="text-orange-600 group-hover:scale-110 transition-transform" />
          <span>{totalOrders} {totalOrders === 1 ? 'Order' : 'Orders'}</span>
        </button>
      </td>

      {/* 💰 Total Lifetime Spent */}
      <td className="px-4 sm:px-6 py-4 text-left">
        <span className="text-xs font-black text-emerald-800">
          ₹{totalSpent.toLocaleString('en-IN')}
        </span>
      </td>

      {/* 📞 Phone */}
      <td className="px-4 sm:px-6 py-4 text-left">
        <div className="flex items-center justify-start gap-1.5">
          <Phone size={13} className="text-brand-green-dark/50 shrink-0" />
          <span className="text-xs text-gray-700 font-medium">
            {customer.phone_number || 'N/A'}
          </span>
        </div>
      </td>

      {/* ✉️ Email */}
      <td className="px-4 sm:px-6 py-4 text-left">
        <div className="flex items-center justify-start gap-1.5">
          <Mail size={13} className="text-brand-green-dark/50 shrink-0" />
          <span className="text-xs text-gray-600 truncate max-w-[170px]">
            {customer.email || 'N/A'}
          </span>
        </div>
      </td>

      {/* 🟢 Status (Active / Blocked) */}
      <td className="px-4 sm:px-6 py-4 text-left">
        {customer.is_active !== false ? (
          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            Active
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-rose-300">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
            Blocked
          </span>
        )}
      </td>

      {/* ⚡ Actions (View Orders & Block) */}
      <td className="px-4 sm:px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-1.5">
          {/* View Orders button */}
          <button
            onClick={() => onViewOrders(customer)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-wider transition-all shadow-xs cursor-pointer"
            title="View full order history"
          >
            <Eye size={12} />
            <span>Orders</span>
          </button>

          {/* Block / Unblock Button */}
          {customer.is_active !== false ? (
            <button
              onClick={() => onToggleBlock(customer.id)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-500 text-red-600 hover:text-white border border-red-200 text-[10px] font-black uppercase tracking-wider transition-all shadow-xs cursor-pointer"
            >
              <Ban size={12} strokeWidth={2.5} />
              <span>Block</span>
            </button>
          ) : (
            <button
              onClick={() => onToggleBlock(customer.id)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 text-[10px] font-black uppercase tracking-wider transition-all shadow-xs cursor-pointer"
            >
              <CheckCircle size={12} strokeWidth={2.5} />
              <span>Unblock</span>
            </button>
          )}
        </div>
      </td>

    </tr>
  );
};

export default CustomerTableRow;