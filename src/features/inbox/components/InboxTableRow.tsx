"use client";

import React from "react";
import { Mail, Phone, Calendar, Eye, Trash2, CheckCircle2, MailX } from "lucide-react";
import { ContactMessage } from "../api/inboxApi";

interface InboxTableRowProps {
  message: ContactMessage;
  onView: (msg: ContactMessage) => void;
  onToggleRead: (id: number, currentStatus: boolean) => void;
  onDeleteRequest: (id: number) => void;
}

export default function InboxTableRow({
  message,
  onView,
  onToggleRead,
  onDeleteRequest,
}: InboxTableRowProps) {
  const formattedDate = message.created_at
    ? new Date(message.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";

  return (
    <tr
      className={`border-b border-brand-gold/10 transition-colors cursor-pointer ${
        message.is_read ? "hover:bg-brand-gold/5 bg-white" : "bg-amber-50/40 hover:bg-amber-100/40 font-medium"
      }`}
      onClick={() => onView(message)}
    >
      {/* Status Dot & Sender Name */}
      <td className="px-4 sm:px-6 py-4 text-left">
        <div className="flex items-center gap-2.5">
          <span
            className={`w-2.5 h-2.5 rounded-full shrink-0 ${
              message.is_read ? "bg-gray-300" : "bg-amber-500 animate-pulse"
            }`}
            title={message.is_read ? "Read" : "Unread"}
          />
          <div className="min-w-0 text-left">
            <p className={`text-xs sm:text-sm truncate ${
              message.is_read ? "font-bold text-gray-800" : "font-black text-brand-green-dark"
            }`}>
              {message.name || "Anonymous"}
            </p>
            <p className="text-[9px] text-gray-400 font-bold mt-0.5">
              #{message.id}
            </p>
          </div>
        </div>
      </td>

      {/* Subject */}
      <td className="px-4 sm:px-6 py-4 text-left max-w-[220px]">
        <p className={`text-xs truncate ${
          message.is_read ? "text-gray-700" : "font-black text-brand-green-dark"
        }`}>
          {message.subject || "No Subject"}
        </p>
        <p className="text-[10px] text-gray-400 truncate max-w-[200px] mt-0.5">
          {message.message}
        </p>
      </td>

      {/* Email */}
      <td className="px-4 sm:px-6 py-4 text-left">
        <div className="flex items-center justify-start gap-1.5 text-gray-600">
          <Mail size={13} className="text-brand-green-dark/50 shrink-0" />
          <span className="text-xs truncate max-w-[170px]">
            {message.email || "N/A"}
          </span>
        </div>
      </td>

      {/* Phone */}
      <td className="px-4 sm:px-6 py-4 text-left">
        <div className="flex items-center justify-start gap-1.5 text-gray-600">
          <Phone size={13} className="text-brand-green-dark/50 shrink-0" />
          <span className="text-xs whitespace-nowrap">
            {message.phone_number || "N/A"}
          </span>
        </div>
      </td>

      {/* Status Badge */}
      <td className="px-4 sm:px-6 py-4 text-left">
        {message.is_read ? (
          <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-gray-300">
            <CheckCircle2 size={10} className="text-gray-500" />
            Read
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
            Unread
          </span>
        )}
      </td>

      {/* Date */}
      <td className="px-4 sm:px-6 py-4 text-left">
        <div className="flex items-center justify-start gap-1.5 text-gray-500">
          <Calendar size={13} className="text-brand-green-dark/40 shrink-0" />
          <span className="text-xs whitespace-nowrap">{formattedDate}</span>
        </div>
      </td>

      {/* Actions */}
      <td
        className="px-4 sm:px-6 py-4 text-right"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-end gap-1.5">
          {/* View Details Button */}
          <button
            onClick={() => onView(message)}
            title="View message"
            className="p-1.5 rounded-lg text-brand-green-dark hover:bg-brand-gold/20 transition-colors cursor-pointer"
          >
            <Eye size={15} />
          </button>

          {/* Toggle Read / Unread Button */}
          <button
            onClick={() => onToggleRead(message.id, message.is_read)}
            title={message.is_read ? "Mark as unread" : "Mark as read"}
            className="p-1.5 rounded-lg text-amber-700 hover:bg-amber-100 transition-colors cursor-pointer"
          >
            {message.is_read ? <MailX size={15} /> : <CheckCircle2 size={15} />}
          </button>

          {/* Delete Button */}
          <button
            onClick={() => onDeleteRequest(message.id)}
            title="Delete message"
            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
}
