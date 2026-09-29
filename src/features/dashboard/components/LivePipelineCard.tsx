'use client';

import React from 'react';
import Link from 'next/link';
import { ChefHat, PackageCheck, Bike, CheckCircle2, XCircle, ArrowUpRight } from 'lucide-react';
import { StatusBreakdown, LivePipeline } from '../types/dashboardTypes';

interface LivePipelineCardProps {
  pipeline: LivePipeline;
  breakdown: StatusBreakdown;
  periodLabel: string;
}

export default function LivePipelineCard({ pipeline, breakdown, periodLabel }: LivePipelineCardProps) {
  const safeBreakdown = breakdown || {
    preparing: 0,
    ready_for_pickup: 0,
    out_for_delivery: 0,
    delivered: 0,
    cancelled: 0,
  };
  const total = 
    safeBreakdown.preparing +
    safeBreakdown.ready_for_pickup +
    safeBreakdown.out_for_delivery +
    safeBreakdown.delivered +
    safeBreakdown.cancelled;

  const getPercent = (count: number) => {
    if (!total || total === 0) return 0;
    return Math.round((count / total) * 100);
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Order Pipeline & Status
            </h3>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <p className="text-[11px] text-gray-500">
            Kitchen dispatch flow in {periodLabel}
          </p>
        </div>

        <Link
          href="/orders"
          className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 hover:underline cursor-pointer"
        >
          <span>Live POS</span>
          <ArrowUpRight size={13} />
        </Link>
      </div>

      {/* Pipeline Funnel Bars */}
      <div className="my-4 space-y-3">
        {/* 1. In Kitchen */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-bold text-orange-800">
              <ChefHat size={14} className="text-orange-500" />
              <span>In Kitchen (Cooking)</span>
            </span>
            <span className="font-black text-slate-900">
              {safeBreakdown.preparing} <span className="text-gray-400 font-normal">({getPercent(safeBreakdown.preparing)}%)</span>
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-orange-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${getPercent(safeBreakdown.preparing)}%` }}
            />
          </div>
        </div>

        {/* 2. Ready at Counter */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-bold text-blue-800">
              <PackageCheck size={14} className="text-blue-500" />
              <span>Ready for Pickup</span>
            </span>
            <span className="font-black text-slate-900">
              {safeBreakdown.ready_for_pickup} <span className="text-gray-400 font-normal">({getPercent(safeBreakdown.ready_for_pickup)}%)</span>
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${getPercent(safeBreakdown.ready_for_pickup)}%` }}
            />
          </div>
        </div>

        {/* 3. Out for Delivery */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-bold text-purple-800">
              <Bike size={14} className="text-purple-500" />
              <span>Out for Delivery</span>
            </span>
            <span className="font-black text-slate-900">
              {safeBreakdown.out_for_delivery} <span className="text-gray-400 font-normal">({getPercent(safeBreakdown.out_for_delivery)}%)</span>
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-purple-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${getPercent(safeBreakdown.out_for_delivery)}%` }}
            />
          </div>
        </div>

        {/* 4. Delivered */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-bold text-emerald-800">
              <CheckCircle2 size={14} className="text-emerald-500" />
              <span>Delivered Successfully</span>
            </span>
            <span className="font-black text-slate-900">
              {safeBreakdown.delivered} <span className="text-gray-400 font-normal">({getPercent(safeBreakdown.delivered)}%)</span>
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${getPercent(safeBreakdown.delivered)}%` }}
            />
          </div>
        </div>

        {/* 5. Cancelled (if any) */}
        {safeBreakdown.cancelled > 0 && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-bold text-rose-800">
                <XCircle size={14} className="text-rose-500" />
                <span>Cancelled</span>
              </span>
              <span className="font-black text-slate-900">
                {safeBreakdown.cancelled} <span className="text-gray-400 font-normal">({getPercent(safeBreakdown.cancelled)}%)</span>
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-rose-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${getPercent(safeBreakdown.cancelled)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Live Action Callout */}
      <div className="bg-orange-50/70 border border-orange-200/80 rounded-2xl p-3 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-black uppercase text-orange-800 block">
            Kitchen POS Active
          </span>
          <p className="text-xs font-bold text-orange-950">
            {pipeline?.total_active ?? 0} orders pending dispatch
          </p>
        </div>
        <Link
          href="/orders"
          className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs transition"
        >
          Open Counter
        </Link>
      </div>

    </div>
  );
}
