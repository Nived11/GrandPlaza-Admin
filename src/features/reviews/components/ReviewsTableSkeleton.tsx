"use client";

import React from "react";

interface ReviewsTableSkeletonProps {
  rowCount?: number;
}

export default function ReviewsTableSkeleton({
  rowCount = 10,
}: ReviewsTableSkeletonProps) {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-brand-gold/20 bg-white shadow-sm animate-pulse">
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
          {[...Array(rowCount)].map((_, i) => (
            <tr key={i} className="border-b border-brand-gold/10">
              <td className="px-4 sm:px-6 py-4">
                <div className="space-y-1.5">
                  <div className="h-3.5 w-28 rounded bg-gray-200" />
                  <div className="h-2.5 w-16 rounded bg-gray-100" />
                </div>
              </td>
              <td className="px-4 sm:px-6 py-4">
                <div className="h-3.5 w-16 rounded bg-gray-200" />
              </td>
              <td className="px-4 sm:px-6 py-4">
                <div className="h-3.5 w-24 rounded bg-gray-200" />
              </td>
              <td className="px-4 sm:px-6 py-4">
                <div className="h-3.5 w-44 rounded bg-gray-200" />
              </td>
              <td className="px-4 sm:px-6 py-4">
                <div className="h-3.5 w-20 rounded bg-gray-200" />
              </td>
              <td className="px-4 sm:px-6 py-4">
                <div className="h-5 w-20 rounded-full bg-gray-200" />
              </td>
              <td className="px-4 sm:px-6 py-4 text-right">
                <div className="ml-auto h-6 w-12 rounded bg-gray-200" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
