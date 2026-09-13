import React from "react";
import { Mail, Phone, MapPin, Ban, CheckCircle } from "lucide-react";
import type { Customer } from "../hooks/useCustomer";

interface CustomerTableRowProps {
  customer: Customer;
  onToggleBlock: (id: number) => void;
}

const CustomerTableRow = ({ customer, onToggleBlock }: CustomerTableRowProps) => {
  return (
    <tr className="border-b border-brand-gold/10 hover:bg-brand-gold/5 transition-colors">
      
      {/* Customer Name & ID */}
      <td className="px-4 sm:px-6 py-4 text-left">
        <div className="text-left">
          <p className="text-xs sm:text-sm font-black text-brand-green-dark text-left">
            {customer.first_name ? `${customer.first_name} ${customer.last_name || ""}`.trim() : customer.username}
          </p>
          <p className="text-[9px] text-gray-400 font-bold mt-0.5 text-left">
            #{customer.id}
          </p>
        </div>
      </td>

      {/* Email */}
      <td className="px-4 sm:px-6 py-4 text-left">
        <div className="flex items-center justify-start gap-2">
          <Mail size={14} className="text-brand-green-dark/50 shrink-0" />
          <span className="text-xs text-gray-600 truncate max-w-[200px]">
            {customer.email || "N/A"}
          </span>
        </div>
      </td>

      {/* Phone */}
      <td className="px-4 sm:px-6 py-4 text-left">
        <div className="flex items-center justify-start gap-2">
          <Phone size={14} className="text-brand-green-dark/50 shrink-0" />
          <span className="text-xs text-gray-600">
            {customer.phone_number || "N/A"}
          </span>
        </div>
      </td>

      {/* Role */}
      <td className="px-4 sm:px-6 py-4 text-left">
        <span className="text-[9px] font-black uppercase tracking-wider text-brand-green-dark">
          {customer.role}
        </span>
      </td>

      {/* Status (Active / Blocked) */}
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

      {/* Address */}
      <td className="px-4 sm:px-6 py-4 text-left">
        <div className="flex items-center justify-start gap-2">
          <MapPin size={14} className="text-brand-green-dark/50 shrink-0" />
          <span className="text-xs text-gray-600 truncate max-w-[140px]">
            {customer.address || "N/A"}
          </span>
        </div>
      </td>

      {/* 🛑 Action (Block / Unblock Button) */}
      <td className="px-4 sm:px-6 py-4 text-right">
        {customer.is_active !== false ? (
          <button
            onClick={() => onToggleBlock(customer.id)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-500 text-red-600 hover:text-white border border-red-200 text-[10px] font-black uppercase tracking-wider transition-all shadow-xs cursor-pointer"
          >
            <Ban size={12} strokeWidth={2.5} />
            Block
          </button>
        ) : (
          <button
            onClick={() => onToggleBlock(customer.id)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 text-[10px] font-black uppercase tracking-wider transition-all shadow-xs cursor-pointer"
          >
            <CheckCircle size={12} strokeWidth={2.5} />
            Unblock
          </button>
        )}
      </td>

    </tr>
  );
};

export default CustomerTableRow;