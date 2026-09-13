"use client";

import React from "react";

interface InboxTableSkeletonProps {
  rowCount?: number;
}

export default function InboxTableSkeleton({ rowCount = 10 }: InboxTableSkeletonProps) {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-brand-gold/20 bg-white shadow-sm animate-pulse">
      <table className="w-full min-w-[850px]">
        <thead>
          <tr className="border-b border-brand-gold/20 bg-brand-green-dark">
            <th className="px-4 sm:px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest text-brand-gold">
              Sender
            </th>
            <th className="px-4 sm:px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest text-brand-gold">
              Subject
            </th>
            <th className="px-4 sm:px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest text-brand-gold">
              Email
            </th>
            <th className="px-4 sm:px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest text-brand-gold">
              Phone
            </th>
            <th className="px-4 sm:px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest text-brand-gold">
              Status
            </th>
            <th className="px-4 sm:px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest text-brand-gold">
              Date
            </th>
            <th className="px-4 sm:px-6 py-4 text-right text-[9px] font-black uppercase tracking-widest text-brand-gold">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {[...Array(rowCount)].map((_, i) => (
            <tr key={i} className="border-b border-brand-gold/10">
              {/* Sender Skeleton */}
              <td className="px-4 sm:px-6 py-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-200 shrink-0" />
                  <div className="space-y-1.5">
                    <div className="h-3.5 w-28 bg-gray-200 rounded" />
                    <div className="h-2.5 w-8 bg-gray-100 rounded" />
                  </div>
                </div>
              </td>

              {/* Subject Skeleton */}
              <td className="px-4 sm:px-6 py-4">
                <div className="space-y-1.5">
                  <div className="h-3.5 w-36 bg-gray-200 rounded" />
                  <div className="h-2.5 w-48 bg-gray-100 rounded" />
                </div>
              </td>

              {/* Email Skeleton */}
              <td className="px-4 sm:px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded bg-gray-200 shrink-0" />
                  <div className="h-3.5 w-36 bg-gray-200 rounded" />
                </div>
              </td>

              {/* Phone Skeleton */}
              <td className="px-4 sm:px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded bg-gray-200 shrink-0" />
                  <div className="h-3.5 w-24 bg-gray-200 rounded" />
                </div>
              </td>

              {/* Status Skeleton */}
              <td className="px-4 sm:px-6 py-4">
                <div className="h-4 w-14 bg-gray-200 rounded-full" />
              </td>

              {/* Date Skeleton */}
              <td className="px-4 sm:px-6 py-4">
                <div className="h-3.5 w-20 bg-gray-200 rounded" />
              </td>

              {/* Actions Skeleton */}
              <td className="px-4 sm:px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <div className="w-6 h-6 rounded bg-gray-200" />
                  <div className="w-6 h-6 rounded bg-gray-200" />
                  <div className="w-6 h-6 rounded bg-gray-200" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
