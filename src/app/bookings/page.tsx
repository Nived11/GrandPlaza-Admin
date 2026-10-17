'use client';

import BookingMainPage from '@/features/booking/BookingMainPage';
import AdminRoleGuard from '@/components/auth/AdminRoleGuard';
import React from 'react';

export default function AdminBookingsPage() {
  return (
    <AdminRoleGuard>
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6 text-center">
        <BookingMainPage />
      </div>
    </AdminRoleGuard>
  );
}
