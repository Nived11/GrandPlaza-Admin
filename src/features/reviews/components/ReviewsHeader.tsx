"use client";

import React from "react";
import { Star, MessageSquareQuote } from "lucide-react";

interface ReviewsHeaderProps {
  totalReviews: number;
  averageRating: number;
}

export default function ReviewsHeader({
  totalReviews,
  averageRating,
}: ReviewsHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-brand-green-dark p-2 sm:p-4">
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-brand-green-dark border border-brand-gold flex items-center justify-center text-brand-gold shadow-md shrink-0">
          <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-brand-gold" />
        </div>

        <div className="text-left">
          <h1 className="text-base sm:text-2xl font-black text-brand-green-dark tracking-tight font-sans uppercase leading-tight">
            Customer <span className="text-brand-gold">Reviews & Feedback</span>
          </h1>

          <p className="text-[10px] sm:text-sm font-medium text-gray-600 font-sans mt-0.5 leading-tight flex items-center gap-1.5">
            <MessageSquareQuote size={13} className="text-brand-gold shrink-0" />
            <span>Manage food ratings, guest testimonials, and visibility</span>
          </p>
        </div>
      </div>

      {totalReviews > 0 && (
        <div className="flex items-center gap-2 bg-brand-green-dark border border-brand-gold px-4 py-2 rounded-xl shadow-md self-start sm:self-auto">
          <div className="flex items-center gap-1 text-brand-gold">
            <Star size={15} className="fill-brand-gold" />
            <span className="text-xs sm:text-sm font-black text-brand-cream">
              {averageRating}
            </span>
          </div>
          <span className="text-[10px] font-bold text-brand-gold/80 uppercase">
            / 5.0 Rating
          </span>
        </div>
      )}
    </header>
  );
}
