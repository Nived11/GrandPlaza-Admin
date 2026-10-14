'use client';

import React, { useState } from 'react';
import CustomerHeader from './components/CustomerHeader';
import CustomerSearch from './components/CustomerSearch';
import CustomerTable from './components/CustomerTable';
import CustomerTableSkeleton from './components/CustomerTableSkeleton';
import CustomerOrdersModal from './components/CustomerOrdersModal';
import Pagination from '@/components/ui/Pagination';
import { useCustomer } from './hooks/useCustomer';

export default function CustomerMainPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const {
    customerList,
    loading,
    error,
    page,
    setPage,
    totalCount,
    hasNextPage,
    hasPreviousPage,
    filterType,
    setFilterType,
    sortBy,
    setSortBy,
    toggleBlockCustomer,
    selectedCustomer,
    customerOrders,
    loadingOrders,
    isOrdersModalOpen,
    openCustomerOrders,
    closeCustomerOrders,
  } = useCustomer(searchQuery);

  return (
    <div className="min-h-screen w-full text-slate-900 p-2 sm:p-4 lg:p-6 font-sans antialiased space-y-4 sm:space-y-6 overflow-x-hidden">
      
      {/* 🟢 Header */}
      <CustomerHeader />

      {/* 🔍 Search & Filter Bar */}
      <div className="px-2 sm:px-6">
        <CustomerSearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterType={filterType}
          setFilterType={setFilterType}
          sortBy={sortBy}
          setSortBy={setSortBy}
          totalCount={totalCount}
        />
      </div>

      {/* 📊 Content Table / Skeleton Loading */}
      {loading ? (
        <div className="px-2 sm:px-6">
          <CustomerTableSkeleton rowCount={10} />
        </div>
      ) : error ? (
        <div className="px-2 sm:px-6 py-12 text-center bg-white rounded-3xl border border-gray-100 shadow-xs">
          <p className="text-xs font-bold text-red-500">{error}</p>
        </div>
      ) : (
        <div className="px-2 sm:px-6 space-y-4">
          {/* Table with Block/Unblock and View Orders handlers */}
          <CustomerTable
            customers={customerList}
            onToggleBlock={toggleBlockCustomer}
            onViewOrders={openCustomerOrders}
          />

          {/* 🟢 Reusable Pagination (10 per page) */}
          <Pagination
            page={page}
            totalCount={totalCount}
            pageSize={10}
            onPageChange={setPage}
            isLoading={loading}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
          />
        </div>
      )}

      {/* 📜 Customer Orders Modal */}
      <CustomerOrdersModal
        isOpen={isOrdersModalOpen}
        onClose={closeCustomerOrders}
        customer={selectedCustomer}
        orders={customerOrders}
        loading={loadingOrders}
      />

    </div>
  );
}