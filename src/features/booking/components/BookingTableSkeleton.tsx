"use client";

import React from "react";

interface BookingTableSkeletonProps {
  rowCount?: number;
}

export default function BookingTableSkeleton({
  rowCount = 8,
}: BookingTableSkeletonProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-brand-gold/20 bg-white shadow-sm animate-pulse">
      {/* DESKTOP TABLE SKELETON */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse">
          <thead>
            <tr className="border-b border-brand-gold/20 bg-brand-green-dark">
              <th className="px-4 sm:px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest text-brand-gold">
                Guest / ID
              </th>
              <th className="px-4 sm:px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest text-brand-gold">
                Mobile
              </th>
              <th className="px-4 sm:px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest text-brand-gold">
                Email
              </th>
              <th className="px-4 sm:px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest text-brand-gold">
                Reservation Date
              </th>
              <th className="px-4 sm:px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest text-brand-gold">
                Time (IST)
              </th>
              <th className="px-4 sm:px-6 py-4 text-center text-[9px] font-black uppercase tracking-widest text-brand-gold">
                Guests
              </th>
              <th className="px-4 sm:px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest text-brand-gold">
                Status
              </th>
              <th className="px-4 sm:px-6 py-4 text-right text-[9px] font-black uppercase tracking-widest text-brand-gold">
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            {[...Array(rowCount)].map((_, i) => (
              <tr key={i} className="border-b border-brand-gold/10">
                {/* GUEST */}
                <td className="px-4 sm:px-6 py-4">
                  <div className="space-y-1.5">
                    <div className="h-3.5 w-28 rounded bg-gray-200" />
                    <div className="h-2.5 w-16 rounded bg-gray-100" />
                  </div>
                </td>

                {/* MOBILE */}
                <td className="px-4 sm:px-6 py-4">
                  <div className="h-3.5 w-24 rounded bg-gray-200" />
                </td>

                {/* EMAIL */}
                <td className="px-4 sm:px-6 py-4">
                  <div className="h-3.5 w-32 rounded bg-gray-200" />
                </td>

                {/* DATE */}
                <td className="px-4 sm:px-6 py-4">
                  <div className="h-3.5 w-24 rounded bg-gray-200" />
                </td>

                {/* TIME */}
                <td className="px-4 sm:px-6 py-4">
                  <div className="h-3.5 w-16 rounded bg-gray-200" />
                </td>

                {/* GUESTS */}
                <td className="px-4 sm:px-6 py-4 text-center">
                  <div className="mx-auto h-6 w-10 rounded bg-gray-200" />
                </td>

                {/* STATUS */}
                <td className="px-4 sm:px-6 py-4">
                  <div className="h-5 w-20 rounded-full bg-gray-200" />
                </td>

                {/* DETAILS */}
                <td className="px-4 sm:px-6 py-4 text-right">
                  <div className="ml-auto h-8 w-8 rounded-full bg-gray-200" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE SKELETON */}
      <div className="grid gap-3 p-3 lg:hidden">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-brand-gold/20 bg-white p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1.5">
                <div className="h-4 w-32 rounded bg-gray-200" />
                <div className="h-3 w-16 rounded bg-gray-100" />
              </div>
              <div className="h-8 w-8 rounded-full bg-gray-200" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="h-3.5 rounded bg-gray-100" />
              <div className="h-3.5 rounded bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
