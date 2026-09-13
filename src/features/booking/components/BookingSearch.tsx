"use client";

import React from "react";
import { Search, Calendar, RotateCcw } from "lucide-react";

interface BookingSearchProps {
  value: string;
  onChange: (value: string) => void;
  dateFilter: string;
  onDateFilterChange: (date: string) => void;
  onReset: () => void;
  isFiltered: boolean;
}

export default function BookingSearch({
  value,
  onChange,
  dateFilter,
  onDateFilterChange,
  onReset,
  isFiltered,
}: BookingSearchProps) {
  return (
    <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-2 sm:px-4">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-green-dark/50"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search by customer name, phone, or email..."
          className="w-full bg-white border border-brand-gold/40 rounded-xl py-2.5 sm:py-3 pl-11 pr-4 text-xs font-bold outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all shadow-xs placeholder:text-gray-400 text-brand-green-dark"
        />
      </div>

      {/* Date Filter & Reset */}
      <div className="flex items-center gap-2 self-start sm:self-auto">
        {/* Date Filter Input */}
        <div className="relative flex items-center bg-white border border-brand-gold/40 rounded-xl px-3 py-2 shadow-xs">
          <Calendar size={14} className="text-brand-green-dark/60 mr-2 shrink-0" />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => onDateFilterChange(e.target.value)}
            className="text-xs font-bold text-brand-green-dark outline-none bg-transparent cursor-pointer"
          />
        </div>

        {/* Reset Filter Button */}
        {isFiltered && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-all cursor-pointer shadow-xs"
            title="Reset filters"
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}
