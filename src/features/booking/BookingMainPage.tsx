"use client";

import React, { useState } from "react";
import BookingHeader from "./components/BookingHeader";
import BookingSearch from "./components/BookingSearch";
import BookingTable from "./components/BookingTable";
import { useBooking } from "./hooks/useBooking";

const BookingMainPage = () => {
  const { bookingList, loading, error } = useBooking();

  const [searchQuery, setSearchQuery] = useState("");

  const filteredBookings = bookingList.filter((booking) => {
    const search = searchQuery.toLowerCase();

    return (
      booking.customer_name?.toLowerCase().includes(search) ||
      booking.phone_number?.includes(search)
    );
  });

  return (
    <div className="w-full space-y-6">

      {/* HEADER + SEARCH */}
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

        <BookingHeader />

        <BookingSearch
          value={searchQuery}
          onChange={setSearchQuery}
        />

      </div>

      {/* TABLE */}
      <BookingTable
        bookings={filteredBookings}
        loading={loading}
        error={error}
      />

    </div>
  );
};

export default BookingMainPage;