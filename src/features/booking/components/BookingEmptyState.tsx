import React from "react";

const BookingEmptyState = () => {
  return (
    <div className="flex min-h-[250px] items-center justify-center rounded-3xl border border-dashed border-brand-gold/30 bg-white">
      <div className="text-center">

        <p className="text-sm font-black uppercase tracking-widest text-brand-green-dark">
          No Reservations Found
        </p>

        <p className="mt-2 text-xs text-gray-400">
          There are no bookings matching your search.
        </p>

      </div>
    </div>
  );
};

export default BookingEmptyState;