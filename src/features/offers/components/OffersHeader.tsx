"use client";

import React from "react";
import { Flame, Plus, Power, Sparkles, Image as ImageIcon } from "lucide-react";

interface OffersHeaderProps {
  isGlobalActive: boolean;
  onToggleGlobal: () => void;
  onAddNew: () => void;
  totalBanners: number;
}

export default function OffersHeader({
  isGlobalActive,
  onToggleGlobal,
  onAddNew,
  totalBanners,
}: OffersHeaderProps) {
  return (
    <header className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 text-brand-green-dark p-2 sm:p-4">
      {/* Title & Icon */}
      <div className="flex items-center gap-3">
        <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-brand-green-dark border border-brand-gold flex items-center justify-center text-brand-gold shadow-md shrink-0">
          <Flame className="w-6 h-6 animate-pulse" />
        </div>

        <div className="text-left">
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-2xl font-black text-brand-green-dark tracking-tight font-sans uppercase leading-tight">
              Offer <span className="text-brand-gold">Banners & Posters</span>
            </h1>
            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-brand-gold/20 text-brand-green-dark border border-brand-gold/40">
              {totalBanners} Saved
            </span>
          </div>

          <p className="text-[11px] sm:text-xs font-medium text-gray-600 font-sans mt-0.5 leading-tight flex items-center gap-1.5">
            <Sparkles size={13} className="text-brand-gold shrink-0" />
            <span>Store your promotional posters and switch the live customer homepage banner with 1 click</span>
          </p>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-3 self-start lg:self-auto flex-wrap">
        {/* Global Homepage Banner Visibility Toggle */}
        <div className="flex items-center gap-3 bg-white border border-brand-gold/30 px-4 py-2 rounded-2xl shadow-xs">
          <div className="text-right">
            <p className="text-[9px] font-black uppercase tracking-wider text-gray-400">
              Homepage Card
            </p>
            <p
              className={`text-xs font-black uppercase ${
                isGlobalActive ? "text-emerald-600" : "text-gray-500"
              }`}
            >
              {isGlobalActive ? "Visible (Active)" : "Hidden (OFF)"}
            </p>
          </div>

          <button
            type="button"
            onClick={onToggleGlobal}
            className={`relative inline-flex h-8 w-15 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              isGlobalActive ? "bg-emerald-600" : "bg-gray-300"
            }`}
            title="Turn Homepage Offer Card ON / OFF"
          >
            <span
              className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                isGlobalActive ? "translate-x-7 text-emerald-600" : "translate-x-0 text-gray-400"
              }`}
            >
              <Power size={13} strokeWidth={2.5} />
            </span>
          </button>
        </div>

        {/* Upload New Poster Button */}
        <button
          type="button"
          onClick={onAddNew}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-brand-green-dark hover:bg-brand-green-dark/90 text-brand-cream border border-brand-gold text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer hover:shadow-lg active:scale-95"
        >
          <Plus size={16} className="text-brand-gold stroke-[3]" />
          <span>Add New Poster</span>
        </button>
      </div>
    </header>
  );
}
