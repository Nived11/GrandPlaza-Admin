"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  getAdminReviewsApi,
  toggleReviewApprovalApi,
  ReviewItem,
} from "../api/reviewsApi";
import { toast } from "sonner";
import { extractErrorMessages } from "@/utils/extractErrorMessages";

export function useReviews(initialSearch = "") {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState<"all" | "approved" | "hidden">("all");
  const [ratingFilter, setRatingFilter] = useState<number | "all">("all");
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getAdminReviewsApi(page, searchQuery);

      if (data && Array.isArray(data.results)) {
        setReviews(data.results);
        setTotalCount(data.count || 0);
        setHasNextPage(Boolean(data.next));
        setHasPreviousPage(Boolean(data.previous));
      } else if (Array.isArray(data)) {
        setReviews(data);
        setTotalCount(data.length);
        setHasNextPage(false);
        setHasPreviousPage(false);
      } else {
        setReviews([]);
        setTotalCount(0);
      }
    } catch (err: any) {
      console.error("Error fetching reviews:", err);
      const msg = extractErrorMessages(err);
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter, ratingFilter]);

  // Compute metrics
  const stats = useMemo(() => {
    if (reviews.length === 0) {
      return {
        total: 0,
        averageRating: 0,
        approvedCount: 0,
        hiddenCount: 0,
        fiveStarCount: 0,
      };
    }

    let sum = 0;
    let approved = 0;
    let hidden = 0;
    let fiveStars = 0;

    for (const r of reviews) {
      sum += r.rating;
      if (r.is_approved) approved++;
      else hidden++;
      if (r.rating === 5) fiveStars++;
    }

    const avg = Number((sum / reviews.length).toFixed(1));

    return {
      total: totalCount || reviews.length,
      averageRating: avg,
      approvedCount: approved,
      hiddenCount: hidden,
      fiveStarCount: fiveStars,
    };
  }, [reviews, totalCount]);

  // Filtered reviews client-side for status & rating
  const filteredReviews = useMemo(() => {
    return reviews.filter((item) => {
      // Status filter
      if (statusFilter === "approved" && !item.is_approved) return false;
      if (statusFilter === "hidden" && item.is_approved) return false;

      // Rating filter
      if (ratingFilter !== "all" && item.rating !== ratingFilter) return false;

      return true;
    });
  }, [reviews, statusFilter, ratingFilter]);

  // Toggle review approval / visibility
  const toggleApproval = async (id: number, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    try {
      await toggleReviewApprovalApi(id, newStatus);
      toast.success(
        newStatus
          ? "Review approved and now visible on customer site"
          : "Review hidden from customer site"
      );

      // Instant local update
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, is_approved: newStatus } : r))
      );
      return true;
    } catch (err: any) {
      console.error("Error toggling review approval:", err);
      const msg = extractErrorMessages(err);
      toast.error(msg);
      return false;
    }
  };

  return {
    reviews: filteredReviews,
    rawReviews: reviews,
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
    fetchReviews,
    toggleApproval,
  };
}
