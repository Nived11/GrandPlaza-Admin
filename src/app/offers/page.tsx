"use client";

import React from "react";
import OffersMainPage from "@/features/offers/OffersMainPage";
import AdminRoleGuard from "@/components/auth/AdminRoleGuard";

export default function OffersPage() {
  return (
    <AdminRoleGuard>
      <OffersMainPage />
    </AdminRoleGuard>
  );
}
