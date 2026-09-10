'use client';

import CustomerMainPage from '@/features/customers/CustomerMainPage';
import React from 'react';

export default function AdminCustomersPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6 text-center">
      <CustomerMainPage />
    </div>
  );
}
