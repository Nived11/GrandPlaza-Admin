"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, ShoppingBag, Utensils, 
  Star, Users, DollarSign, LogOut, Mail, 
  ChevronLeft, ChevronRight, X, BookIcon, Settings 
} from "lucide-react";

interface AdminSidebarProps {
  isExpanded: boolean;
  setIsExpanded: (val: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (val: boolean) => void;
}

export default function AdminSidebar({ isExpanded, setIsExpanded, isMobileOpen, setIsMobileOpen }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  
  const navLinks = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={20} /> },
    { name: "Live Orders", path: "/orders", icon: <ShoppingBag size={20} /> },
    { name: "Menu", path: "/menu", icon: <Utensils size={20} /> },
    { name: "Bookings", path: "/bookings", icon: <BookIcon size={20} /> },
    { name: "Inbox", path: "/inbox", icon: <Mail size={20} /> }, 
    { name: "Reviews", path: "/reviews", icon: <Star size={20} /> },
    { name: "Customers", path: "/customers", icon: <Users size={20} /> },
    { name: "Revenue", path: "/revenue", icon: <DollarSign size={20} /> },
    { name: "Settings", path: "/settings", icon: <Settings size={20} /> },
  ];

  const handleLogoutAction = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
      router.push("/login");
    }
  };

  const isFull = isExpanded || isMobileOpen;

  return (
    <>
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/70 z-[90] md:hidden backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
      )}

      <aside className={`h-[100dvh] empire-geometric-bg text-brand-cream flex flex-col z-[100] transition-all duration-500 ease-in-out fixed md:sticky top-0 left-0
        ${isMobileOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0"}
        ${isExpanded ? "md:w-60" : "md:w-24"}`}>
        
        {/* BRAND HEADER FRAME (No borders) */}
        <div className="h-24 flex items-center justify-between px-6 flex-shrink-0 relative">
          <div className="w-full flex items-center justify-between">
            {isFull ? (
              <div className="flex flex-col text-left">
                <span className="font-serif font-black text-brand-cream tracking-widest text-lg leading-none">èmpire plaza</span>
                <span className="text-[9px] text-brand-gold tracking-[0.3em] font-bold uppercase mt-1">Management Suite</span>
              </div>
            ) : (
              <span className="text-center font-serif font-black text-brand-gold text-2xl mx-auto tracking-tighter">èp</span>
            )}
            
            {isMobileOpen && (
              <button onClick={() => setIsMobileOpen(false)} className="p-2 text-brand-gold bg-brand-green-light rounded-xl border border-brand-gold/30 md:hidden cursor-pointer">
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* FIXED POSITION: SIDEBAR EXPAND HANDLER RIGHT AT THE CENTER */}
        {!isMobileOpen && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)} 
            className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-brand-gold text-brand-green-dark rounded-full hidden md:flex items-center justify-center shadow-2xl z-[110] border-2 border-brand-green-dark hover:scale-115 transition-all cursor-pointer"
          >
            {isExpanded ? <ChevronLeft size={14} strokeWidth={3} /> : <ChevronRight size={14} strokeWidth={3} />}
          </button>
        )}

        {/* NAVIGATION MATRIX PLATFORM */}
        <nav className="flex-1 px-4 py-2 space-y-2 overflow-y-auto no-scrollbar">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;

            return (
              <Link 
                key={link.path} 
                href={link.path} 
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center transition-all duration-300 relative group rounded-xl py-3.5 cursor-pointer
                  ${isActive 
                    ? "bg-brand-cream text-brand-green-dark font-black shadow-lg border-l-4 border-brand-gold" 
                    : "text-brand-cream/70 hover:text-white hover:bg-brand-green-light/40 hover:border-l-4 hover:border-brand-gold/50"} 
                  ${isFull ? "px-6 gap-4" : "justify-center"}`}
              >
                <div className={`flex-shrink-0 transition-transform duration-300 ${isActive ? 'scale-110 text-brand-green-dark' : 'text-brand-gold'}`}>
                  {link.icon}
                </div>
                
                {isFull ? (
                  <span className="text-[12px] font-bold uppercase tracking-widest whitespace-nowrap">
                    {link.name}
                  </span>
                ) : (
                  <div className="fixed left-[100px] bg-brand-cream text-brand-green-dark text-[10px] font-black px-3 py-2 rounded-md 
                    invisible group-hover:visible opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0
                    transition-all duration-200 uppercase whitespace-nowrap z-[999] shadow-2xl border border-brand-gold/30">
                    {link.name}
                    <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-brand-cream rotate-45" />
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* SYSTEM DISCONNECT PORT */}
        <div className="p-4 flex-shrink-0">
          <button 
            onClick={handleLogoutAction}
            className={`flex items-center rounded-xl transition-all duration-300 py-3.5 relative group w-full bg-red-950/40 hover:bg-red-900/40 border border-brand-gold/20 text-red-500 hover:text-red-600 cursor-pointer
              ${isFull ? "px-6 gap-4" : "justify-center"}`}
          >
            <LogOut size={18} className="flex-shrink-0" />
            {isFull ? (
              <span className="text-[12px] font-bold uppercase tracking-widest">logout</span>
            ) : (
              <div className="fixed left-[100px] bg-red-900 text-white text-[10px] font-black px-3 py-2 rounded-md 
                invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all 
                uppercase whitespace-nowrap z-[999] shadow-2xl border border-red-500">
                Logout
                <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-red-900 rotate-45" />
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}