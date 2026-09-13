"use client";

import React from "react";

interface CustomerTableSkeletonProps {
  rowCount?: number;
}

export default function CustomerTableSkeleton({ rowCount = 10 }: CustomerTableSkeletonProps) {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-brand-gold/20 bg-white shadow-sm animate-pulse">
      <table className="w-full min-w-[700px]">
        <thead>
          <tr className="border-b border-brand-gold/20 bg-brand-green-dark">
            <th className="px-4 sm:px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest text-brand-gold">
              Customer
            </th>
            <th className="px-4 sm:px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest text-brand-gold">
              Email
            </th>
            <th className="px-4 sm:px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest text-brand-gold">
              Phone
            </th>
            <th className="px-4 sm:px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest text-brand-gold">
              Role
            </th>
            <th className="px-4 sm:px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest text-brand-gold">
              Address
            </th>
          </tr>
        </thead>
        <tbody>
          {[...Array(rowCount)].map((_, i) => (
            <tr key={i} className="border-b border-brand-gold/10">
              
              {/* Customer Name & ID Skeleton */}
              <td className="px-4 sm:px-6 py-4">
                <div className="space-y-2">
                  <div className="h-3.5 w-32 bg-gray-200 rounded" />
                  <div className="h-2.5 w-10 bg-gray-100 rounded" />
                </div>
              </td>

              {/* Email Skeleton */}
              <td className="px-4 sm:px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded bg-gray-200 shrink-0" />
                  <div className="h-3.5 w-40 bg-gray-200 rounded" />
                </div>
              </td>

              {/* Phone Skeleton */}
              <td className="px-4 sm:px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded bg-gray-200 shrink-0" />
                  <div className="h-3.5 w-24 bg-gray-200 rounded" />
                </div>
              </td>

              {/* Role Skeleton */}
              <td className="px-4 sm:px-6 py-4">
                <div className="h-4 w-12 bg-gray-200 rounded" />
              </td>

              {/* Address Skeleton */}
              <td className="px-4 sm:px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded bg-gray-200 shrink-0" />
                  <div className="h-3.5 w-14 bg-gray-200 rounded" />
                </div>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}