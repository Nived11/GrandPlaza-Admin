'use client';

import React from 'react';
import Link from 'next/link';
import { ChefHat, UtensilsCrossed, Users, Settings, Wallet, ArrowUpRight } from 'lucide-react';

export default function DashboardQuickActions() {
  const actions = [
    {
      title: 'Live Kitchen POS',
      subtitle: 'Dispatch & manage active orders',
      href: '/orders',
      icon: ChefHat,
      color: 'bg-orange-500 text-white shadow-orange-500/20',
      tag: 'Real-time',
    },
    {
      title: 'Menu & Food Items',
      subtitle: 'Add new dishes & edit prices',
      href: '/menu',
      icon: UtensilsCrossed,
      color: 'bg-emerald-600 text-white shadow-emerald-600/20',
      tag: 'Catalog',
    },
    {
      title: 'Customer Directory',
      subtitle: 'View patrons & order history',
      href: '/customers',
      icon: Users,
      color: 'bg-blue-600 text-white shadow-blue-600/20',
      tag: 'Patrons',
    },
    {
      title: 'Revenue & Accounts',
      subtitle: 'Financial ledger & payouts',
      href: '/revenue',
      icon: Wallet,
      color: 'bg-purple-600 text-white shadow-purple-600/20',
      tag: 'Reports',
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-100 shadow-xs space-y-3">
      <div className="flex items-center justify-between px-1">
        <h4 className="text-xs font-black uppercase tracking-wider text-gray-500">
          Quick Restaurant Actions
        </h4>
        <span className="text-[10px] font-bold text-gray-400">Direct Navigation</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <Link
              key={act.title}
              href={act.href}
              className="p-3.5 rounded-2xl bg-gray-50/70 hover:bg-gray-100/80 border border-gray-100 transition-all hover:scale-[1.01] active:scale-[0.99] group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-black shadow-sm ${act.color}`}
                >
                  <Icon size={18} />
                </div>
                <ArrowUpRight
                  size={15}
                  className="text-gray-400 group-hover:text-slate-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                />
              </div>

              <div className="mt-3">
                <span className="text-xs font-black text-slate-900 block group-hover:text-emerald-700 transition-colors">
                  {act.title}
                </span>
                <span className="text-[10px] text-gray-500 font-medium block truncate mt-0.5">
                  {act.subtitle}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
