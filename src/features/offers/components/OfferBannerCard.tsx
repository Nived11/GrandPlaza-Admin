"use client";

import React, { useState } from "react";
import { OfferBanner } from "../api/offersApi";
import { Check, Flame, Edit, Trash2, Loader2, Sparkles, Eye, Power } from "lucide-react";

interface OfferBannerCardProps {
  banner: OfferBanner;
  onActivate: (id: number) => Promise<void>;
  onEdit: (banner: OfferBanner) => void;
  onDelete: (id: number) => void;
  isActivating: boolean;
}

export default function OfferBannerCard({
  banner,
  onActivate,
  onEdit,
  onDelete,
  isActivating,
}: OfferBannerCardProps) {
  const isActive = Boolean(banner.is_active ?? banner.isActive);
  const badge = banner.badge_text || banner.badgeText || "";
  const isPureGraphic = Boolean(
    banner.hide_text_overlay ??
    banner.hideTextOverlay ??
    (!banner.title && !banner.subtitle && !badge)
  );
  const imageSrc = banner.image || banner.imageUrl || "https://grandeplaza.com/offers-banner.jpg";

  return (
    <div
      className={`group relative overflow-hidden rounded-3xl border transition-all duration-300 shadow-md bg-white flex flex-col justify-between ${
        isActive
          ? "border-emerald-500 ring-2 ring-emerald-500/30 shadow-emerald-500/10"
          : "border-brand-gold/25 hover:border-brand-gold/60 hover:shadow-lg"
      }`}
    >
      {/* 🖼️ Poster Thumbnail with Live Overlay */}
      <div className="relative h-44 sm:h-48 w-full bg-[#0d1f18] overflow-hidden">
        <img
          src={imageSrc}
          alt={banner.title || "Offer Poster"}
          className="h-full w-full object-cover object-[85%_35%] sm:object-center transition-transform duration-500 group-hover:scale-105"
        />

        {!isPureGraphic && (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
            {/* Text Overlay on Banner */}
            <div className="absolute bottom-3 left-3 right-3 z-10 space-y-1">
              {badge && (
                <div className="inline-flex items-center gap-1 rounded-full bg-brand-gold/25 border border-brand-gold/40 px-2 py-0.5">
                  <Flame className="w-2.5 h-2.5 text-brand-gold animate-pulse" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-brand-gold">
                    {badge}
                  </span>
                </div>
              )}
              {banner.title && (
                <h3 className="text-white text-base sm:text-lg font-serif font-black leading-tight drop-shadow-md">
                  {banner.title}
                </h3>
              )}
              {banner.subtitle && (
                <p className="text-gray-200 text-[10px] line-clamp-1 font-medium">
                  {banner.subtitle}
                </p>
              )}
            </div>
          </>
        )}

        {/* Status Pill on Top */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
          {isActive ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600/90 text-white text-[10px] font-black uppercase tracking-wider shadow-md backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-white animate-ping shrink-0" />
              Active Live on Site
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/60 text-gray-300 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
              In Library
            </span>
          )}

          {isPureGraphic && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-gold/80 text-brand-green-dark text-[9px] font-black uppercase tracking-wider backdrop-blur-md shadow-xs">
              Graphic Only
            </span>
          )}
        </div>
      </div>

      {/* 📋 Card Body & Controls */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 gap-4">
        <div className="space-y-1 text-left">
          <p className="text-xs font-black uppercase text-brand-green-dark">
            {banner.title || "Graphic Poster Banner"}
          </p>
          <p className="text-[11px] font-medium text-gray-500 line-clamp-2">
            {banner.subtitle || (isPureGraphic ? "Standalone graphic poster without text overlay." : "Exclusive deal available on customer home screen.")}
          </p>
          {banner.created_at && (
            <p className="text-[9px] text-gray-400 font-medium pt-1">
              Added: {new Date(banner.created_at).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Action Controls */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
          {/* Single-Click Activate Button */}
          {isActive ? (
            <div className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-black uppercase tracking-wider shadow-xs">
              <Check size={14} className="stroke-[3]" />
              <span>Current Live</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onActivate(banner.id)}
              disabled={isActivating}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-brand-green-dark hover:bg-brand-green-dark/90 text-brand-cream border border-brand-gold text-xs font-black uppercase tracking-wider shadow-sm transition-all cursor-pointer disabled:opacity-50"
              title="Activate this poster with 1 click"
            >
              {isActivating ? (
                <>
                  <Loader2 size={13} className="animate-spin text-brand-gold" />
                  <span>Switching...</span>
                </>
              ) : (
                <>
                  <Power size={13} className="text-brand-gold" />
                  <span>Set Active (1-Click)</span>
                </>
              )}
            </button>
          )}

          {/* Edit Button */}
          <button
            type="button"
            onClick={() => onEdit(banner)}
            className="w-9 h-9 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 flex items-center justify-center transition-all cursor-pointer shrink-0"
            title="Edit Poster Details"
          >
            <Edit size={14} />
          </button>

          {/* Delete Button */}
          <button
            type="button"
            onClick={() => onDelete(banner.id)}
            className="w-9 h-9 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 flex items-center justify-center transition-all cursor-pointer shrink-0"
            title="Delete Poster"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
