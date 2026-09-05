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
}

const BookingTableRow = ({
  booking,
  mobile = false,
}: BookingTableRowProps) => {
  const [expanded, setExpanded] = useState(false);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");

    const date = new Date();
    date.setHours(Number(hours), Number(minutes));

    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (mobile) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-4">

        <div className="flex items-start justify-between gap-3">

          <div>
            <h3 className="text-sm font-black text-brand-green-dark">
              {booking.customer_name}
            </h3>

            <p className="mt-1 text-[9px] font-bold uppercase text-gray-400">
              Booking #{booking.id}
            </p>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500"
          >
            <ChevronDown
              size={15}
              className={`transition-transform ${
                expanded ? "rotate-180" : ""
              }`}
            />
          </button>

        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">

          <div className="flex items-center gap-2">
            <Phone size={14} className="text-gray-400" />
            <span className="truncate text-xs font-semibold">
              {booking.phone_number}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Users size={14} className="text-gray-400" />
            <span className="text-xs font-semibold">
              {booking.number_of_guests} People
            </span>
          </div>

          <div className="flex items-center gap-2">
            <CalendarDays size={14} className="text-brand-gold" />
            <span className="text-xs font-semibold">
              {formatDate(booking.booking_date)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Clock3 size={14} className="text-gray-400" />
            <span className="text-xs font-semibold">
              {formatTime(booking.booking_time)}
            </span>
          </div>

        </div>

        {expanded && (
          <BookingDetails booking={booking} />
        )}

      </div>
    );
  }

  return (
    <>
      <tr className="border-b border-gray-100 transition-colors hover:bg-gray-50">

        {/* NAME */}
        <td className="px-8 py-5">
          <div>
            <p className="text-sm font-black text-brand-green-dark">
              {booking.customer_name}
            </p>

            <p className="mt-1 text-[9px] font-bold uppercase text-gray-400">
              Booking #{booking.id}
            </p>
          </div>
        </td>

        {/* MOBILE */}
        <td className="px-5 py-5">
          <div className="flex items-center gap-2">

            <Phone
              size={14}
              className="text-gray-400"
            />

            <span className="text-xs font-semibold text-brand-green-dark">
              {booking.phone_number}
            </span>

          </div>
        </td>

        {/* EMAIL */}
        <td className="max-w-[220px] px-5 py-5">
          <div className="flex items-center gap-2">

            <Mail
              size={14}
              className="shrink-0 text-gray-400"
            />

            <span className="truncate text-xs text-gray-500">
              {booking.email || "N/A"}
            </span>

          </div>
        </td>

        {/* DATE */}
        <td className="px-5 py-5">
          <div className="flex items-center gap-2">

            <CalendarDays
              size={14}
              className="text-brand-gold"
            />

            <span className="text-xs font-bold text-brand-green-dark">
              {formatDate(booking.booking_date)}
            </span>

          </div>
        </td>

        {/* TIME */}
        <td className="px-5 py-5">
          <div className="flex items-center gap-2">

            <Clock3
              size={14}
              className="text-gray-400"
            />

            <span className="text-xs font-bold text-gray-500">
              {formatTime(booking.booking_time)}
            </span>

          </div>
        </td>

        {/* GUESTS */}
        <td className="px-5 py-5 text-center">

          <span className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-black text-gray-700">

            <Users size={14} />

            {booking.number_of_guests} People

          </span>

        </td>

        {/* DETAILS */}
        <td className="px-5 py-5 text-center">

          <button
            onClick={() => setExpanded(!expanded)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-all hover:bg-brand-gold hover:text-brand-green-dark"
          >
            <ChevronDown
              size={15}
              className={`transition-transform ${
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
            colSpan={7}
            className="border-b border-gray-100 bg-gray-50 px-8 py-5"
          >
            <BookingDetails booking={booking} />
          </td>
        </tr>
      )}
    </>
  );
};

export default BookingTableRow;