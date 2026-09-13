"use client";

import React from "react";
import {
  Star,
  CheckCircle2,
  EyeOff,
  Sparkles,
  MessageSquare,
} from "lucide-react";

interface ReviewsStatsProps {
  total: number;
  averageRating: number;
  approvedCount: number;
  hiddenCount: number;
  fiveStarCount: number;
  activeStatus: "all" | "approved" | "hidden";
  onSelectStatus: (status: "all" | "approved" | "hidden") => void;
  activeRating: number | "all";
  onSelectRating: (rating: number | "all") => void;
}

export default function ReviewsStats({
  total,
  averageRating,
  approvedCount,
  hiddenCount,
  fiveStarCount,
  activeStatus,
  onSelectStatus,
  activeRating,
  onSelectRating,
}: ReviewsStatsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3 px-2 sm:px-4">
      {/* 1. All Reviews */}
      <button
        type="button"
        onClick={() => {
          onSelectStatus("all");
          onSelectRating("all");
        }}
        className={`p-3 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer shadow-xs bg-brand-green-dark/5 hover:scale-[1.02] ${
          activeStatus === "all" && activeRating === "all"
            ? "border-brand-green-dark ring-2 ring-brand-green-dark/20"
            : "border-brand-green-dark/20"
        }`}
      >
        <div className="flex items-center justify-between gap-1 mb-1.5">
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-gray-500 truncate">
            All Reviews
          </span>
          <MessageSquare size={16} className="text-brand-green-dark shrink-0" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl sm:text-2xl font-black text-brand-green-dark">
            {total}
          </span>
          <span className="text-[9px] font-bold text-gray-400 uppercase">
            total
          </span>
        </div>
      </button>

      {/* 2. Average Rating */}
      <div className="p-3 sm:p-4 rounded-2xl border border-amber-200 bg-amber-50/70 text-left shadow-xs">
        <div className="flex items-center justify-between gap-1 mb-1.5">
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-gray-500 truncate">
            Avg Score
          </span>
          <Star size={16} className="text-amber-500 fill-amber-500 shrink-0" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl sm:text-2xl font-black text-amber-900">
            {averageRating}
          </span>
          <span className="text-[9px] font-bold text-amber-700 uppercase">
            / 5.0
          </span>
        </div>
      </div>

      {/* 3. Approved & Visible */}
      <button
        type="button"
        onClick={() => onSelectStatus("approved")}
        className={`p-3 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer shadow-xs bg-emerald-50 hover:scale-[1.02] ${
          activeStatus === "approved"
            ? "border-emerald-600 ring-2 ring-emerald-600/20"
            : "border-emerald-200"
        }`}
      >
        <div className="flex items-center justify-between gap-1 mb-1.5">
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-gray-500 truncate">
            Approved
          </span>
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl sm:text-2xl font-black text-emerald-900">
            {approvedCount}
          </span>
          <span className="text-[9px] font-bold text-emerald-700 uppercase">
            public
          </span>
        </div>
      </button>

      {/* 4. Hidden / Needs Review */}
      <button
        type="button"
        onClick={() => onSelectStatus("hidden")}
        className={`p-3 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer shadow-xs bg-rose-50 hover:scale-[1.02] ${
          activeStatus === "hidden"
            ? "border-rose-500 ring-2 ring-rose-500/20"
            : "border-rose-200"
        }`}
      >
        <div className="flex items-center justify-between gap-1 mb-1.5">
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-gray-500 truncate">
            Hidden
          </span>
          <EyeOff size={16} className="text-rose-600 shrink-0" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl sm:text-2xl font-black text-rose-900">
            {hiddenCount}
          </span>
          <span className="text-[9px] font-bold text-rose-700 uppercase">
            private
          </span>
        </div>
      </button>

      {/* 5. 5-Star Reviews */}
      <button
        type="button"
        onClick={() => onSelectRating(5)}
        className={`p-3 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer shadow-xs bg-amber-50 hover:scale-[1.02] ${
          activeRating === 5
            ? "border-brand-gold ring-2 ring-brand-gold/30"
            : "border-brand-gold/30"
        }`}
      >
        <div className="flex items-center justify-between gap-1 mb-1.5">
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-gray-500 truncate">
            5 Stars
          </span>
          <Sparkles size={16} className="text-brand-gold shrink-0" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl sm:text-2xl font-black text-brand-green-dark">
            {fiveStarCount}
          </span>
          <span className="text-[9px] font-bold text-gray-400 uppercase">
            top rated
          </span>
        </div>
      </button>
    </div>
  );
}
