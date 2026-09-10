"use client";

import React from "react";
import BookingTableRow from "./BookingTableRow";
import BookingEmptyState from "./BookingEmptyState";

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
}

const BookingTable = ({
  bookings,
  loading,
  error,
}: BookingTableProps) => {
  if (loading) {
    return (
      <div className="rounded-3xl border border-brand-gold/20 bg-white p-20 text-center">
        <p className="text-xs font-black uppercase tracking-widest text-brand-green-dark/50">
          Loading reservations...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-20 text-center">
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
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">

      {/* DESKTOP TABLE */}
      <div className="hidden lg:block">

        <table className="w-full border-collapse">

          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">

              <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-wider text-gray-500">
                Name
              </th>

              <th className="px-5 py-5 text-left text-[10px] font-black uppercase tracking-wider text-gray-500">
                Mobile
              </th>

              <th className="px-5 py-5 text-left text-[10px] font-black uppercase tracking-wider text-gray-500">
                Email
              </th>

              <th className="px-5 py-5 text-left text-[10px] font-black uppercase tracking-wider text-gray-500">
                Date
              </th>

              <th className="px-5 py-5 text-left text-[10px] font-black uppercase tracking-wider text-gray-500">
                Time (IST)
              </th>

              <th className="px-5 py-5 text-center text-[10px] font-black uppercase tracking-wider text-gray-500">
                Guests
              </th>

              <th className="px-5 py-5 text-center text-[10px] font-black uppercase tracking-wider text-gray-500">
                Details
              </th>

            </tr>
          </thead>

          <tbody>
            {bookings.map((booking) => (
              <BookingTableRow
                key={booking.id}
                booking={booking}
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
          />
        ))}
      </div>

    </div>
  );
};

export default BookingTable;