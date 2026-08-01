"use client";

import React from "react";

export default function EmployeeSkeleton() {
  return (
    <div className="space-y-3 pt-1">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="p-4 rounded-xl bg-white border border-gray-200/70 flex items-center justify-between gap-3 shadow-sm animate-pulse"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-3xl bg-gray-200 shrink-0" />
            <div className="space-y-2 text-left">
              <div className="h-4 w-28 bg-gray-200 rounded" />
              <div className="flex items-center gap-2">
                <div className="h-3 w-16 bg-gray-200 rounded" />
                <div className="h-3 w-20 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-6 w-16 bg-gray-200 rounded-full" />
            <div className="h-8 w-8 bg-gray-200 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}