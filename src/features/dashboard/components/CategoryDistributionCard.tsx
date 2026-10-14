'use client';

import React from 'react';
import { PieChart, Utensils, Tag, Sparkles } from 'lucide-react';
import { CategoryDistributionItem } from '../types/dashboardTypes';

interface CategoryDistributionCardProps {
  categories?: CategoryDistributionItem[];
  periodLabel: string;
}

const CATEGORY_COLORS = [
  'from-orange-500 to-amber-500',
  'from-emerald-500 to-teal-500',
  'from-blue-500 to-indigo-500',
  'from-purple-500 to-pink-500',
  'from-rose-500 to-red-500',
  'from-slate-600 to-slate-800',
];

export default function CategoryDistributionCard({
  categories = [],
  periodLabel,
}: CategoryDistributionCardProps) {
  if (!categories || categories.length === 0) {
    return null;
  }

  const totalRevenue = categories.reduce((sum, c) => sum + c.revenue, 0);

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black shrink-0">
            <PieChart size={18} />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>Category Sales Share</span>
            </h3>
            <p className="text-xs text-gray-500">
              Menu category demand & revenue contribution
            </p>
          </div>
        </div>

        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          Menu Demand
        </span>
      </div>

      {/* Category List */}
      <div className="divide-y divide-gray-100 mt-3 space-y-2.5 flex-grow">
        {categories.map((cat, idx) => {
          const colorGradient = CATEGORY_COLORS[idx % CATEGORY_COLORS.length];

          return (
            <div key={idx} className="pt-2.5 pb-1 first:pt-0">
              <div className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-5 h-5 rounded-lg bg-gray-100 text-gray-700 text-[10px] font-black flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <span className="font-black text-slate-900 block truncate">
                      {cat.name}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">
                      {cat.quantity} items ordered
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-black text-slate-900 block">
                    ₹{cat.revenue.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-100">
                    {cat.percentage}% share
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2 overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${colorGradient} transition-all duration-500`}
                  style={{ width: `${Math.max(6, cat.percentage)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <span className="font-semibold text-slate-700">Total Category Sales</span>
        <span className="font-black text-slate-900">₹{totalRevenue.toLocaleString('en-IN')}</span>
      </div>

    </div>
  );
}
