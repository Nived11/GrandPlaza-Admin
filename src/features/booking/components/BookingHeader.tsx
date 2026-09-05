import React from "react";

const BookingHeader = () => {
  return (
    <div>
      <h1 className="text-3xl font-black uppercase tracking-tight text-brand-green-dark sm:text-4xl">
        Reservation <span className="text-brand-gold">Lists</span>
      </h1>

      <p className="mt-1 text-[10px] font-black uppercase tracking-[0.25em] text-brand-green-dark/60">
        Manage your restaurant reservations
      </p>
    </div>
  );
};

export default BookingHeader;