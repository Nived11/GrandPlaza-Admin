"use client";

import React from "react";
import { Search } from "lucide-react";

interface BookingSearchProps {
  value: string;
  onChange: (value: string) => void;
}

const BookingSearch = ({
  value,
  onChange,
}: BookingSearchProps) => {
  return (
    <div className="relative w-full md:w-[320px] lg:w-[340px]">

      <Search
        size={17}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by name or phone..."
        className="h-12 w-full rounded-xl border border-brand-gold/60 bg-white pl-11 pr-4 text-sm text-brand-green-dark outline-none shadow-sm transition-all placeholder:text-gray-400 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/10"
      />

    </div>
  );
};

export default BookingSearch;