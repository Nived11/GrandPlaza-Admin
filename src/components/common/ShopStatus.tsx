"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Loader2, Power } from "lucide-react";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";

interface ShopStatusProps {
  isCollapsed?: boolean;
}

interface SiteSettingsResponse {
  is_manually_open?: boolean;
  isManuallyOpen?: boolean;
  is_open?: boolean;
  isOpen?: boolean;
  opening_time?: string | null;
  openingTime?: string | null;
  closing_time?: string | null;
  closingTime?: string | null;
}

export default function ShopStatus({ isCollapsed = false }: ShopStatusProps) {
  const [isManuallyOpen, setIsManuallyOpen] = useState(true);
  const [isOpen, setIsOpen] = useState(true);
  const [openingTime, setOpeningTime] = useState<string | null>(null);
  const [closingTime, setClosingTime] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch real store status from backend (always fresh for admin)
  const fetchStatus = useCallback(async () => {
    try {
      const res = await axiosInstance.get(`/settings/site-settings?_t=${Date.now()}`, {
        headers: { "Cache-Control": "no-cache" },
      });
      if (res.data) {
        const d: SiteSettingsResponse = res.data;
        const manualOpen = d.is_manually_open ?? d.isManuallyOpen ?? true;
        const openNow = d.is_open ?? d.isOpen ?? true;
        setIsManuallyOpen(Boolean(manualOpen));
        setIsOpen(Boolean(openNow));
        setOpeningTime(d.opening_time ?? d.openingTime ?? null);
        setClosingTime(d.closing_time ?? d.closingTime ?? null);
      }
    } catch (err) {
      console.error("Failed to load store status", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();

    // Listen for cross-component sync event (e.g. from Settings page)
    const handleStatusEvent = (e: Event) => {
      // Don't re-fetch if this component triggered the toggle itself
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.origin === "ShopStatus") {
        return;
      }
      fetchStatus();
    };

    window.addEventListener("store-status-changed", handleStatusEvent);
    return () => {
      window.removeEventListener("store-status-changed", handleStatusEvent);
    };
  }, [fetchStatus]);

  // Real backend toggle
  const handleToggle = async () => {
    if (isUpdating) return;

    const nextManualState = !isManuallyOpen;
    setIsUpdating(true);

    try {
      const payload = {
        is_manually_open: nextManualState,
        isManuallyOpen: nextManualState,
      };

      const res = await axiosInstance.patch("/settings/site-settings", payload);
      
      const newManual = res.data?.is_manually_open ?? res.data?.isManuallyOpen ?? nextManualState;
      const newOpen = res.data?.is_open ?? res.data?.isOpen ?? nextManualState;
      
      setIsManuallyOpen(Boolean(newManual));
      setIsOpen(Boolean(newOpen));

      if (!newManual) {
        toast.error("Store marked MANUALLY CLOSED. Customer ordering paused immediately.");
      } else {
        toast.success("Store marked OPEN. Online ordering enabled.");
      }

      // Notify other components (like Settings page) with origin tag
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("store-status-changed", { detail: { origin: "ShopStatus" } })
        );
      }
    } catch (err: any) {
      console.error("Failed to update store status", err);
      toast.error(err?.response?.data?.detail || "Failed to update store status. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Determine display label and badge styling
  const isCurrentlyOpen = isManuallyOpen && isOpen;

  return (
    <div
      className={`flex items-center gap-2 md:gap-3 bg-white/10 hover:bg-white/15 border border-brand-gold/30 p-1 md:p-1.5 rounded-xl md:rounded-2xl transition-all duration-300 ${
        isCollapsed ? "justify-center w-10 h-10 md:w-12 md:h-12 p-0" : "pr-3 md:pr-4"
      }`}
    >
      <div className="flex items-center gap-1.5 md:gap-2">
        <button
          type="button"
          onClick={handleToggle}
          disabled={isUpdating || isLoading}
          title={
            isCurrentlyOpen
              ? "Click to CLOSE restaurant for customer orders"
              : "Click to OPEN restaurant for customer orders"
          }
          className={`relative rounded-full transition-all duration-300 overflow-hidden cursor-pointer disabled:opacity-50 shrink-0 ${
            isCurrentlyOpen
              ? "bg-emerald-500/30 border border-emerald-400/40"
              : "bg-red-500/30 border border-red-400/40"
          } ${isCollapsed ? "w-7 h-3.5 md:w-8 md:h-4" : "w-10 h-5 md:w-12 md:h-6"}`}
        >
          {isUpdating || isLoading ? (
            <Loader2 size={10} className="animate-spin mx-auto text-white mt-1" />
          ) : (
            <div
              className={`absolute top-0.5 rounded-full transition-all duration-300 shadow-sm h-3.5 w-3.5 md:h-4 md:w-4 flex items-center justify-center ${
                isCurrentlyOpen
                  ? "bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.7)] left-6 md:left-7"
                  : "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.7)] left-0.5"
              }`}
            >
              <Power size={8} className="text-white" strokeWidth={3} />
            </div>
          )}
        </button>

        {!isCollapsed && (
          <div className="flex flex-col text-left cursor-pointer" onClick={handleToggle}>
            <span
              className={`text-[8px] md:text-[10px] font-black uppercase tracking-tight leading-none ${
                isCurrentlyOpen ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {!isManuallyOpen
                ? "Manual Closed"
                : !isOpen
                ? "Hours Closed"
                : "Shop Open"}
            </span>

            <div className="flex items-center gap-1 mt-0.5">
              <div
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  isCurrentlyOpen
                    ? "bg-emerald-400 animate-pulse"
                    : "bg-red-500"
                }`}
              />
              <span className="text-[7px] text-brand-cream/80 font-bold uppercase tracking-widest leading-none">
                {!isManuallyOpen
                  ? "Orders Paused"
                  : !isOpen
                  ? "Outside Hours"
                  : "In Working Hours"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}