'use client';

import React from 'react';
import { Search, Trophy, Wallet, Filter, ArrowUpDown, X } from 'lucide-react';

interface CustomerSearchProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  filterType: string;
  setFilterType: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  totalCount: number;
}

const CustomerSearch = ({
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
  sortBy,
  setSortBy,
  totalCount,
}: CustomerSearchProps) => {
  const filters = [
    { id: 'all', label: 'All Customers' },
    { id: 'top', label: '👑 Most Orders (Top VIPs)', icon: Trophy },
    { id: 'active', label: '🟢 Active' },
    { id: 'blocked', label: '🔴 Blocked' },
  ];

  return (
    <div className="w-full space-y-3">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Search Input Box */}
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-green-dark/50"
            size={16}
          />

          <input
            type="text"
            placeholder="Search by customer name, phone, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-brand-gold/40 rounded-2xl py-3 pl-11 pr-10 text-xs font-bold outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all shadow-xs placeholder:text-gray-400 text-brand-green-dark"
          />

          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-2xl border border-brand-gold/30 shadow-xs text-xs">
            <ArrowUpDown size={14} className="text-brand-green-dark/70" />
            <span className="text-[10px] font-bold uppercase text-gray-400 hidden sm:inline">
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent font-black text-brand-green-dark outline-none cursor-pointer text-xs"
            >
              <option value="most_orders">Most Orders Placed</option>
              <option value="highest_spent">Highest Spend (₹)</option>
              <option value="newest">Newest Joined</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>

          <span className="text-xs font-bold text-gray-400 bg-white px-3 py-2 rounded-2xl border border-gray-100 hidden lg:inline">
            {totalCount} Customers
          </span>
        </div>
      </div>

      {/* 🏷️ Filter Chips Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 px-1 hidden sm:inline">
          Filter:
        </span>
        {filters.map((f) => {
          const isActive = filterType === f.id;
          return (
            <button
              key={f.id}
              onClick={() => {
                setFilterType(f.id);
                // When selecting top, ensure sort is by most orders
                if (f.id === 'top') {
                  setSortBy('most_orders');
                }
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? 'bg-brand-green-dark text-brand-cream shadow-sm'
                  : 'bg-white hover:bg-gray-100 text-gray-600 border border-gray-200/70'
              }`}
            >
              {f.icon && <f.icon size={13} className={isActive ? 'text-amber-400' : 'text-orange-500'} />}
              <span>{f.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CustomerSearch;