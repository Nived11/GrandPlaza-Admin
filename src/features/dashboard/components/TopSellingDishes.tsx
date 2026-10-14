'use client';

import React, { useState } from 'react';
import { Flame, Trophy, Award, TrendingUp, Sparkles, ChefHat } from 'lucide-react';
import { TopSellingItem } from '../types/dashboardTypes';

interface TopSellingDishesProps {
  items: TopSellingItem[];
  allTimeItems?: TopSellingItem[];
  periodLabel: string;
}

export default function TopSellingDishes({
  items,
  allTimeItems = [],
  periodLabel,
}: TopSellingDishesProps) {
  // If period has items, default to period; otherwise default to all-time
  const hasPeriodItems = items && items.length > 0;
  const [selectedView, setSelectedView] = useState<'period' | 'allTime'>(
    hasPeriodItems ? 'period' : 'allTime'
  );

  // Active items to display based on selected view
  const activeItems =
    selectedView === 'period' && hasPeriodItems
      ? items
      : allTimeItems.length > 0
      ? allTimeItems
      : items || [];

  const maxQty = Math.max(...activeItems.map((i) => i.quantity_sold), 1);
  const totalVolume = activeItems.reduce((acc, i) => acc + i.quantity_sold, 0);

  const getRankBadge = (rank: number) => {
    if (rank === 0) {
      return (
        <span className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 font-black text-xs flex items-center justify-center shadow-sm shrink-0">
          🥇
        </span>
      );
    }
    if (rank === 1) {
      return (
        <span className="w-6 h-6 rounded-full bg-gradient-to-tr from-slate-300 to-gray-100 text-slate-900 font-black text-xs flex items-center justify-center shadow-xs shrink-0">
          🥈
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-700 to-amber-500 text-white font-black text-xs flex items-center justify-center shadow-xs shrink-0">
          🥉
        </span>
      );
    }
    return (
      <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 font-bold text-xs flex items-center justify-center shrink-0">
        #{rank + 1}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs flex flex-col justify-between">
      
      {/* 👑 Top Header & View Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-black shadow-xs shrink-0">
            <Flame size={19} className="text-orange-600" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>Top Selling Dishes</span>
              <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                Most Sold
              </span>
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {selectedView === 'period'
                ? `Customer favorites in ${periodLabel}`
                : 'All-time highest ordered dishes in restaurant'}
            </p>
          </div>
        </div>

        {/* View Switcher: Period vs All-Time */}
        <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-2xl border border-gray-200/80 text-xs font-bold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setSelectedView('period')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer text-xs font-bold ${
              selectedView === 'period'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {periodLabel}
          </button>
          <button
            type="button"
            onClick={() => setSelectedView('allTime')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl transition cursor-pointer text-xs font-bold ${
              selectedView === 'allTime'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Trophy size={13} />
            <span>All-Time Bestsellers</span>
          </button>
        </div>
      </div>

      {/* Info notice if period has 0 items and automatically showing all-time */}
      {!hasPeriodItems && selectedView === 'period' && (
        <div className="mt-3 bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-900 flex items-center justify-between">
          <span className="font-medium">
            No completed sales in {periodLabel} yet.
          </span>
          <button
            type="button"
            onClick={() => setSelectedView('allTime')}
            className="font-bold underline text-amber-950 cursor-pointer"
          >
            View All-Time Top Sellers ➔
          </button>
        </div>
      )}

      {/* 🍽️ Dishes Ranking List */}
      {activeItems.length === 0 ? (
        <div className="p-8 text-center text-gray-400 space-y-2">
          <ChefHat size={32} className="mx-auto text-gray-300" />
          <p className="text-xs font-medium">No dish sales recorded yet.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100 mt-2 space-y-2 flex-grow">
          {activeItems.map((item, idx) => {
            const isVeg = item.dietary === 'VEG';
            const percentage = Math.round((item.quantity_sold / maxQty) * 100);

            return (
              <div key={idx} className="pt-3 pb-2 first:pt-2">
                <div className="flex items-center justify-between gap-3">
                  
                  {/* Left: Rank & Dish name */}
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
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
                      <p className="text-xs sm:text-sm font-black text-slate-900 truncate">
                        {item.name}
                      </p>
                      <span className="text-[10px] text-gray-400 font-semibold block truncate">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Right: Quantity & Revenue */}
                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-slate-900 block">
                      ₹{item.revenue.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] font-black text-orange-600">
                      {item.quantity_sold} {item.quantity_sold === 1 ? 'sold' : 'sold'}
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
                        ? 'bg-gradient-to-r from-orange-400 to-amber-500'
                        : idx === 2
                        ? 'bg-gradient-to-r from-amber-600 to-orange-400'
                        : 'bg-slate-400'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Summary Pill */}
      {activeItems.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1.5 font-bold text-slate-700">
            <TrendingUp size={14} className="text-emerald-600" />
            Top {activeItems.length} Dishes
          </span>
          <span className="font-black text-slate-900">
            {totalVolume} Items Sold Total
          </span>
        </div>
      )}

    </div>
  );
}
