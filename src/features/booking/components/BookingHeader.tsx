"use client";

import React from "react";
import { CalendarCheck, Utensils, FileSpreadsheet, Loader2 } from "lucide-react";

interface BookingHeaderProps {
  totalBookings: number;
  pendingCount: number;
  onExportExcel?: () => void;
  isExporting?: boolean;
}

export default function BookingHeader({
  totalBookings,
  pendingCount,
  onExportExcel,
  isExporting,
}: BookingHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-brand-green-dark p-2 sm:p-4">
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-brand-green-dark border border-brand-gold flex items-center justify-center text-brand-cream shadow-md shrink-0">
          <CalendarCheck className="w-5 h-5 sm:w-6 sm:h-6" />
          {pendingCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-amber-500 text-[9px] sm:text-[10px] font-black text-white ring-2 ring-white">
              {pendingCount}
            </span>
          )}
        </div>

        <div className="text-left">
          <h1 className="text-base sm:text-2xl font-black text-brand-green-dark tracking-tight font-sans uppercase leading-tight">
            Table <span className="text-brand-gold">Reservations</span>
          </h1>

          <p className="text-[10px] sm:text-sm font-medium text-gray-600 font-sans mt-0.5 leading-tight flex items-center gap-1.5">
            <Utensils size={12} className="text-brand-gold shrink-0" />
            <span>Manage dine-in reservations & guest allocations</span>
            {pendingCount > 0 && (
              <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                {pendingCount} pending review
              </span>
            )}
          </p>
        </div>
      </div>

      {onExportExcel && (
        <button
          type="button"
          onClick={onExportExcel}
          disabled={isExporting}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-brand-green-dark hover:bg-[#16503d] text-white font-bold text-xs shadow-sm transition active:scale-95 cursor-pointer disabled:opacity-60 shrink-0"
          title="Download all table reservations into an Excel sheet"
        >
          {isExporting ? (
            <Loader2 size={15} className="animate-spin text-amber-300" />
          ) : (
            <FileSpreadsheet size={15} className="text-amber-300" />
          )}
          <span>{isExporting ? "Exporting..." : "Export Excel"}</span>
        </button>
      )}
    </header>
  );
}
