"use client";

import React from "react";
import BookingTableRow from "./BookingTableRow";
import BookingEmptyState from "./BookingEmptyState";
import BookingTableSkeleton from "./BookingTableSkeleton";

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

interface BookingTableProps {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  onStatusChange?: (id: number, newStatus: string) => Promise<boolean | void>;
  onDeleteRequest?: (id: number) => void;
}

export default function BookingTable({
  bookings,
  loading,
  error,
  onStatusChange,
  onDeleteRequest,
}: BookingTableProps) {
  if (loading) {
    return <BookingTableSkeleton rowCount={8} />;
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-12 text-center shadow-xs">
        <p className="text-xs font-black uppercase tracking-widest text-red-600">
          {error}
        </p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return <BookingEmptyState />;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-brand-gold/20 bg-white shadow-sm">
      {/* DESKTOP TABLE */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse">
          <thead>
            <tr className="border-b border-brand-gold/20 bg-brand-green-dark">
              <th className="px-4 sm:px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest text-brand-gold">
                Guest / ID
              </th>
              <th className="px-4 sm:px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest text-brand-gold">
                Mobile
              </th>
              <th className="px-4 sm:px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest text-brand-gold">
                Email
              </th>
              <th className="px-4 sm:px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest text-brand-gold">
                Reservation Date
              </th>
              <th className="px-4 sm:px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest text-brand-gold">
                Time (IST)
              </th>
              <th className="px-4 sm:px-6 py-4 text-center text-[9px] font-black uppercase tracking-widest text-brand-gold">
                Guests
              </th>
              <th className="px-4 sm:px-6 py-4 text-left text-[9px] font-black uppercase tracking-widest text-brand-gold">
                Status
              </th>
              <th className="px-4 sm:px-6 py-4 text-right text-[9px] font-black uppercase tracking-widest text-brand-gold">
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <BookingTableRow
                key={booking.id}
                booking={booking}
                onStatusChange={onStatusChange}
                onDeleteRequest={onDeleteRequest}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE / TABLET */}
      <div className="grid gap-3 p-3 lg:hidden">
        {bookings.map((booking) => (
          <BookingTableRow
            key={booking.id}
            booking={booking}
            mobile
            onStatusChange={onStatusChange}
            onDeleteRequest={onDeleteRequest}
          />
        ))}
      </div>
    </div>
  );
}
