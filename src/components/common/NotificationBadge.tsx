"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bell, ShoppingBag, Calendar, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotificationBadge() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  const notifications = [
    { type: "order", message: "New order received #8942", count: 1, link: "/orders" },
    { type: "booking", message: "Table reservation request", count: 1, link: "/bookings" }
  ];

  const totalUnread = notifications.length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer relative p-2.5 md:p-3.5 bg-white/5 border border-brand-gold/20 text-brand-cream hover:border-brand-gold transition-all duration-300 group rounded-xl md:rounded-2xl active:scale-95"
      >
        <Bell className={`w-[18px] h-[18px] md:w-[20px] md:h-[20px] transition-transform text-brand-gold ${isOpen ? 'rotate-12' : 'group-hover:rotate-12'}`} />
        
        {totalUnread > 0 && (
          <span className="absolute -top-1 -right-1 md:-top-1.5 md:-right-1.5 min-w-[16px] md:min-w-[20px] h-4 md:h-5 bg-brand-gold text-brand-green-dark text-[8px] md:text-[10px] font-black px-1 flex items-center justify-center rounded-md md:rounded-lg border-2 border-brand-green-dark shadow-lg">
            {totalUnread}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-65 md:w-80 bg-brand-green-dark border border-brand-gold/40 rounded-[1.5rem] shadow-2xl overflow-hidden z-[110] animate-in fade-in zoom-in duration-200 origin-top-right">
          <div className="p-4 border-b border-white/5 bg-brand-green-light/10 text-left">
            <h4 className="text-[10px] font-black text-brand-cream uppercase tracking-[0.2em]">Live Updates</h4>
          </div>

          <div className="max-h-[350px] overflow-y-auto">
            {notifications.map((notif, index) => (
              <button
                key={index}
                onClick={() => {
                  router.push(notif.link);
                  setIsOpen(false);
                }}
                className="cursor-pointer w-full flex items-center justify-between p-4 hover:bg-brand-green-light/40 border-b border-white/5 transition-colors group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-gold/10 flex items-center justify-center text-brand-gold group-hover:scale-110 transition-transform">
                    {notif.type === "order" ? <ShoppingBag size={14} /> : <Calendar size={14} />}
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-brand-cream group-hover:text-white transition-colors leading-tight italic">
                      {notif.message}
                    </p>
                    <span className="text-[8px] text-brand-cream/60 font-semibold uppercase tracking-widest mt-1 block">
                      Click to manage
                    </span>
                  </div>
                </div>
                <ChevronRight size={14} className="text-brand-gold/40 group-hover:text-brand-gold transition-colors" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}