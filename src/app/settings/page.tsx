'use client';

import React from "react";
import SettingsMainPage from "@/features/settings/SettingsMainPage";
import AdminRoleGuard from "@/components/auth/AdminRoleGuard";

export default function AdminSettingsPage() {
  return (
    <AdminRoleGuard>
      <SettingsMainPage />
    </AdminRoleGuard>
  );
}
