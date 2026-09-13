"use client";

import React from "react";
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  CheckCheck,
  XCircle,
} from "lucide-react";

interface BookingStatsProps {
  totalCount: number;
  pendingCount: number;
  confirmedCount: number;
  completedCount: number;
  cancelledCount: number;
  activeStatus: string;
  onSelectStatus: (status: string) => void;
}

export default function BookingStats({
  totalCount,
  pendingCount,
  confirmedCount,
  completedCount,
  cancelledCount,
  activeStatus,
  onSelectStatus,
}: BookingStatsProps) {
  const cards = [
    {
      key: "all",
      title: "All Bookings",
      count: totalCount,
      icon: CalendarDays,
      bg: "bg-brand-green-dark/5",
      border: "border-brand-green-dark/20",
      activeBorder: "border-brand-green-dark ring-2 ring-brand-green-dark/20",
      text: "text-brand-green-dark",
      iconColor: "text-brand-green-dark",
    },
    {
      key: "pending",
      title: "Pending",
      count: pendingCount,
      icon: Clock,
      bg: "bg-amber-50",
      border: "border-amber-200",
      activeBorder: "border-amber-500 ring-2 ring-amber-500/20",
      text: "text-amber-900",
      iconColor: "text-amber-600",
    },
    {
      key: "confirmed",
      title: "Confirmed",
      count: confirmedCount,
      icon: CheckCircle2,
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      activeBorder: "border-emerald-600 ring-2 ring-emerald-600/20",
      text: "text-emerald-900",
      iconColor: "text-emerald-600",
    },
    {
      key: "completed",
      title: "Completed",
      count: completedCount,
      icon: CheckCheck,
      bg: "bg-teal-50",
      border: "border-teal-200",
      activeBorder: "border-teal-600 ring-2 ring-teal-600/20",
      text: "text-teal-900",
      iconColor: "text-teal-600",
    },
    {
      key: "cancelled",
      title: "Cancelled",
      count: cancelledCount,
      icon: XCircle,
      bg: "bg-rose-50",
      border: "border-rose-200",
      activeBorder: "border-rose-500 ring-2 ring-rose-500/20",
      text: "text-rose-900",
      iconColor: "text-rose-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3 px-2 sm:px-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = activeStatus === card.key;

        return (
          <button
            key={card.key}
            type="button"
            onClick={() => onSelectStatus(card.key)}
            className={`p-3 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer shadow-xs ${
              card.bg
            } ${isActive ? card.activeBorder : card.border} hover:scale-[1.02]`}
          >
            <div className="flex items-center justify-between gap-1 mb-1.5">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-gray-500 truncate">
                {card.title}
              </span>
              <Icon size={16} className={`shrink-0 ${card.iconColor}`} />
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className={`text-xl sm:text-2xl font-black font-sans ${card.text}`}>
                {card.count}
              </span>
              <span className="text-[9px] font-bold text-gray-400 uppercase">
                guests
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
