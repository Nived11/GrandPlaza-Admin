'use client';

import React from "react";
import InboxMainPage from "@/features/inbox/InboxMainPage";
import AdminRoleGuard from "@/components/auth/AdminRoleGuard";

export default function AdminInboxPage() {
  return (
    <AdminRoleGuard>
      <InboxMainPage />
    </AdminRoleGuard>
  );
}
