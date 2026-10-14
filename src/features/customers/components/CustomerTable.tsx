import React from 'react';
import CustomerTableRow from './CustomerTableRow';
import type { Customer } from '../hooks/useCustomer';

interface CustomerTableProps {
  customers: Customer[];
  onToggleBlock: (id: number) => void;
  onViewOrders: (customer: Customer) => void;
}

const CustomerTable = ({
  customers,
  onToggleBlock,
  onViewOrders,
}: CustomerTableProps) => {
  if (customers.length === 0) {
    return (
      <div className="py-16 text-center text-xs font-bold text-gray-400 bg-white rounded-3xl border border-gray-100 shadow-xs space-y-1">
        <p className="text-sm font-black text-slate-800">No customers found</p>
        <p className="text-xs text-gray-400">Try adjusting your search or filters above</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-3xl border border-brand-gold/20 bg-white shadow-xs">
      <table className="w-full min-w-[900px]">
        <thead>
          <tr className="border-b border-brand-gold/20 bg-brand-green-dark">
            <th className="px-4 sm:px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest text-brand-gold">
              Customer Profile
            </th>

            <th className="px-4 sm:px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest text-brand-gold">
              Total Orders
            </th>

            <th className="px-4 sm:px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest text-brand-gold">
              Lifetime Spend
            </th>

            <th className="px-4 sm:px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest text-brand-gold">
              Phone
            </th>

            <th className="px-4 sm:px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest text-brand-gold">
              Email
            </th>

            <th className="px-4 sm:px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest text-brand-gold">
              Account Status
            </th>

            <th className="px-4 sm:px-6 py-4 text-right text-[9px] font-black uppercase tracking-widest text-brand-gold">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {customers.map((customer) => (
            <CustomerTableRow
              key={customer.id}
              customer={customer}
              onToggleBlock={onToggleBlock}
              onViewOrders={onViewOrders}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTable;