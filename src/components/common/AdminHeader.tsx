"use client";

import React, { useState, useEffect } from "react";
import ShopStatus from "./ShopStatus";
import NotificationBadge from "./NotificationBadge";
import { Menu } from "lucide-react";

interface AdminHeaderProps {
  onMenuToggle?: () => void;
}

export default function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  const [role, setRole] = useState<string>("admin");
  const [username, setUsername] = useState<string>("Admin");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(";").shift();
      };
      const cookieRole = getCookie("user_role");
      const localRole = localStorage.getItem("user_role");
      const resolvedRole = cookieRole || localRole || "employee";
      setRole(resolvedRole);

      const localUser = localStorage.getItem("username") || getCookie("username");
      if (localUser) setUsername(localUser);
    }
  }, []);

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
        {/* Only Admin controls Store Status toggle */}
        {role === "admin" && <ShopStatus />}
        <NotificationBadge />

        {/* PREMIUM ACCOUNT CONTAINER */}
        <div className="hidden md:flex items-center gap-4 pl-6 border-l border-brand-gold/20">
          <div className="text-right">
            <p className="text-[12px] font-black text-brand-cream leading-tight uppercase tracking-widest">
              {role === "admin" ? "Admin" : "Staff"}{" "}
              <span className="text-brand-gold font-normal not-italic">Portal</span>
            </p>
            
            <div className="flex justify-end mt-1 items-center gap-1.5">
              <span className="text-[10px] text-gray-300 font-semibold">{username}</span>
              <p className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-[0.1em] ${
                role === "admin" 
                  ? "text-brand-green-dark bg-brand-gold" 
                  : "text-emerald-950 bg-emerald-400"
              }`}>
                {role === "admin" ? "Administrator" : "Kitchen Staff"}
              </p>
            </div>
          </div>

          <div className="relative group">
            <div className="w-12 h-12 rounded-full bg-brand-green-light border-2 border-brand-gold shadow-[0_0_15px_rgba(220,169,99,0.15)] group-hover:scale-105 transition-transform duration-300 overflow-hidden cursor-pointer">
              <img 
                src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${username || "Admin"}&backgroundColor=DCA963`} 
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