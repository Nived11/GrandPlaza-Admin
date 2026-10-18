"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Menu, ChevronDown, Crown, ChefHat, LogOut, 
  ShoppingBag, Utensils, Settings, Phone, Mail, 
  ShieldCheck, Sparkles, User, BadgeCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ShopStatus from "./ShopStatus";
import NotificationBadge from "./NotificationBadge";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useAdminLogout } from "@/features/auth/hooks/useAdminLogout";
import axiosInstance from "@/lib/axios";

interface AdminHeaderProps {
  onMenuToggle?: () => void;
}

interface UserProfileData {
  id?: number | string;
  username?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  role?: string;
  employee_id?: string;
}

export default function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  const [role, setRole] = useState<string>("admin");
  const [username, setUsername] = useState<string>("Admin");
  const [userData, setUserData] = useState<UserProfileData | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const { logout, loggingOut, error, setError } = useAdminLogout();

  // Load user data on mount
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

      // Try reading cached admin_user_data
      try {
        const cached = localStorage.getItem("admin_user_data");
        if (cached) {
          const parsed = JSON.parse(cached);
          setUserData(parsed);
          if (parsed.username) setUsername(parsed.username);
          if (parsed.role) setRole(parsed.role);
        }
      } catch (e) {
        console.error("Failed to parse cached admin_user_data", e);
      }

      // Fetch fresh profile data from backend
      axiosInstance
        .get("/accounts/profile")
        .then((res) => {
          if (res.data?.data) {
            const data = res.data.data;
            setUserData((prev) => ({ ...prev, ...data }));
            if (data.username) setUsername(data.username);
            if (data.role) setRole(data.role);
            localStorage.setItem("admin_user_data", JSON.stringify(data));
          }
        })
        .catch(() => {
          // Graceful fallback to stored state
        });
    }
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsProfileOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const isAdmin = role === "admin";
  const displayName = userData?.first_name 
    ? `${userData.first_name} ${userData.last_name || ""}`.trim() 
    : username || (isAdmin ? "Administrator" : "Staff Member");

  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || (isAdmin ? "AD" : "ST");

  const handleLogoutConfirm = async () => {
    const success = await logout();
    if (success) {
      setIsLogoutModalOpen(false);
    }
  };

  return (
    <header className="h-24 empire-geometric-bg px-4 md:px-8 flex items-center justify-between md:justify-end shadow-md relative z-40">
      
      {/* Mobile Sidebar Toggle Trigger */}
      <button 
        onClick={onMenuToggle}
        aria-label="Toggle Navigation Menu"
        className="md:hidden p-2 text-brand-gold bg-brand-green-light/40 rounded-xl border border-brand-gold/30 active:scale-90 transition-all cursor-pointer"
      >
        <Menu size={20} />
      </button>

      {/* Right Controls Container */}
      <div className="flex items-center gap-3 md:gap-6">
        
        {/* Only Admin controls Store Status toggle */}
        {isAdmin && <ShopStatus />}

        {/* Notifications */}
        <NotificationBadge />

        {/* 🌟 ENHANCED PROFILE BADGE & INTERACTIVE DROPDOWN */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsProfileOpen((prev) => !prev)}
            aria-label="Toggle User Profile Menu"
            aria-expanded={isProfileOpen}
            className={`flex items-center gap-2.5 md:gap-3.5 p-1.5 md:py-2 md:px-3 rounded-2xl border transition-all duration-300 cursor-pointer ${
              isProfileOpen 
                ? "bg-brand-green-light/80 border-brand-gold shadow-[0_0_20px_rgba(220,169,99,0.3)] ring-1 ring-brand-gold/50" 
                : "bg-brand-green-dark/60 hover:bg-brand-green-light/50 border-brand-gold/30 hover:border-brand-gold/70 shadow-sm"
            }`}
          >
            {/* Avatar with Online Dot */}
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-gradient-to-br from-brand-gold/30 to-brand-green-light border-2 border-brand-gold flex items-center justify-center shadow-md overflow-hidden">
                <span className="font-serif font-black text-xs md:text-sm text-brand-gold tracking-tight">
                  {initials}
                </span>
              </div>
              <span 
                className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-brand-green-dark rounded-full shadow-sm" 
                title="Online & Active"
              />
            </div>

            {/* Desktop User Details & Prominent Role Badge */}
            <div className="hidden sm:flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs md:text-sm font-bold text-brand-cream leading-tight truncate max-w-[130px]">
                  {displayName}
                </span>
                <ChevronDown 
                  size={14} 
                  className={`text-brand-gold transition-transform duration-300 ${isProfileOpen ? "rotate-180" : ""}`} 
                />
              </div>

              {/* Distinction: Admin vs Kitchen Staff */}
              <div className="mt-1 flex items-center gap-1.5">
                {isAdmin ? (
                  <span className="inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-amber-950 uppercase tracking-widest shadow-xs">
                    <Crown size={10} className="fill-amber-950" />
                    SUPER ADMIN
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-emerald-950 uppercase tracking-widest shadow-xs">
                    <ChefHat size={10} className="fill-emerald-950" />
                    KITCHEN STAFF
                  </span>
                )}
              </div>
            </div>

            {/* Mobile-only compact chevron */}
            <ChevronDown 
              size={14} 
              className={`sm:hidden text-brand-gold transition-transform duration-300 ${isProfileOpen ? "rotate-180" : ""}`} 
            />
          </button>

          {/* 🌟 LUXURY PROFILE DROPDOWN MENU */}
          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="absolute right-0 top-full mt-3 w-80 md:w-92 max-w-[92vw] bg-brand-green-dark/95 backdrop-blur-xl border border-brand-gold/40 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.65)] overflow-hidden z-50 divide-y divide-brand-gold/15"
              >
                {/* 1. Header Hero Card with Role Accent */}
                <div className={`p-5 relative ${
                  isAdmin 
                    ? "bg-gradient-to-br from-amber-950/40 via-brand-green-dark to-brand-green-light/30" 
                    : "bg-gradient-to-br from-emerald-950/40 via-brand-green-dark to-brand-green-light/30"
                }`}>
                  <div className="flex items-start gap-3.5">
                    {/* Big Avatar */}
                    <div className="relative">
                      <div className="w-14 h-14 rounded-2xl bg-brand-green-light border-2 border-brand-gold/80 flex items-center justify-center shadow-lg">
                        <span className="font-serif font-black text-xl text-brand-gold">
                          {initials}
                        </span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-brand-green-dark rounded-full shadow" />
                    </div>

                    {/* Name & Identity */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-bold text-brand-cream truncate leading-tight">
                        {displayName}
                      </h4>
                      <p className="text-xs text-brand-gold font-medium mt-0.5 truncate">
                        @{username}
                      </p>

                      {/* Role Pill */}
                      <div className="mt-2 flex items-center gap-2 flex-wrap">
                        {isAdmin ? (
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-black px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/50 uppercase tracking-wider">
                            <Crown size={12} className="text-amber-400" />
                            Super Administrator
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-black px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 uppercase tracking-wider">
                            <ChefHat size={12} className="text-emerald-400" />
                            Kitchen & Orders Staff
                          </span>
                        )}

                        {userData?.employee_id && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-brand-green-light/60 text-brand-cream/80 border border-brand-gold/20">
                            ID: {userData.employee_id}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Contact Details & Access Level Summary */}
                <div className="p-4 space-y-2.5 text-xs text-brand-cream/80 bg-brand-green-dark/40">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck size={14} className="text-brand-gold shrink-0" />
                    <span className="text-[11px] font-medium leading-snug text-brand-cream/90">
                      {isAdmin 
                        ? "Full Access: Financials, Staff, Menu, Orders & Settings" 
                        : "Operations Access: Live Kitchen Orders & Menu Availability"}
                    </span>
                  </div>

                  {userData?.email && (
                    <div className="flex items-center gap-2.5 text-brand-cream/70">
                      <Mail size={13} className="text-brand-gold shrink-0" />
                      <span className="truncate text-[11px]">{userData.email}</span>
                    </div>
                  )}

                  {userData?.phone_number && (
                    <div className="flex items-center gap-2.5 text-brand-cream/70">
                      <Phone size={13} className="text-brand-gold shrink-0" />
                      <span className="text-[11px] font-mono">{userData.phone_number}</span>
                    </div>
                  )}
                </div>

                {/* 3. Quick Navigation Links */}
                <div className="p-2 space-y-1">
                  <Link
                    href="/orders"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-brand-cream hover:text-white hover:bg-brand-green-light/60 transition-colors"
                  >
                    <ShoppingBag size={15} className="text-brand-gold" />
                    <span>Live Kitchen Orders</span>
                    <span className="ml-auto text-[10px] px-2 py-0.5 rounded bg-brand-green-light border border-brand-gold/20 text-brand-gold font-bold">
                      POS
                    </span>
                  </Link>

                  <Link
                    href="/menu"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-brand-cream hover:text-white hover:bg-brand-green-light/60 transition-colors"
                  >
                    <Utensils size={15} className="text-brand-gold" />
                    <span>Menu & Item Availability</span>
                  </Link>

                  {isAdmin && (
                    <Link
                      href="/settings"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-brand-cream hover:text-white hover:bg-brand-green-light/60 transition-colors"
                    >
                      <Settings size={15} className="text-brand-gold" />
                      <span>System Settings</span>
                    </Link>
                  )}
                </div>

                {/* 4. Logout Action Button */}
                <div className="p-3 bg-brand-green-dark/80">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      if (setError) setError(null);
                      setIsLogoutModalOpen(true);
                    }}
                    disabled={loggingOut}
                    className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl bg-red-950/50 hover:bg-red-900/60 border border-red-500/30 text-red-400 hover:text-red-300 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
                  >
                    <LogOut size={15} />
                    <span>Log Out of Suite</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Confirmation Modal for Header Sign Out */}
      <ConfirmModal 
        isOpen={isLogoutModalOpen}
        onClose={() => {
          setIsLogoutModalOpen(false);
          if (setError) setError(null);
        }}
        onConfirm={handleLogoutConfirm}
        title="Confirm Logout"
        description="Are you sure you want to sign out of the management suite?"
        confirmText="Sign Out"
        cancelText="Cancel"
        isLoading={loggingOut}
        error={error}
      />
    </header>
  );
}