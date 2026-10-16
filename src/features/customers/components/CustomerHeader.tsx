"use client";

import React from "react";
import { Users, FileSpreadsheet, Loader2 } from "lucide-react";

interface CustomerHeaderProps {
  onExportExcel?: () => void;
  isExporting?: boolean;
}

export default function CustomerHeader({
  onExportExcel,
  isExporting,
}: CustomerHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-brand-green-dark p-2 sm:p-6">
      <div className="flex items-center gap-3">

        <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-brand-green-dark border border-brand-gold flex items-center justify-center text-brand-cream shadow-md shrink-0">
          <Users className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>

        <div className="text-left">
          <h1 className="text-base sm:text-2xl font-black text-brand-green-dark tracking-tight font-sans uppercase leading-tight">
            Customer <span className="text-brand-gold">Management</span>
          </h1>

          <p className="text-[10px] sm:text-sm font-medium text-gray-600 font-sans mt-0.5 leading-tight">
            Manage customer patrons and purchase histories
          </p>
        </div>

      </div>

      {onExportExcel && (
        <button
          type="button"
          onClick={onExportExcel}
          disabled={isExporting}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-brand-green-dark hover:bg-[#16503d] text-white font-bold text-xs shadow-sm transition active:scale-95 cursor-pointer disabled:opacity-60 shrink-0"
          title="Download customers list into an Excel sheet"
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