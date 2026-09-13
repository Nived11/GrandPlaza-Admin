"use client";

import React from "react";
import { ReviewItem } from "../api/reviewsApi";
import {
  X,
  Star,
  User,
  ShoppingBag,
  Calendar,
  Eye,
  EyeOff,
  MessageSquare,
} from "lucide-react";

interface ReviewDetailsModalProps {
  review: ReviewItem | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleApproval: (id: number, currentStatus: boolean) => void;
}

export default function ReviewDetailsModal({
  review,
  isOpen,
  onClose,
  onToggleApproval,
}: ReviewDetailsModalProps) {
  if (!isOpen || !review) return null;

  const formattedDate = review.created_at
    ? new Date(review.created_at).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "N/A";

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="bg-white border border-brand-gold/40 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-brand-green-dark px-6 py-4 flex items-center justify-between border-b border-brand-gold/30">
          <div className="flex items-center gap-2 text-brand-gold">
            <span className="font-serif font-black text-sm uppercase tracking-wider text-brand-cream">
              Review Details
            </span>
            <span className="text-xs text-brand-gold/80 font-mono">
              #{review.id}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-brand-cream/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto font-sans">
          
          {/* Guest & Order Info */}
          <div className="grid grid-cols-2 gap-3 bg-brand-gold/5 p-4 rounded-xl border border-brand-gold/20">
            {/* Customer Name */}
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-green-dark/10 flex items-center justify-center text-brand-green-dark shrink-0">
                <User size={15} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  Customer
                </p>
                <p className="text-xs font-black text-brand-green-dark truncate">
                  {review.user_name || "Guest Customer"}
                </p>
              </div>
            </div>

            {/* Order # */}
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-green-dark/10 flex items-center justify-center text-brand-green-dark shrink-0">
                <ShoppingBag size={15} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  Order Number
                </p>
                <p className="text-xs font-black text-brand-green-dark truncate">
                  #{review.order}
                </p>
              </div>
            </div>

            {/* Date */}
            <div className="col-span-2 flex items-start gap-2.5 pt-2 border-t border-brand-gold/10">
              <div className="w-8 h-8 rounded-lg bg-brand-green-dark/10 flex items-center justify-center text-brand-green-dark shrink-0">
                <Calendar size={15} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  Submitted On
                </p>
                <p className="text-xs font-bold text-gray-700">
                  {formattedDate}
                </p>
              </div>
            </div>
          </div>

          {/* Rating Stars Card */}
          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/60 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-amber-800">
                Rating Given
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={18}
                    className={`${
                      s <= review.rating
                        ? "text-amber-500 fill-amber-500"
                        : "text-gray-300 fill-gray-200"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm font-black text-amber-900">
                  {review.rating} / 5
                </span>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white border border-amber-300 text-amber-900 shadow-xs">
              {review.rating_display || `${review.rating} Stars`}
            </span>
          </div>

          {/* Comment */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-brand-green-dark">
              <MessageSquare size={14} className="text-brand-gold" />
              <p className="text-[10px] font-black uppercase tracking-wider text-gray-500">
                Customer Comment
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 min-h-[100px]">
              <p className="text-xs text-gray-800 whitespace-pre-wrap leading-relaxed">
                {review.comment || "No comment provided."}
              </p>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="bg-gray-100 px-6 py-3 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Status Badge */}
          <div>
            {review.is_approved ? (
              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border border-emerald-300">
                <Eye size={12} className="text-emerald-600" />
                Public (Approved)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border border-rose-300">
                <EyeOff size={12} className="text-rose-600" />
                Hidden (Private)
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => onToggleApproval(review.id, review.is_approved)}
              className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs ${
                review.is_approved
                  ? "bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-300"
                  : "bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-300"
              }`}
            >
              {review.is_approved ? (
                <>
                  <EyeOff size={14} />
                  <span>Hide Review</span>
                </>
              ) : (
                <>
                  <Eye size={14} />
                  <span>Approve Review</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
