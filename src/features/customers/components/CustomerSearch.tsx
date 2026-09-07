import React from "react";
import { Search } from "lucide-react";

interface CustomerSearchProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

const CustomerSearch = ({
  searchQuery,
  setSearchQuery,
}: CustomerSearchProps) => {
  return (
    <div className="relative w-full lg:max-w-xs">
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-green-dark/50"
        size={16}
      />

      <input
        type="text"
        placeholder="Search customers..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full bg-white border border-brand-gold/40 rounded-xl py-3 pl-11 pr-4 text-xs font-bold outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all shadow-sm placeholder:text-gray-400 text-brand-green-dark"
      />
    </div>
  );
};

export default CustomerSearch;