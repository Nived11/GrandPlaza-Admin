"use client";

import React, { useState } from "react";
import {
  CalendarDays,
  Clock3,
  Mail,
  Phone,
  Users,
  ChevronDown,
} from "lucide-react";
import BookingDetails from "./BookingDetails";

interface Booking {
  id: number;
  customer_name: string;
  phone_number: string;
  email: string;
  number_of_guests: number;
  booking_date: string;
  booking_time: string;
  special_request: string;
  status: string;
  created_at: string;
}

interface BookingTableRowProps {
  booking: Booking;
  mobile?: boolean;
  onStatusChange?: (id: number, newStatus: string) => Promise<boolean | void>;
  onDeleteRequest?: (id: number) => void;
}

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

export default function BookingTableRow({
  booking,
  mobile = false,
  onStatusChange,
  onDeleteRequest,
}: BookingTableRowProps) {
  const [expanded, setExpanded] = useState(false);

  const formatDate = (date: string) => {
    try {
      return new Date(date).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return date;
    }
  };

  const formatTime = (time: string) => {
    try {
      const [hours, minutes] = time.split(":");
      const date = new Date();
      date.setHours(Number(hours), Number(minutes));

      return date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return time;
    }
  };

  if (mobile) {
    return (
      <div className="rounded-2xl border border-brand-gold/20 bg-white p-4 shadow-xs">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-black text-brand-green-dark">
              {booking.customer_name}
            </h3>

            <div className="mt-1 flex items-center gap-2">
              <p className="text-[9px] font-bold uppercase text-gray-400">
                Booking #{booking.id}
              </p>
              <span
                className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase border ${getStatusBadgeStyle(
                  booking.status
                )}`}
              >
                {booking.status}
              </span>
            </div>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-gold/10 text-brand-green-dark hover:bg-brand-gold/20 transition-all cursor-pointer"
          >
            <ChevronDown
              size={15}
              className={`transition-transform duration-200 ${
                expanded ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2 text-gray-600">
            <Phone size={13} className="text-brand-green-dark/60 shrink-0" />
            <span className="truncate font-semibold">{booking.phone_number}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <Users size={13} className="text-brand-green-dark/60 shrink-0" />
            <span className="font-semibold">{booking.number_of_guests} Guests</span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <CalendarDays size={13} className="text-brand-gold shrink-0" />
            <span className="font-semibold">{formatDate(booking.booking_date)}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <Clock3 size={13} className="text-brand-green-dark/60 shrink-0" />
            <span className="font-semibold">{formatTime(booking.booking_time)}</span>
          </div>
        </div>

        {expanded && (
          <div className="mt-4">
            <BookingDetails
              booking={booking}
              onStatusChange={onStatusChange}
              onDeleteRequest={onDeleteRequest}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <tr
        className="border-b border-brand-gold/10 hover:bg-brand-gold/5 transition-colors cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        {/* GUEST / ID */}
        <td className="px-4 sm:px-6 py-4 text-left">
          <div>
            <p className="text-xs sm:text-sm font-black text-brand-green-dark">
              {booking.customer_name}
            </p>
            <p className="text-[9px] font-bold text-gray-400 mt-0.5">
              Booking #{booking.id}
            </p>
          </div>
        </td>

        {/* MOBILE */}
        <td className="px-4 sm:px-6 py-4 text-left">
          <div className="flex items-center justify-start gap-1.5 text-gray-600">
            <Phone size={13} className="text-brand-green-dark/50 shrink-0" />
            <span className="text-xs font-semibold whitespace-nowrap">
              {booking.phone_number}
            </span>
          </div>
        </td>

        {/* EMAIL */}
        <td className="px-4 sm:px-6 py-4 text-left max-w-[200px]">
          <div className="flex items-center justify-start gap-1.5 text-gray-600">
            <Mail size={13} className="text-brand-green-dark/50 shrink-0" />
            <span className="text-xs truncate">
              {booking.email || "N/A"}
            </span>
          </div>
        </td>

        {/* DATE */}
        <td className="px-4 sm:px-6 py-4 text-left">
          <div className="flex items-center justify-start gap-1.5 text-brand-green-dark">
            <CalendarDays size={13} className="text-brand-gold shrink-0" />
            <span className="text-xs font-bold whitespace-nowrap">
              {formatDate(booking.booking_date)}
            </span>
          </div>
        </td>

        {/* TIME */}
        <td className="px-4 sm:px-6 py-4 text-left">
          <div className="flex items-center justify-start gap-1.5 text-gray-600">
            <Clock3 size={13} className="text-brand-green-dark/50 shrink-0" />
            <span className="text-xs font-semibold whitespace-nowrap">
              {formatTime(booking.booking_time)}
            </span>
          </div>
        </td>

        {/* GUESTS */}
        <td className="px-4 sm:px-6 py-4 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-black text-gray-700">
            <Users size={12} />
            <span>{booking.number_of_guests}</span>
          </span>
        </td>

        {/* STATUS */}
        <td className="px-4 sm:px-6 py-4 text-left">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${getStatusBadgeStyle(
              booking.status
            )}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {booking.status}
          </span>
        </td>

        {/* ACTIONS */}
        <td
          className="px-4 sm:px-6 py-4 text-right"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setExpanded(!expanded)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-gold/10 hover:bg-brand-green-dark hover:text-brand-gold text-brand-green-dark transition-all cursor-pointer shadow-xs"
            title="Toggle Details"
          >
            <ChevronDown
              size={15}
              className={`transition-transform duration-200 ${
                expanded ? "rotate-180" : ""
              }`}
            />
          </button>
        </td>
      </tr>

      {/* EXPANDED DETAILS */}
      {expanded && (
        <tr>
          <td
            colSpan={8}
            className="border-b border-brand-gold/20 bg-brand-gold/5 px-4 sm:px-6 py-4"
          >
            <BookingDetails
              booking={booking}
              onStatusChange={onStatusChange}
              onDeleteRequest={onDeleteRequest}
            />
          </td>
        </tr>
      )}
    </>
  );
}
