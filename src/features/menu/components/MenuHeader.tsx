"use client";

import React from "react";
import { UtensilsCrossed } from "lucide-react";

export default function MenuHeader() {
  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-brand-green-dark p-2 sm:p-6">
      <div className="flex items-center gap-3">
        {/* ICON BOX */}
        <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-brand-green-dark border border-brand-gold flex items-center justify-center text-brand-cream shadow-md shrink-0">
          <UtensilsCrossed className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        
        {/* TEXT CONTENT */}
        <div className="text-left">
          <h1 className="text-base sm:text-2xl font-black text-brand-green-dark tracking-tight font-sans uppercase leading-tight">
            Menu <span className="text-brand-gold">Management</span>
          </h1>
          <p className="text-[10px] sm:text-sm font-medium text-gray-600 font-sans mt-0.5 leading-tight">
            Manage restaurant categories, food items, and pricing
          </p>
        </div>
      </div>
    </header>
  );
}