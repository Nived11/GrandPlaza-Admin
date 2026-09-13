"use client";

import React from "react";
import { Search, Star, RotateCcw } from "lucide-react";

interface ReviewsFiltersProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  statusFilter: "all" | "approved" | "hidden";
  onStatusChange: (status: "all" | "approved" | "hidden") => void;
  ratingFilter: number | "all";
  onRatingChange: (rating: number | "all") => void;
  onReset: () => void;
  isFiltered: boolean;
}

export default function ReviewsFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  ratingFilter,
  onRatingChange,
  onReset,
  isFiltered,
}: ReviewsFiltersProps) {
  const ratingOptions: Array<number | "all"> = ["all", 5, 4, 3, 2, 1];

  return (
    <div className="w-full flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 px-2 sm:px-4">
      {/* 🔍 Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-green-dark/50"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by customer name, order #, comment..."
          className="w-full bg-white border border-brand-gold/40 rounded-xl py-2.5 sm:py-3 pl-11 pr-4 text-xs font-bold outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all shadow-xs placeholder:text-gray-400 text-brand-green-dark"
        />
      </div>

      {/* 🏷️ Status & Rating Filters */}
      <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
        {/* Status Tabs */}
        <div className="inline-flex items-center bg-white border border-brand-gold/30 p-1 rounded-xl shadow-xs">
          <button
            onClick={() => onStatusChange("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              statusFilter === "all"
                ? "bg-brand-green-dark text-brand-cream shadow-xs"
                : "text-gray-600 hover:text-brand-green-dark"
            }`}
          >
            All
          </button>
          <button
            onClick={() => onStatusChange("approved")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              statusFilter === "approved"
                ? "bg-emerald-700 text-white shadow-xs"
                : "text-gray-600 hover:text-emerald-700"
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => onStatusChange("hidden")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              statusFilter === "hidden"
                ? "bg-rose-700 text-white shadow-xs"
                : "text-gray-600 hover:text-rose-700"
            }`}
          >
            Hidden
          </button>
        </div>

        {/* Rating Pills */}
        <div className="inline-flex items-center bg-white border border-brand-gold/30 p-1 rounded-xl shadow-xs overflow-x-auto">
          {ratingOptions.map((r) => {
            const isSelected = ratingFilter === r;
            return (
              <button
                key={String(r)}
                onClick={() => onRatingChange(r)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? "bg-brand-gold text-brand-green-dark shadow-xs"
                    : "text-gray-600 hover:text-brand-gold"
                }`}
              >
                {r === "all" ? (
                  <span>All ★</span>
                ) : (
                  <>
                    <span>{r}</span>
                    <Star size={11} className={isSelected ? "fill-brand-green-dark" : "fill-amber-400 text-amber-400"} />
                  </>
                )}
              </button>
            );
          })}
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
