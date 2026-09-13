"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getBookingsApi,
  updateBookingStatusApi,
  deleteBookingApi,
} from "../api/bookingApi";
import { toast } from "sonner";
import { extractErrorMessages } from "@/utils/extractErrorMessages";

export function useBooking() {
  const [bookingList, setBookingList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getBookingsApi();

      if (Array.isArray(data)) {
        setBookingList(data);
      } else if (data && Array.isArray(data.results)) {
        setBookingList(data.results);
      } else if (data && Array.isArray(data.data)) {
        setBookingList(data.data);
      } else {
        setBookingList([]);
      }
    } catch (err: any) {
      console.error("Error fetching bookings:", err);
      const msg = extractErrorMessages(err);
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const updateBookingStatus = async (id: number, newStatus: string) => {
    try {
      await updateBookingStatusApi(id, newStatus);
      toast.success(`Booking #${id} status updated to ${newStatus.toUpperCase()}`);

      // Instant UI update
      setBookingList((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
      );
      return true;
    } catch (err: any) {
      console.error("Error updating booking status:", err);
      const msg = extractErrorMessages(err);
      toast.error(msg);
      return false;
    }
  };

  const deleteBooking = async (id: number) => {
    try {
      await deleteBookingApi(id);
      toast.success("Booking deleted successfully");
      setBookingList((prev) => prev.filter((b) => b.id !== id));
      return true;
    } catch (err: any) {
      console.error("Error deleting booking:", err);
      const msg = extractErrorMessages(err);
      toast.error(msg);
      return false;
    }
  };

  return {
    bookingList,
    loading,
    error,
    fetchBookings,
    refreshBookings: fetchBookings,
    updateBookingStatus,
    deleteBooking,
  };
}
