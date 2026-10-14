'use client';

import React from 'react';
import { Clock, CheckCircle2, XCircle, Utensils, Activity, ShieldCheck } from 'lucide-react';
import { OperationsMetrics, LivePipeline } from '../types/dashboardTypes';

interface OperationsHealthCardProps {
  metrics?: OperationsMetrics;
  livePipeline?: LivePipeline;
  periodLabel: string;
}

export default function OperationsHealthCard({
  metrics,
  livePipeline,
  periodLabel,
}: OperationsHealthCardProps) {
  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-black shrink-0">
            <Activity size={18} />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>Operations & Rush Hours</span>
            </h3>
            <p className="text-xs text-gray-500">
              Kitchen efficiency & fulfillment health in {periodLabel}
            </p>
          </div>
        </div>

        <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
          Kitchen Health
        </span>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mt-4 flex-grow">
        
        {/* Rush Hour */}
        <div className="bg-gradient-to-br from-orange-50/80 to-amber-50/50 rounded-2xl p-3.5 border border-orange-100 space-y-1">
          <div className="flex items-center gap-1.5 text-orange-700 text-xs font-bold">
            <Clock size={14} />
            <span>Peak Rush Hour</span>
          </div>
          <span className="text-sm font-black text-slate-900 block truncate">
            {metrics?.busiest_slot || '8 PM - 10 PM'}
          </span>
          <span className="text-[10px] text-gray-500 font-medium block">
            Highest order rush
          </span>
        </div>

        {/* Fulfillment Rate */}
        <div className="bg-gradient-to-br from-emerald-50/80 to-teal-50/50 rounded-2xl p-3.5 border border-emerald-100 space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold">
            <CheckCircle2 size={14} />
            <span>Fulfillment Rate</span>
          </div>
          <span className="text-sm font-black text-emerald-950 block">
            {metrics?.fulfillment_rate ?? 100}%
          </span>
          <span className="text-[10px] text-emerald-700 font-medium block">
            Successful deliveries
          </span>
        </div>

        {/* Cancellation Rate */}
        <div className="bg-gray-50 rounded-2xl p-3.5 border border-gray-100 space-y-1">
          <div className="flex items-center gap-1.5 text-gray-600 text-xs font-bold">
            <XCircle size={14} />
            <span>Cancellation Rate</span>
          </div>
          <span className="text-sm font-black text-slate-900 block">
            {metrics?.cancellation_rate ?? 0}%
          </span>
          <span className="text-[10px] text-gray-400 font-medium block">
            Order drop-off
          </span>
        </div>

        {/* Live Active Load */}
        <div className="bg-blue-50/60 rounded-2xl p-3.5 border border-blue-100 space-y-1">
          <div className="flex items-center gap-1.5 text-blue-700 text-xs font-bold">
            <Utensils size={14} />
            <span>Active Pipeline</span>
          </div>
          <span className="text-sm font-black text-blue-950 block">
            {livePipeline?.total_active ?? 0} Orders
          </span>
          <span className="text-[10px] text-blue-700 font-medium block">
            In kitchen & transit now
          </span>
        </div>

      </div>

      {/* Footer Status Badge */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
        <span className="text-gray-500 font-medium flex items-center gap-1">
          <ShieldCheck size={14} className="text-emerald-600" />
          Kitchen POS Status
        </span>
        <span className="font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
          Optimal Performance
        </span>
      </div>

    </div>
  );
}
