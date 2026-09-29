'use client';

import React from 'react';
import { CreditCard, Banknote, ShieldCheck } from 'lucide-react';
import { PaymentBreakdown } from '../types/dashboardTypes';

interface PaymentBreakdownCardProps {
  payment: PaymentBreakdown;
  periodLabel: string;
}

export default function PaymentBreakdownCard({ payment, periodLabel }: PaymentBreakdownCardProps) {
  const onlineRev = payment?.online_paid_revenue ?? 0;
  const codRev = payment?.cod_revenue ?? 0;
  const totalRev = onlineRev + codRev;
  const onlinePercent = totalRev > 0 ? Math.round((onlineRev / totalRev) * 100) : 50;
  const codPercent = 100 - onlinePercent;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div>
          <h3 className="text-base font-black text-slate-900 tracking-tight">
            Payment Methods
          </h3>
          <p className="text-[11px] text-gray-500">
            Prepaid vs Cash on Delivery in {periodLabel}
          </p>
        </div>
        <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
          <CreditCard size={18} />
        </span>
      </div>

      {/* Comparison Visual Meter */}
      <div className="my-4 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-emerald-700 flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            Online Paid ({onlinePercent}%)
          </span>
          <span className="text-amber-700 flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
            COD / Cash ({codPercent}%)
          </span>
        </div>

        {/* Dual Color Progress Bar */}
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden flex">
          <div
            className="bg-emerald-600 h-full transition-all duration-500"
            style={{ width: `${onlinePercent}%` }}
          />
          <div
            className="bg-amber-500 h-full transition-all duration-500"
            style={{ width: `${codPercent}%` }}
          />
        </div>

        {/* Two Columns: Online vs COD */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          
          {/* Online Prepaid */}
          <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-3 space-y-1">
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-800">
              <ShieldCheck size={13} className="text-emerald-600" />
              <span>Online / UPI</span>
            </div>
            <p className="text-base font-black text-slate-900">
              ₹{onlineRev.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
            <span className="text-[10px] text-gray-500 font-semibold block">
              {payment?.online_paid_count ?? 0} orders paid
            </span>
          </div>

          {/* COD */}
          <div className="bg-amber-50/70 border border-amber-100 rounded-2xl p-3 space-y-1">
            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-800">
              <Banknote size={13} className="text-amber-600" />
              <span>Cash on Delivery</span>
            </div>
            <p className="text-base font-black text-slate-900">
              ₹{codRev.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
            <span className="text-[10px] text-gray-500 font-semibold block">
              {payment?.cod_count ?? 0} cash to collect
            </span>
          </div>

        </div>
      </div>

      {/* Safety Note */}
      <div className="text-[11px] text-gray-400 border-t border-gray-100 pt-3 flex items-center justify-between">
        <span>Delivery boy reconciles COD at end of shift</span>
        <span className="font-bold text-slate-700">100% Verified</span>
      </div>

    </div>
  );
}
