"use client";

import React from "react";
import { Search, Mail, MailOpen, Inbox } from "lucide-react";

interface InboxSearchProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  unreadCount: number;
}

export default function InboxSearch({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  unreadCount,
}: InboxSearchProps) {
  const filterTabs = [
    { key: "all", label: "All Messages", icon: Inbox },
    { key: "unread", label: "Unread", icon: Mail, badge: unreadCount },
    { key: "read", label: "Read", icon: MailOpen },
  ];

  return (
    <div className="w-full flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      {/* 🔍 Search Input */}
      <div className="relative w-full md:max-w-xs">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-green-dark/50"
          size={16}
        />
        <input
          type="text"
          placeholder="Search by name, email, subject..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-brand-gold/40 rounded-xl py-3 pl-11 pr-4 text-xs font-bold outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all shadow-sm placeholder:text-gray-400 text-brand-green-dark"
        />
      </div>

      {/* 🏷️ Status Filter Tabs */}
      <div className="inline-flex items-center bg-white border border-brand-gold/30 p-1 rounded-xl shadow-xs self-start md:self-auto overflow-x-auto max-w-full">
        {filterTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = statusFilter === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-brand-green-dark text-brand-cream shadow-xs"
                  : "text-gray-600 hover:text-brand-green-dark hover:bg-brand-gold/10"
              }`}
            >
              <Icon size={14} className={isActive ? "text-brand-gold" : "text-gray-400"} />
              <span>{tab.label}</span>
              {typeof tab.badge === "number" && tab.badge > 0 && (
                <span
                  className={`ml-1 px-1.5 py-0.5 rounded-full text-[9px] font-black leading-none ${
                    isActive
                      ? "bg-red-600 text-white"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
