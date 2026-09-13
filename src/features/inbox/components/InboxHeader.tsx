"use client";

import React from "react";
import { Mail, MessageSquare } from "lucide-react";

interface InboxHeaderProps {
  unreadCount: number;
}

export default function InboxHeader({ unreadCount }: InboxHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-brand-green-dark p-2 sm:p-6">
      <div className="flex items-center gap-3">
        <div className="relative w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-brand-green-dark border border-brand-gold flex items-center justify-center text-brand-cream shadow-md shrink-0">
          <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-red-600 text-[9px] sm:text-[10px] font-black text-white ring-2 ring-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </div>

        <div className="text-left">
          <h1 className="text-base sm:text-2xl font-black text-brand-green-dark tracking-tight font-sans uppercase leading-tight">
            Customer <span className="text-brand-gold">Inbox</span>
          </h1>

          <p className="text-[10px] sm:text-sm font-medium text-gray-600 font-sans mt-0.5 leading-tight flex items-center gap-1.5">
            <MessageSquare size={12} className="text-brand-gold shrink-0" />
            <span>Customer inquiries & feedback</span>
            {unreadCount > 0 && (
              <span className="ml-1 inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>
      </div>
    </header>
  );
}
