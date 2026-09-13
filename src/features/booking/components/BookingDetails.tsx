"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  CheckCheck,
  Loader2,
  Phone,
  Mail,
  Trash2,
  MessageSquare,
} from "lucide-react";

interface BookingDetailsProps {
  booking: {
    id: number;
    customer_name: string;
    phone_number: string;
    email: string;
    special_request: string;
    status: string;
    created_at: string;
  };
  onStatusChange?: (id: number, newStatus: string) => Promise<boolean | void>;
  onDeleteRequest?: (id: number) => void;
}

export default function BookingDetails({
  booking,
  onStatusChange,
  onDeleteRequest,
}: BookingDetailsProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusSelect = async (newStatus: string) => {
    if (newStatus.toLowerCase() === booking.status.toLowerCase() || isUpdating || !onStatusChange) return;
    setIsUpdating(true);
    await onStatusChange(booking.id, newStatus);
    setIsUpdating(false);
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "completed":
        return "bg-teal-100 text-teal-800 border-teal-300";
      case "cancelled":
        return "bg-rose-100 text-rose-800 border-rose-300";
      case "pending":
      default:
        return "bg-amber-100 text-amber-900 border-amber-300";
    }
  };

  const currentStatus = booking.status?.toLowerCase() || "pending";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-brand-gold/20 pt-4 bg-brand-gold/5 p-4 rounded-xl">
      {/* Special Request */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-brand-green-dark">
          <MessageSquare size={13} className="text-brand-gold shrink-0" />
          <p className="text-[10px] font-black uppercase tracking-wider text-gray-500">
            Special Request / Note
          </p>
        </div>
        <div className="p-3 bg-white rounded-xl border border-brand-gold/20 min-h-[60px]">
          <p className="text-xs font-semibold text-brand-green-dark leading-relaxed">
            {booking.special_request || "No special requests noted."}
          </p>
        </div>
      </div>

      {/* Status Management */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-black uppercase tracking-wider text-gray-500">
            Change Reservation Status
          </p>
          {isUpdating && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-brand-gold animate-pulse">
              <Loader2 size={11} className="animate-spin" /> Updating...
            </span>
          )}
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-2">
          <select
            value={currentStatus}
            disabled={isUpdating || !onStatusChange}
            onChange={(e) => handleStatusSelect(e.target.value)}
            className={`w-full text-xs font-black uppercase tracking-wider px-3 py-2 rounded-xl border outline-none cursor-pointer transition-all shadow-xs ${getStatusBadgeStyle(
              currentStatus
            )}`}
          >
            <option value="pending" className="bg-white text-gray-800 font-bold">
              🟡 Pending
            </option>
            <option value="confirmed" className="bg-white text-gray-800 font-bold">
              🟢 Confirmed
            </option>
            <option value="completed" className="bg-white text-gray-800 font-bold">
              🔵 Completed
            </option>
            <option value="cancelled" className="bg-white text-gray-800 font-bold">
              🔴 Cancelled
            </option>
          </select>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {currentStatus !== "confirmed" && (
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => handleStatusSelect("confirmed")}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-300 transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              <CheckCircle2 size={11} /> Confirm
            </button>
          )}

          {currentStatus !== "completed" && (
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => handleStatusSelect("completed")}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-teal-50 hover:bg-teal-600 text-teal-700 hover:text-white border border-teal-300 transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              <CheckCheck size={11} /> Complete
            </button>
          )}

          {currentStatus !== "cancelled" && (
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => handleStatusSelect("cancelled")}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-300 transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              <XCircle size={11} /> Cancel
            </button>
          )}

          {currentStatus !== "pending" && (
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => handleStatusSelect("pending")}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-amber-50 hover:bg-amber-600 text-amber-800 hover:text-white border border-amber-300 transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Clock size={11} /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Guest Contact & Timestamps */}
      <div className="space-y-2 flex flex-col justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-wider text-gray-500 mb-1">
            Quick Guest Actions
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {booking.phone_number && (
              <a
                href={`tel:${booking.phone_number}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-brand-gold/30 hover:border-brand-gold text-brand-green-dark text-xs font-bold transition-all shadow-xs"
              >
                <Phone size={12} className="text-brand-green-dark" />
                <span>Call</span>
              </a>
            )}

            {booking.email && (
              <a
                href={`mailto:${booking.email}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-brand-gold/30 hover:border-brand-gold text-brand-green-dark text-xs font-bold transition-all shadow-xs"
              >
                <Mail size={12} className="text-brand-green-dark" />
                <span>Email</span>
              </a>
            )}

            {onDeleteRequest && (
              <button
                type="button"
                onClick={() => onDeleteRequest(booking.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Trash2 size={12} />
                <span>Delete</span>
              </button>
            )}
          </div>
        </div>

        <div className="pt-2 border-t border-brand-gold/10">
          <p className="text-[9px] font-bold text-gray-400">
            Received: {new Date(booking.created_at).toLocaleString("en-IN")}
          </p>
        </div>
      </div>
    </div>
  );
}
