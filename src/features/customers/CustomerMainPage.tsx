"use client";

import React, { useState } from "react";
import CustomerHeader from "./components/CustomerHeader";
import CustomerSearch from "./components/CustomerSearch";
import CustomerTable from "./components/CustomerTable";
import { useCustomer } from "./hooks/useCustomer";

export default function CustomerMainPage() {
  const {
    customerList,
    loading,
    error,
  } = useCustomer();

  const [searchQuery, setSearchQuery] = useState("");

  const filteredCustomers = customerList.filter((customer) => {
    const search = searchQuery.toLowerCase();

    return (
      customer.username.toLowerCase().includes(search) ||
      customer.email.toLowerCase().includes(search) ||
      customer.phone_number.includes(search)
    );
  });

  return (
    <div className="min-h-screen w-full text-slate-900 p-2 sm:p-4 lg:p-4 font-sans antialiased space-y-4 sm:space-y-6 overflow-x-hidden">

      <CustomerHeader />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 px-2 sm:px-6">

        <CustomerSearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

      </div>

      {loading ? (
        <div className="px-2 sm:px-6 py-12 text-center">
          <p className="text-xs font-bold text-gray-400">
            Loading customers...
          </p>
        </div>
      ) : error ? (
        <div className="px-2 sm:px-6 py-12 text-center">
          <p className="text-xs font-bold text-red-500">
            {error}
          </p>
        </div>
      ) : (
        <div className="px-2 sm:px-6">
          <CustomerTable customers={filteredCustomers} />
        </div>
      )}

    </div>
  );
}