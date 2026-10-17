'use client';

import React from "react";
import ReviewsMainPage from "@/features/reviews/ReviewsMainPage";
import AdminRoleGuard from "@/components/auth/AdminRoleGuard";

export default function AdminReviewsPage() {
  return (
    <AdminRoleGuard>
      <ReviewsMainPage />
    </AdminRoleGuard>
  );
}
