'use client';

import React from 'react';
import { Flame, Trophy, Award } from 'lucide-react';
import { TopSellingItem } from '../types/dashboardTypes';

interface TopSellingDishesProps {
  items: TopSellingItem[];
  periodLabel: string;
}

export default function TopSellingDishes({ items, periodLabel }: TopSellingDishesProps) {
  if (!items || items.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex flex-col items-center justify-center h-full text-center text-gray-400">
        <Flame size={32} className="text-gray-300 mb-2" />
        <p className="text-xs font-semibold">No food sales recorded for {periodLabel}.</p>
      </div>
    );
  }

  const maxQty = Math.max(...items.map((i) => i.quantity_sold), 1);

  const getRankBadge = (rank: number) => {
    if (rank === 0) {
      return (
        <span className="w-6 h-6 rounded-full bg-amber-400 text-amber-950 font-black text-xs flex items-center justify-center shadow-xs">
          #1
        </span>
      );
    }
    if (rank === 1) {
      return (
        <span className="w-6 h-6 rounded-full bg-slate-300 text-slate-800 font-black text-xs flex items-center justify-center shadow-xs">
          #2
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
          #3
        </span>
      );
    }
    return (
      <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 font-bold text-xs flex items-center justify-center">
        #{rank + 1}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-black">
            <Flame size={18} />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Top Selling Dishes
            </h3>
            <p className="text-[11px] text-gray-500">
              Customer favorites in {periodLabel}
            </p>
          </div>
        </div>

        <span className="text-[11px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
          Best Sellers
        </span>
      </div>

      {/* Dishes List */}
      <div className="divide-y divide-gray-100 mt-2 space-y-2 flex-grow">
        {items.map((item, idx) => {
          const isVeg = item.dietary === 'VEG';
          const percentage = Math.round((item.quantity_sold / maxQty) * 100);

          return (
            <div key={idx} className="pt-3 pb-2 first:pt-2">
              <div className="flex items-center justify-between gap-3">
                
                {/* Left: Rank & Dish name */}
                <div className="flex items-center gap-2.5 min-w-0">
                  {getRankBadge(idx)}

                  {/* Veg / Non-Veg Icon */}
                  <div
                    className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                      isVeg ? 'border-emerald-600' : 'border-rose-600'
                    }`}
                    title={isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        isVeg ? 'bg-emerald-600' : 'bg-rose-600'
                      }`}
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {item.name}
                    </p>
                    <span className="text-[10px] text-gray-400 font-medium">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Right: Quantity & Revenue */}
                <div className="text-right shrink-0">
                  <span className="text-xs font-black text-slate-900 block">
                    ₹{item.revenue.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] font-bold text-orange-600">
                    {item.quantity_sold} {item.quantity_sold === 1 ? 'order' : 'orders'}
                  </span>
                </div>
              </div>

              {/* Relative popularity bar */}
              <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    idx === 0
                      ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                      : idx === 1
                      ? 'bg-gradient-to-r from-orange-400 to-orange-500'
                      : 'bg-slate-400'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
