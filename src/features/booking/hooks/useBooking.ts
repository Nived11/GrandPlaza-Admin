"use client";

import { useState, useEffect } from "react";
import { getBookingsApi } from "../api/bookingApi";
import { toast } from "sonner";
import { extractErrorMessages } from "@/utils/extractErrorMessages";

export function useBooking() {
  const [bookingList, setBookingList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getBookingsApi();

      // If API returns an array
      if (Array.isArray(data)) {
        setBookingList(data);
      }
      // If API returns { results: [] }
      else {
        setBookingList(data.results || data.data || []);
      }
    } catch (err: any) {
      console.error("Error fetching bookings:", err);

      const msg = extractErrorMessages(err);

      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return {
    bookingList,
    loading,
    error,
    fetchBookings,
    refreshBookings: fetchBookings,
  };
}