import React from "react";

interface BookingDetailsProps {
  booking: {
    special_request: string;
    status: string;
    created_at: string;
  };
}

const BookingDetails = ({
  booking,
}: BookingDetailsProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 border-t border-gray-200 pt-4 sm:grid-cols-3">

      <div>
        <p className="text-[9px] font-black uppercase tracking-wider text-gray-400">
          Special Request
        </p>

        <p className="mt-1 text-sm font-semibold text-brand-green-dark">
          {booking.special_request || "No special request"}
        </p>
      </div>

      <div>
        <p className="text-[9px] font-black uppercase tracking-wider text-gray-400">
          Status
        </p>

        <span className="mt-1 inline-flex rounded-full border border-brand-gold/40 bg-brand-gold/10 px-3 py-1 text-[9px] font-black uppercase text-brand-green-dark">
          {booking.status}
        </span>
      </div>

      <div>
        <p className="text-[9px] font-black uppercase tracking-wider text-gray-400">
          Created At
        </p>

        <p className="mt-1 text-sm font-semibold text-brand-green-dark">
          {new Date(booking.created_at).toLocaleString("en-IN")}
        </p>
      </div>

    </div>
  );
};

export default BookingDetails;