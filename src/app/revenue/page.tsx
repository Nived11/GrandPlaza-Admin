'use client';

import React from 'react';
import DashboardMainPage from '@/features/dashboard/DashboardMainPage';
import AdminRoleGuard from '@/components/auth/AdminRoleGuard';

export default function AdminRevenuePage() {
  return (
    <AdminRoleGuard>
      <DashboardMainPage />
    </AdminRoleGuard>
  );
}
