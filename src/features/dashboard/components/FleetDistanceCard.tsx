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
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            <Bike size={18} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-gray-900 tracking-tight flex items-center gap-2">
              <span>Fleet Ride & Distance Tracker</span>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                {periodLabel}
              </span>
            </h3>
            <p className="text-[11px] text-gray-500 font-medium">
              Kilometers ridden by delivery boys for customer fulfillment
            </p>
          </div>
        </div>

        <Link
          href="/employees"
          className="text-xs font-bold text-[var(--brand-green-dark)] hover:text-amber-600 flex items-center gap-1 transition-colors"
        >
          <span>Manage Fleet</span>
          <ChevronRight size={14} />
        </Link>
      </div>

      {/* Top 3 Metric Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* 1. Today's Total KM */}
        <div className="bg-amber-50/60 border border-amber-200/60 rounded-xl p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Gauge size={16} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block">
              Today's Fleet Ride
            </span>
            <span className="text-base sm:text-lg font-black text-amber-950">
              {safeMetrics.today_fleet_km.toFixed(1)} <span className="text-xs font-bold">KM</span>
            </span>
          </div>
        </div>

        {/* 2. Period Total KM */}
        <div className="bg-emerald-50/60 border border-emerald-200/60 rounded-xl p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--brand-green-dark)] text-brand-cream flex items-center justify-center shrink-0 shadow-xs">
            <Navigation size={16} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider block">
              {periodLabel} Total
            </span>
            <span className="text-base sm:text-lg font-black text-emerald-950">
              {safeMetrics.period_fleet_km.toFixed(1)} <span className="text-xs font-bold">KM</span>
            </span>
          </div>
        </div>

        {/* 3. Average Distance per Order */}
        <div className="bg-blue-50/60 border border-blue-200/60 rounded-xl p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <MapPin size={16} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wider block">
              Avg Trip Distance
            </span>
            <span className="text-base sm:text-lg font-black text-blue-950">
              {safeMetrics.avg_km_per_order.toFixed(1)} <span className="text-xs font-bold">KM / order</span>
            </span>
          </div>
        </div>
      </div>

      {/* Rider Leaderboard List */}
      <div className="space-y-2 pt-1">
        <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 block">
          Rider Distance Breakdown
        </span>

        {riders.length === 0 ? (
          <div className="py-6 text-center text-xs text-gray-500 border border-dashed border-gray-200 rounded-xl">
            No delivery boy activity recorded in this period yet.
          </div>
        ) : (
          <div className="space-y-2">
            {riders.map((rider, idx) => {
              const pct = Math.min(100, Math.round((rider.period_km / maxPeriodKm) * 100));
              const isTop = idx === 0 && rider.period_km > 0;

              return (
                <div
                  key={rider.id}
                  className="p-3 rounded-xl border border-gray-100 hover:border-amber-200 hover:bg-amber-50/20 transition space-y-2"
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                        {isTop ? '🥇' : idx + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-black text-gray-900 truncate">
                            {rider.name}
                          </span>
                          <span className="text-[9px] font-mono font-bold text-gray-600 bg-gray-100 px-1.5 py-0.2 rounded border border-gray-200">
                            {rider.employee_id}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-500 font-medium">
                          Vehicle: {rider.vehicle_number}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Today: {rider.today_km} KM
                        </span>
                        <span className="text-xs font-black text-gray-900">
                          {rider.period_km} KM
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-500 font-medium block">
                        {rider.delivered_count} deliveries completed
                      </span>
                    </div>
                  </div>

                  {/* Distance Progress Bar */}
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
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
    </div>
  );
}
