"use client";

import React from "react";
import CelebrationsMainPage from "@/features/celebrations/CelebrationsMainPage";
import AdminRoleGuard from "@/components/auth/AdminRoleGuard";

export default function CelebrationsPage() {
  return (
    <AdminRoleGuard>
      <CelebrationsMainPage />
    </AdminRoleGuard>
  );
}
