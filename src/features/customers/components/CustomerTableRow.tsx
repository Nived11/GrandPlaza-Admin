import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import type { Customer } from "../hooks/useCustomer";

interface CustomerTableRowProps {
  customer: Customer;
}

const CustomerTableRow = ({ customer }: CustomerTableRowProps) => {
  return (
    <tr className="border-b border-brand-gold/10 hover:bg-brand-gold/5 transition-colors">

      <td className="px-4 sm:px-6 py-4 text-left">
        <div className="text-left">
          <p className="text-xs sm:text-sm font-black text-brand-green-dark text-left">
            {customer.username}
          </p>

          <p className="text-[9px] text-gray-400 font-bold mt-0.5 text-left">
            #{customer.id}
          </p>
        </div>
      </td>

      <td className="px-4 sm:px-6 py-4 text-left">
        <div className="flex items-center justify-start gap-2">
          <Mail
            size={14}
            className="text-brand-green-dark/50 shrink-0"
          />

          <span className="text-xs text-gray-600 truncate max-w-[200px]">
            {customer.email || "N/A"}
          </span>
        </div>
      </td>

      <td className="px-4 sm:px-6 py-4 text-left">
        <div className="flex items-center justify-start gap-2">
          <Phone
            size={14}
            className="text-brand-green-dark/50 shrink-0"
          />

          <span className="text-xs text-gray-600">
            {customer.phone_number || "N/A"}
          </span>
        </div>
      </td>

      <td className="px-4 sm:px-6 py-4 text-left">
        <span className="text-[9px] font-black uppercase tracking-wider text-brand-green-dark">
          {customer.role}
        </span>
      </td>

      <td className="px-4 sm:px-6 py-4 text-left">
        <div className="flex items-center justify-start gap-2">
          <MapPin
            size={14}
            className="text-brand-green-dark/50 shrink-0"
          />

          <span className="text-xs text-gray-600">
            {customer.address || "N/A"}
          </span>
        </div>
      </td>

    </tr>
  );
};

export default CustomerTableRow;