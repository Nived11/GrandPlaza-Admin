"use client";

import React from "react";
import { ReviewItem } from "../api/reviewsApi";
import { Star, Eye, EyeOff, Calendar, User, ShoppingBag } from "lucide-react";

interface ReviewsTableRowProps {
  review: ReviewItem;
  onView: (rev: ReviewItem) => void;
  onToggleApproval: (id: number, currentStatus: boolean) => void;
}

export default function ReviewsTableRow({
  review,
  onView,
  onToggleApproval,
}: ReviewsTableRowProps) {
  const formattedDate = review.created_at
    ? new Date(review.created_at).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";

  return (
    <tr
      onClick={() => onView(review)}
      className="border-b border-brand-gold/10 hover:bg-brand-gold/5 transition-colors cursor-pointer"
    >
      {/* Customer Name & ID */}
      <td className="px-4 sm:px-6 py-4 text-left">
        <div>
          <p className="text-xs sm:text-sm font-black text-brand-green-dark">
            {review.user_name || "Guest Customer"}
          </p>
          <p className="text-[9px] font-bold text-gray-400 mt-0.5">
            Review #{review.id}
          </p>
        </div>
      </td>

      {/* Order Number */}
      <td className="px-4 sm:px-6 py-4 text-left">
        <div className="flex items-center gap-1.5 text-gray-600">
          <ShoppingBag size={13} className="text-brand-green-dark/50 shrink-0" />
          <span className="text-xs font-bold">
            #{review.order}
          </span>
        </div>
      </td>

      {/* Rating (Stars + Score) */}
      <td className="px-4 sm:px-6 py-4 text-left">
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={13}
                className={`${
                  s <= review.rating
                    ? "text-amber-400 fill-amber-400"
                    : "text-gray-200 fill-gray-200"
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-black text-brand-green-dark">
            {review.rating}.0
          </span>
        </div>
        <p className="text-[9px] font-bold text-gray-400 mt-0.5">
          {review.rating_display}
        </p>
      </td>

      {/* Comment Preview */}
      <td className="px-4 sm:px-6 py-4 text-left max-w-[260px]">
        <p className="text-xs text-gray-700 truncate leading-relaxed">
          {review.comment || "No comment."}
        </p>
      </td>

      {/* Date */}
      <td className="px-4 sm:px-6 py-4 text-left">
        <div className="flex items-center gap-1.5 text-gray-500">
          <Calendar size={13} className="text-brand-green-dark/40 shrink-0" />
          <span className="text-xs whitespace-nowrap">{formattedDate}</span>
        </div>
      </td>

      {/* Visibility Status */}
      <td className="px-4 sm:px-6 py-4 text-left">
        {review.is_approved ? (
          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            Approved
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-rose-300">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
            Hidden
          </span>
        )}
      </td>

      {/* Actions (Toggle Approve/Hide & View) */}
      <td
        className="px-4 sm:px-6 py-4 text-right"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-end gap-1.5">
          {/* Toggle Visibility */}
          <button
            onClick={() => onToggleApproval(review.id, review.is_approved)}
            title={review.is_approved ? "Hide from website" : "Approve for website"}
            className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              review.is_approved
                ? "text-rose-600 hover:bg-rose-50"
                : "text-emerald-700 hover:bg-emerald-50"
            }`}
          >
            {review.is_approved ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>

          {/* View Details */}
          <button
            onClick={() => onView(review)}
            title="View full review"
            className="p-1.5 rounded-lg text-brand-green-dark hover:bg-brand-gold/20 transition-colors cursor-pointer"
          >
            <Star size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
}
