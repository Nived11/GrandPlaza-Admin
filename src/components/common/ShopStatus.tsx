"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";

interface ShopStatusProps {
  isCollapsed?: boolean;
}

export default function ShopStatus({ isCollapsed = false }: ShopStatusProps) {
  const [isManuallyOpen, setIsManuallyOpen] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = () => {
    setIsUpdating(true);
    setTimeout(() => {
      setIsManuallyOpen(!isManuallyOpen);
      setIsUpdating(false);
    }, 800);
  };

  return (
    <div className={`flex items-center gap-2 md:gap-3 bg-white/10 border border-white/10 p-1 md:p-1.5 rounded-xl md:rounded-2xl transition-all duration-300 ${
      isCollapsed ? 'justify-center w-10 h-10 md:w-12 md:h-12 p-0' : 'pr-3 md:pr-4'
    }`}>
      <div className="flex items-center gap-1.5 md:gap-2">
        <button 
          onClick={handleToggle}
          disabled={isUpdating}
          className={`relative rounded-full transition-all duration-500 overflow-hidden cursor-pointer disabled:opacity-50 bg-[#1A1A1A]
            ${isManuallyOpen ? 'bg-emerald-500/30 border border-emerald-300/20' : 'bg-red-500/20 border border-red-500/30'} 
            ${isCollapsed ? 'w-7 h-3.5 md:w-8 md:h-4' : 'w-10 h-5 md:w-12 md:h-6'}`}
        >
          {isUpdating ? (
            <Loader2 size={10} className="animate-spin mx-auto text-white" />
          ) : (
            <div className={`absolute top-0.5 rounded-full transition-all duration-500 shadow-sm h-3.5 w-3.5 md:h-4 md:w-4
              ${isManuallyOpen ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'} 
              ${isCollapsed 
                  ? (isManuallyOpen ? 'left-3' : 'left-0.5') 
                  : (isManuallyOpen ? 'left-6 md:left-7' : 'left-0.5')}`} 
            />
          )}
        </button>
        
        {!isCollapsed && (
          <div className="flex flex-col text-left">
            <span className={`text-[8px] md:text-[10px] font-black uppercase tracking-tighter leading-none 
              ${!isManuallyOpen ? 'text-red-500' : 'text-green-400'}`}>
              {!isManuallyOpen ? 'Manual Closed' : 'Shop Open'}
            </span>

            <div className="flex items-center gap-1 mt-0.5">
              <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[6px] text-gray-200 font-bold uppercase tracking-widest">
                In Working Hours
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}