"use client";

import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, RefreshCcw } from "lucide-react";

interface PaginationProps {
  page: number;
  totalCount: number;
  pageSize?: number;
  onPageChange: (newPage: number) => void;
  isLoading?: boolean;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

export default function Pagination({
  page,
  totalCount,
  pageSize = 10,
  onPageChange,
  isLoading = false,
  hasNextPage,
  hasPreviousPage,
}: PaginationProps) {
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  // Next / Prev enable/disable calculation
  const canGoPrev = hasPreviousPage !== undefined ? hasPreviousPage : page > 1;
  const canGoNext = hasNextPage !== undefined ? hasNextPage : page < totalPages;

  const handlePageSelect = (targetPage: number) => {
    if (targetPage < 1 || targetPage > totalPages || targetPage === page || isLoading) return;
    onPageChange(targetPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (totalCount <= 0) return null;

  return (
    <div className="flex flex-col items-center justify-center gap-5 py-10 border-t border-brand-gold/20">
      <div className="flex items-center gap-2 md:gap-3">
        
        {/* ⏪ First Page Button */}
        <button 
          onClick={() => handlePageSelect(1)}
          disabled={page === 1 || isLoading}
          aria-label="First page"
          className="p-2.5 rounded-xl border border-brand-gold/40 disabled:opacity-50 disabled:cursor-not-allowed bg-white hover:bg-brand-green-dark hover:text-brand-gold text-brand-green-dark transition-all cursor-pointer shadow-sm"
        >
          <ChevronsLeft size={16} strokeWidth={2.5} />
        </button>

        {/* ◀️ Previous Page Button */}
        <button 
          onClick={() => handlePageSelect(page - 1)}
          disabled={!canGoPrev || isLoading}
          aria-label="Previous page"
          className="p-2.5 rounded-xl border border-brand-gold/40 disabled:opacity-50 disabled:cursor-not-allowed bg-white hover:bg-brand-green-dark hover:text-brand-gold text-brand-green-dark transition-all cursor-pointer shadow-sm"
        >
          <ChevronLeft size={16} strokeWidth={2.5} />
        </button>

        {/* 🏷️ Current Page Display / Loading Spinner */}
        <div className="relative min-w-[120px] flex items-center justify-center bg-brand-green-dark border border-brand-gold px-6 py-2.5 rounded-xl shadow-md">
          {isLoading ? (
            <div className="flex items-center gap-2 text-brand-gold">
              <RefreshCcw size={12} className="animate-spin" />
              <span className="text-[10px] font-black uppercase tracking-widest">Loading</span>
            </div>
          ) : (
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-gold">
              Page {page} of {totalPages}
            </span>
          )}
        </div>

        {/* ▶️ Next Page Button */}
        <button 
          onClick={() => handlePageSelect(page + 1)}
          disabled={!canGoNext || isLoading}
          aria-label="Next page"
          className="p-2.5 rounded-xl border border-brand-gold/40 disabled:opacity-50 disabled:cursor-not-allowed bg-white hover:bg-brand-green-dark hover:text-brand-gold text-brand-green-dark transition-all cursor-pointer shadow-sm"
        >
          <ChevronRight size={16} strokeWidth={2.5} />
        </button>

        {/* ⏩ Last Page Button */}
        <button 
          onClick={() => handlePageSelect(totalPages)}
          disabled={page >= totalPages || !canGoNext || isLoading}
          aria-label="Last page"
          className="p-2.5 rounded-xl border border-brand-gold/40 disabled:opacity-50 disabled:cursor-not-allowed bg-white hover:bg-brand-green-dark hover:text-brand-gold text-brand-green-dark transition-all cursor-pointer shadow-sm"
        >
          <ChevronsRight size={16} strokeWidth={2.5} />
        </button>

      </div>
    </div>
  );
}