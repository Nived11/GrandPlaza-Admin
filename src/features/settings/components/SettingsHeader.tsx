"use client";

import React from "react";
import { Sliders, Store, Power } from "lucide-react";

interface SettingsHeaderProps {
  isManuallyOpen: boolean;
  isOpenStatus?: boolean;
  onToggleShop: () => void;
}

export default function SettingsHeader({
  isManuallyOpen,
  isOpenStatus,
  onToggleShop,
}: SettingsHeaderProps) {
  const storeIsOpen = isManuallyOpen && (isOpenStatus !== false);

  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-brand-green-dark p-2 sm:p-4">
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-brand-green-dark border border-brand-gold flex items-center justify-center text-brand-gold shadow-md shrink-0">
          <Sliders className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>

        <div className="text-left">
          <h1 className="text-base sm:text-2xl font-black text-brand-green-dark tracking-tight font-sans uppercase leading-tight">
            Store <span className="text-brand-gold">Settings</span>
          </h1>

          <p className="text-[10px] sm:text-sm font-medium text-gray-600 font-sans mt-0.5 leading-tight flex items-center gap-1.5">
            <Store size={13} className="text-brand-gold shrink-0" />
            <span>Configure restaurant profile, working hours, delivery radius & FAQs</span>
          </p>
        </div>
      </div>

      {/* Live Store Toggle Switch */}
      <div className="flex items-center gap-3 bg-white border border-brand-gold/30 px-4 py-2.5 rounded-2xl shadow-xs self-start sm:self-auto">
        <div className="text-right">
          <p className="text-[9px] font-black uppercase tracking-wider text-gray-400">
            Store Status
          </p>
          <p className={`text-xs font-black uppercase ${
            storeIsOpen ? "text-emerald-700" : "text-rose-700"
          }`}>
            {storeIsOpen ? "Shop Open" : "Shop Closed"}
          </p>
        </div>

        <button
          type="button"
          onClick={onToggleShop}
          className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            storeIsOpen ? "bg-emerald-600" : "bg-gray-300"
          }`}
          title="Click to toggle shop open/closed"
        >
          <span
            className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
              storeIsOpen ? "translate-x-7 text-emerald-600" : "translate-x-0 text-gray-400"
            }`}
          >
            <Power size={12} strokeWidth={2.5} />
          </span>
        </button>
      </div>
    </header>
  );
}
