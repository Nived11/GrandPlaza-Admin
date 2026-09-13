"use client";

import React from "react";
import InboxTableRow from "./InboxTableRow";
import { ContactMessage } from "../api/inboxApi";

interface InboxTableProps {
  messages: ContactMessage[];
  onView: (msg: ContactMessage) => void;
  onToggleRead: (id: number, currentStatus: boolean) => void;
  onDeleteRequest: (id: number) => void;
}

export default function InboxTable({
  messages,
  onView,
  onToggleRead,
  onDeleteRequest,
}: InboxTableProps) {
  if (messages.length === 0) {
    return (
      <div className="py-14 text-center text-xs font-bold text-gray-400 bg-white rounded-2xl border border-brand-gold/20 shadow-xs">
        No messages found.
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-brand-gold/20 bg-white shadow-sm">
      <table className="w-full min-w-[850px]">
        <thead>
          <tr className="border-b border-brand-gold/20 bg-brand-green-dark">
            <th className="px-4 sm:px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest text-brand-gold">
              Sender
            </th>
            <th className="px-4 sm:px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest text-brand-gold">
              Subject
            </th>
            <th className="px-4 sm:px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest text-brand-gold">
              Email
            </th>
            <th className="px-4 sm:px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest text-brand-gold">
              Phone
            </th>
            <th className="px-4 sm:px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest text-brand-gold">
              Status
            </th>
            <th className="px-4 sm:px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest text-brand-gold">
              Date
            </th>
            <th className="px-4 sm:px-6 py-4 text-right text-[9px] font-black uppercase tracking-widest text-brand-gold">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {messages.map((msg) => (
            <InboxTableRow
              key={msg.id}
              message={msg}
              onView={onView}
              onToggleRead={onToggleRead}
              onDeleteRequest={onDeleteRequest}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
