'use client';

import React from 'react';
import { Bike, Navigation, Award, ChevronRight, Gauge, MapPin } from 'lucide-react';
import Link from 'next/link';

interface RiderStat {
  id: number;
  name: string;
  employee_id: string;
  vehicle_number: string;
  today_km: number;
  period_km: number;
  total_km: number;
  delivered_count: number;
}

interface FleetDistanceMetrics {
  period_fleet_km: number;
  today_fleet_km: number;
  avg_km_per_order: number;
  riders: RiderStat[];
}

interface FleetDistanceCardProps {
  metrics?: FleetDistanceMetrics;
  periodLabel: string;
}

export default function FleetDistanceCard({
  metrics,
  periodLabel,
}: FleetDistanceCardProps) {
  const safeMetrics = metrics || {
    period_fleet_km: 0,
    today_fleet_km: 0,
    avg_km_per_order: 0,
    riders: [],
  };

  const riders = safeMetrics.riders || [];
  const maxPeriodKm = Math.max(...riders.map((r) => r.period_km), 1);

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs h-full flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            <Bike size={18} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-gray-900 tracking-tight flex items-center gap-2">
              <span>Fleet & Rider Tracking</span>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                {periodLabel}
              </span>
            </h3>
            <p className="text-[11px] text-gray-500 font-medium">
              Kilometers ridden by delivery fleet
            </p>
          </div>
        </div>

        <Link
          href="/employees"
          className="text-xs font-bold text-[var(--brand-green-dark)] hover:text-amber-600 flex items-center gap-1 transition-colors"
        >
          <span>Fleet</span>
          <ChevronRight size={14} />
        </Link>
      </div>

      {/* Top 3 Metric Summary Strip (Sleek Compact Grid) */}
      <div className="grid grid-cols-3 gap-2 p-2.5 rounded-2xl bg-gradient-to-r from-amber-50/60 via-emerald-50/50 to-blue-50/50 border border-gray-100 text-center">
        {/* 1. Today's Total KM */}
        <div className="flex flex-col items-center justify-center p-1.5 rounded-xl bg-white/90 shadow-2xs border border-amber-200/40">
          <span className="text-[9px] font-bold uppercase tracking-wider text-amber-800 truncate w-full">
            Today
          </span>
          <span className="text-sm font-black text-amber-950 mt-0.5">
            {safeMetrics.today_fleet_km.toFixed(1)} <span className="text-[9px] font-bold">KM</span>
          </span>
        </div>

        {/* 2. Period Total KM */}
        <div className="flex flex-col items-center justify-center p-1.5 rounded-xl bg-white/90 shadow-2xs border border-emerald-200/40">
          <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-800 truncate w-full">
            {periodLabel}
          </span>
          <span className="text-sm font-black text-emerald-950 mt-0.5">
            {safeMetrics.period_fleet_km.toFixed(1)} <span className="text-[9px] font-bold">KM</span>
          </span>
        </div>

        {/* 3. Average Distance per Order */}
        <div className="flex flex-col items-center justify-center p-1.5 rounded-xl bg-white/90 shadow-2xs border border-blue-200/40">
          <span className="text-[9px] font-bold uppercase tracking-wider text-blue-800 truncate w-full">
            Avg / Trip
          </span>
          <span className="text-sm font-black text-blue-950 mt-0.5">
            {safeMetrics.avg_km_per_order.toFixed(1)} <span className="text-[9px] font-bold">KM</span>
          </span>
        </div>
      </div>

      {/* Rider Leaderboard List with Clean Scroll */}
      <div className="space-y-2 flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-gray-500">
          <span>Rider Distance Breakdown</span>
          <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            {riders.length} Active Riders
          </span>
        </div>

        {riders.length === 0 ? (
          <div className="py-8 text-center text-xs text-gray-400 border border-dashed border-gray-200 rounded-2xl">
            No delivery boy activity recorded in this period yet.
          </div>
        ) : (
          <div className="max-h-[280px] overflow-y-auto pr-1 space-y-2 custom-scrollbar">
            {riders.map((rider, idx) => {
              const pct = Math.min(100, Math.round((rider.period_km / maxPeriodKm) * 100));
              const isTop = idx === 0 && rider.period_km > 0;

              return (
                <div
                  key={rider.id}
                  className="p-2.5 rounded-xl border border-gray-100 hover:border-amber-200 hover:bg-amber-50/20 transition space-y-1.5 bg-white"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                        {isTop ? '🥇' : idx + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-gray-900 truncate max-w-[120px] sm:max-w-[140px]">
                            {rider.name}
                          </span>
                          <span className="text-[9px] font-mono font-bold text-gray-500 bg-gray-100 px-1 py-0.2 rounded border border-gray-200">
                            {rider.employee_id}
                          </span>
                        </div>
                        <span className="text-[9px] text-gray-400 font-medium block truncate">
                          {rider.vehicle_number}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          {rider.today_km} KM
                        </span>
                        <span className="text-xs font-black text-gray-900">
                          {rider.period_km} KM
                        </span>
                      </div>
                      <span className="text-[9px] text-gray-400 font-medium block">
                        {rider.delivered_count} delivered
                      </span>
                    </div>
                  </div>

                  {/* Distance Progress Bar */}
                  <div className="w-full bg-gray-100 rounded-full h-1 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isTop ? 'bg-gradient-to-r from-amber-500 to-amber-600' : 'bg-emerald-600'
                      }`}
                      style={{ width: `${Math.max(pct, 4)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
        <span>Real-time GPS Odometer sync</span>
        <span className="font-bold text-emerald-700">Active Fleet</span>
      </div>
    </div>
  );
}
