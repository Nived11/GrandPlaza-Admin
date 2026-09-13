"use client";

import React, { useState, useMemo } from "react";
import BookingHeader from "./components/BookingHeader";
import BookingStats from "./components/BookingStats";
import BookingSearch from "./components/BookingSearch";
import BookingTable from "./components/BookingTable";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Pagination from "@/components/ui/Pagination";
import { useBooking } from "./hooks/useBooking";

export default function BookingMainPage() {
  const {
    bookingList,
    loading,
    error,
    updateBookingStatus,
    deleteBooking,
  } = useBooking();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  // Pagination State
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Delete Confirm State
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Status Metrics
  const metrics = useMemo(() => {
    let pending = 0;
    let confirmed = 0;
    let completed = 0;
    let cancelled = 0;

    for (const b of bookingList) {
      const s = b.status?.toLowerCase();
      if (s === "pending") pending++;
      else if (s === "confirmed") confirmed++;
      else if (s === "completed") completed++;
      else if (s === "cancelled") cancelled++;
    }

    return {
      total: bookingList.length,
      pending,
      confirmed,
      completed,
      cancelled,
    };
  }, [bookingList]);

  // Filter Bookings
  const filteredBookings = useMemo(() => {
    return bookingList.filter((booking) => {
      // 1. Status Filter
      if (statusFilter !== "all") {
        if (booking.status?.toLowerCase() !== statusFilter) return false;
      }

      // 2. Date Filter
      if (dateFilter) {
        if (booking.booking_date !== dateFilter) return false;
      }

      // 3. Search Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = booking.customer_name?.toLowerCase().includes(q);
        const matchesPhone = booking.phone_number?.includes(q);
        const matchesEmail = booking.email?.toLowerCase().includes(q);
        const matchesId = String(booking.id).includes(q);

        if (!matchesName && !matchesPhone && !matchesEmail && !matchesId) {
          return false;
        }
      }

      return true;
    });
  }, [bookingList, statusFilter, dateFilter, searchQuery]);

  // Paginated Sliced Bookings
  const totalCount = filteredBookings.length;
  const paginatedBookings = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredBookings.slice(start, start + pageSize);
  }, [filteredBookings, page, pageSize]);

  // Reset page when filters change
  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setPage(1);
  };

  const handleDateChange = (date: string) => {
    setDateFilter(date);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setDateFilter("");
    setPage(1);
  };

  const isFiltered = Boolean(
    searchQuery.trim() || statusFilter !== "all" || dateFilter
  );

  // Delete Handlers
  const handleRequestDelete = (id: number) => {
    setDeleteTargetId(id);
  };

  const handleConfirmDelete = async () => {
    if (deleteTargetId === null) return;
    setIsDeleting(true);
    const success = await deleteBooking(deleteTargetId);
    setIsDeleting(false);
    if (success) {
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="min-h-screen w-full text-slate-900 p-2 sm:p-4 lg:p-4 font-sans antialiased space-y-4 sm:space-y-6 overflow-x-hidden">
      
      {/* 🟢 Luxury Branded Header */}
      <BookingHeader
        totalBookings={metrics.total}
        pendingCount={metrics.pending}
      />

      {/* 📊 Interactive Metric Filter Cards */}
      <BookingStats
        totalCount={metrics.total}
        pendingCount={metrics.pending}
        confirmedCount={metrics.confirmed}
        completedCount={metrics.completed}
        cancelledCount={metrics.cancelled}
        activeStatus={statusFilter}
        onSelectStatus={handleStatusFilterChange}
      />

      {/* 🔍 Search Bar & Date Picker */}
      <BookingSearch
        value={searchQuery}
        onChange={handleSearchChange}
        dateFilter={dateFilter}
        onDateFilterChange={handleDateChange}
        onReset={handleResetFilters}
        isFiltered={isFiltered}
      />

      {/* 📋 Bookings Table / Skeleton / Empty */}
      <div className="px-2 sm:px-4 space-y-4">
        <BookingTable
          bookings={paginatedBookings}
          loading={loading}
          error={error}
          onStatusChange={updateBookingStatus}
          onDeleteRequest={handleRequestDelete}
        />

        {/* 🔢 Reusable Pagination */}
        {totalCount > 0 && (
          <Pagination
            page={page}
            totalCount={totalCount}
            pageSize={pageSize}
            onPageChange={setPage}
            isLoading={loading}
            hasNextPage={page * pageSize < totalCount}
            hasPreviousPage={page > 1}
          />
        )}
      </div>

      {/* 🗑️ Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Reservation"
        description="Are you sure you want to permanently delete this table reservation? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />

    </div>
  );
}
