"use client";

import React, { useState } from "react";
import ReviewsHeader from "./components/ReviewsHeader";
import ReviewsStats from "./components/ReviewsStats";
import ReviewsFilters from "./components/ReviewsFilters";
import ReviewsTable from "./components/ReviewsTable";
import ReviewsTableSkeleton from "./components/ReviewsTableSkeleton";
import ReviewDetailsModal from "./components/ReviewDetailsModal";
import Pagination from "@/components/ui/Pagination";
import { useReviews } from "./hooks/useReviews";
import { ReviewItem } from "./api/reviewsApi";

export default function ReviewsMainPage() {
  const {
    reviews,
    loading,
    error,
    page,
    setPage,
    totalCount,
    hasNextPage,
    hasPreviousPage,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    ratingFilter,
    setRatingFilter,
    stats,
    toggleApproval,
  } = useReviews();

  // Selected review for details modal
  const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (rev: ReviewItem) => {
    setSelectedReview(rev);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReview(null);
  };

  const isFiltered = Boolean(
    searchQuery.trim() || statusFilter !== "all" || ratingFilter !== "all"
  );

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setRatingFilter("all");
    setPage(1);
  };

  return (
    <div className="min-h-screen w-full text-slate-900 p-2 sm:p-4 lg:p-4 font-sans antialiased space-y-4 sm:space-y-6 overflow-x-hidden">
      
      {/* 🟢 Luxury Header */}
      <ReviewsHeader
        totalReviews={stats.total}
        averageRating={stats.averageRating}
      />

      {/* 📊 Metric Stat Filter Cards */}
      <ReviewsStats
        total={stats.total}
        averageRating={stats.averageRating}
        approvedCount={stats.approvedCount}
        hiddenCount={stats.hiddenCount}
        fiveStarCount={stats.fiveStarCount}
        activeStatus={statusFilter}
        onSelectStatus={setStatusFilter}
        activeRating={ratingFilter}
        onSelectRating={setRatingFilter}
      />

      {/* 🔍 Search & Filter Pills */}
      <ReviewsFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        ratingFilter={ratingFilter}
        onRatingChange={setRatingFilter}
        onReset={handleResetFilters}
        isFiltered={isFiltered}
      />

      {/* 📋 Reviews Table / Skeleton / Error */}
      {loading ? (
        <div className="px-2 sm:px-4">
          <ReviewsTableSkeleton rowCount={10} />
        </div>
      ) : error ? (
        <div className="px-2 sm:px-4 py-12 text-center">
          <p className="text-xs font-bold text-red-500">{error}</p>
        </div>
      ) : (
        <div className="px-2 sm:px-4 space-y-4">
          <ReviewsTable
            reviews={reviews}
            onView={handleOpenModal}
            onToggleApproval={toggleApproval}
          />

          {/* 🔢 Reusable Pagination */}
          <Pagination
            page={page}
            totalCount={totalCount}
            pageSize={12}
            onPageChange={setPage}
            isLoading={loading}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
          />
        </div>
      )}

      {/* 🌟 Review Details Modal */}
      <ReviewDetailsModal
        review={selectedReview}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onToggleApproval={async (id, currentStatus) => {
          const success = await toggleApproval(id, currentStatus);
          if (success && selectedReview) {
            setSelectedReview({
              ...selectedReview,
              is_approved: !currentStatus,
            });
          }
        }}
      />

    </div>
  );
}
