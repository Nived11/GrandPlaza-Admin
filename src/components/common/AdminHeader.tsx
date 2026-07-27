"use client";

import React from "react";
import ShopStatus from "./ShopStatus";
import NotificationBadge from "./NotificationBadge";
import { Menu } from "lucide-react";

interface AdminHeaderProps {
  onMenuToggle?: () => void;
}

export default function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  return (
    <header className="h-24 empire-geometric-bg px-6 md:px-10 flex items-center justify-between md:justify-end shadow-md relative">
      
      {/* Mobile Toggle Trigger */}
      <button 
        onClick={onMenuToggle}
        className="md:hidden p-2 text-brand-gold bg-brand-green-light/40 rounded-xl border border-brand-gold/30 active:scale-90 transition-all cursor-pointer"
      >
        <Menu size={20} />
      </button>

      <div className="flex items-center gap-4 md:gap-6">
        <ShopStatus />
        <NotificationBadge />

        {/* PREMIUM ACCOUNT CONTAINER - Mobile-il entire profile text & avatar hide aakum */}
        <div className="hidden md:flex items-center gap-5 pl-8 border-l border-brand-gold/20">
          <div className="text-right">
            <p className="text-[12px] font-black text-brand-cream leading-tight uppercase tracking-widest">
              Admin <span className="text-brand-gold font-normal not-italic">Portal</span>
            </p>
            
            <div className="flex justify-end mt-1">
              <p className="text-[8px] font-black text-brand-green-dark bg-brand-gold px-2 py-0.5 rounded uppercase tracking-[0.1em]">
                Administrator
              </p>
            </div>
          </div>

          <div className="relative group">
            <div className="w-12 h-12 rounded-full bg-brand-green-light border-2 border-brand-gold shadow-[0_0_15px_rgba(220,169,99,0.15)] group-hover:scale-105 transition-transform duration-300 overflow-hidden cursor-pointer">
              <img 
                src="https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Admin&backgroundColor=DCA963" 
                alt="profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-brand-green-dark rounded-full shadow-sm"></div>
          </div>
        </div>

      </div>
    </header>
  );
}