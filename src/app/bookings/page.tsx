'use client';

import BookingMainPage from '@/features/booking/BookingMainPage';
import React from 'react';

export default function AdminBookingsPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6 text-center">
      <BookingMainPage />
    </div>
  );
}
