"use client";

import React from "react";
import ReviewsTableRow from "./ReviewsTableRow";
import { ReviewItem } from "../api/reviewsApi";

interface ReviewsTableProps {
  reviews: ReviewItem[];
  onView: (rev: ReviewItem) => void;
  onToggleApproval: (id: number, currentStatus: boolean) => void;
}

export default function ReviewsTable({
  reviews,
  onView,
  onToggleApproval,
}: ReviewsTableProps) {
  if (reviews.length === 0) {
    return (
      <div className="py-14 text-center text-xs font-bold text-gray-400 bg-white rounded-2xl border border-brand-gold/20 shadow-xs">
        No reviews found matching your filters.
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-brand-gold/20 bg-white shadow-sm">
      <table className="w-full min-w-[850px] border-collapse">
        <thead>
          <tr className="border-b border-brand-gold/20 bg-brand-green-dark">
            <th className="px-4 sm:px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest text-brand-gold">
              Customer
            </th>
            <th className="px-4 sm:px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest text-brand-gold">
              Order #
            </th>
            <th className="px-4 sm:px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest text-brand-gold">
              Rating
            </th>
            <th className="px-4 sm:px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest text-brand-gold">
              Comment
            </th>
            <th className="px-4 sm:px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest text-brand-gold">
              Date
            </th>
            <th className="px-4 sm:px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest text-brand-gold">
              Visibility
            </th>
            <th className="px-4 sm:px-6 py-4 text-right text-[9px] font-black uppercase tracking-widest text-brand-gold">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((rev) => (
            <ReviewsTableRow
              key={rev.id}
              review={rev}
              onView={onView}
              onToggleApproval={onToggleApproval}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
