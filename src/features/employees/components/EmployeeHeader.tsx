"use client";

import React from "react";
import { UserCheck, Users, Bike } from "lucide-react";

interface EmployeeHeaderProps {
  staffCount: number;
  ridersCount: number;
}

export default function EmployeeHeader({ staffCount, ridersCount }: EmployeeHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-brand-green-dark p-2 sm:p-6">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-brand-green-dark border border-brand-gold flex items-center justify-center text-brand-cream shadow-md shrink-0">
          <UserCheck className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="text-left">
          <h1 className="text-base sm:text-2xl font-black text-brand-green-dark tracking-tight font-sans uppercase leading-tight">
            Workforce <span className="text-brand-gold">Directory</span>
          </h1>
          <p className="text-[10px] sm:text-sm font-medium text-gray-600 font-sans mt-0.5 leading-tight">
            Manage internal staff members and delivery fleet accounts
          </p>
        </div>
      </div>

      {/* OVERVIEW STATS */}
      <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-start sm:justify-end pt-1 sm:pt-0">
        <div className="px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl bg-brand-green-dark border border-brand-gold flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-cream" />
          <span className="text-[10px] sm:text-xs font-bold text-brand-cream whitespace-nowrap">Staff: {staffCount}</span>
        </div>
        <div className="px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl bg-brand-green-dark border border-brand-gold flex items-center gap-1.5">
          <Bike className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-cream" />
          <span className="text-[10px] sm:text-xs font-bold text-brand-cream whitespace-nowrap">Riders: {ridersCount}</span>
        </div>
      </div>
    </header>
  );
}