import React from "react";
import CustomerTableRow from "./CustomerTableRow";
import type { Customer } from "../hooks/useCustomer";

interface CustomerTableProps {
  customers: Customer[];
}

const CustomerTable = ({ customers }: CustomerTableProps) => {
  if (customers.length === 0) {
    return (
      <div className="py-12 text-center text-xs font-bold text-gray-400">
        No customers found.
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-brand-gold/20 bg-white shadow-sm">
      <table className="w-full min-w-[700px]">

        <thead>
          <tr className="border-b border-brand-gold/20 bg-brand-green-dark">

            <th className="px-4 sm:px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest text-brand-gold">
              Customer
            </th>

            <th className="px-4 sm:px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest text-brand-gold">
              Email
            </th>

            <th className="px-4 sm:px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest text-brand-gold">
              Phone
            </th>

            <th className="px-4 sm:px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest text-brand-gold">
              Role
            </th>

            <th className="px-4 sm:px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest text-brand-gold">
              Address
            </th>

          </tr>
        </thead>

        <tbody>
          {customers.map((customer) => (
            <CustomerTableRow
              key={customer.id}
              customer={customer}
            />
          ))}
        </tbody>

      </table>
    </div>
  );
};

export default CustomerTable;