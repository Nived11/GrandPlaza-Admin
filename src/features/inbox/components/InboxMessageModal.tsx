"use client";

import React from "react";
import { ContactMessage } from "../api/inboxApi";
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  Tag,
  CheckCircle2,
  MailX,
  ExternalLink,
} from "lucide-react";

interface InboxMessageModalProps {
  message: ContactMessage | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleRead: (id: number, currentStatus: boolean) => void;
}

export default function InboxMessageModal({
  message,
  isOpen,
  onClose,
  onToggleRead,
}: InboxMessageModalProps) {
  if (!isOpen || !message) return null;

  const formattedDate = message.created_at
    ? new Date(message.created_at).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "N/A";

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="bg-white border border-brand-gold/40 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-brand-green-dark px-6 py-4 flex items-center justify-between border-b border-brand-gold/30">
          <div className="flex items-center gap-2 text-brand-gold">
            <span className="font-serif font-black text-sm uppercase tracking-wider text-brand-cream">
              Message Details
            </span>
            <span className="text-xs text-brand-gold/80 font-mono">
              #{message.id}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-brand-cream/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto font-sans">
          
          {/* Sender Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-brand-gold/5 p-4 rounded-xl border border-brand-gold/20">
            {/* Sender Name */}
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-green-dark/10 flex items-center justify-center text-brand-green-dark shrink-0 mt-0.5">
                <User size={15} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  Sender Name
                </p>
                <p className="text-xs font-black text-brand-green-dark truncate">
                  {message.name || "Anonymous"}
                </p>
              </div>
            </div>

            {/* Date & Time */}
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-green-dark/10 flex items-center justify-center text-brand-green-dark shrink-0 mt-0.5">
                <Calendar size={15} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  Received On
                </p>
                <p className="text-xs font-bold text-gray-700 truncate">
                  {formattedDate}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-green-dark/10 flex items-center justify-center text-brand-green-dark shrink-0 mt-0.5">
                <Mail size={15} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  Email
                </p>
                {message.email ? (
                  <a
                    href={`mailto:${message.email}`}
                    className="text-xs font-bold text-brand-green-dark hover:text-brand-gold transition-colors inline-flex items-center gap-1 truncate"
                  >
                    <span className="truncate">{message.email}</span>
                    <ExternalLink size={10} className="shrink-0" />
                  </a>
                ) : (
                  <p className="text-xs text-gray-400">N/A</p>
                )}
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-green-dark/10 flex items-center justify-center text-brand-green-dark shrink-0 mt-0.5">
                <Phone size={15} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  Phone
                </p>
                {message.phone_number ? (
                  <a
                    href={`tel:${message.phone_number}`}
                    className="text-xs font-bold text-brand-green-dark hover:text-brand-gold transition-colors inline-flex items-center gap-1"
                  >
                    <span>{message.phone_number}</span>
                    <ExternalLink size={10} className="shrink-0" />
                  </a>
                ) : (
                  <p className="text-xs text-gray-400">N/A</p>
                )}
              </div>
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-brand-green-dark">
              <Tag size={14} className="text-brand-gold" />
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">
                Subject
              </span>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-xs font-black text-brand-green-dark">
                {message.subject || "No Subject"}
              </p>
            </div>
          </div>

          {/* Message Body */}
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-wider text-gray-500">
              Message Content
            </p>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 min-h-[120px]">
              <p className="text-xs text-gray-800 whitespace-pre-wrap leading-relaxed">
                {message.message || "Empty message body."}
              </p>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="bg-gray-100 px-6 py-3 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Read Status Badge */}
          <div>
            {message.is_read ? (
              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border border-emerald-300">
                <CheckCircle2 size={12} className="text-emerald-600" />
                Read
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border border-amber-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                Unread
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => onToggleRead(message.id, message.is_read)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-brand-green-dark text-brand-green-dark hover:bg-brand-green-dark hover:text-brand-cream text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs"
            >
              {message.is_read ? (
                <>
                  <MailX size={14} />
                  <span>Mark as Unread</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={14} />
                  <span>Mark as Read</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
