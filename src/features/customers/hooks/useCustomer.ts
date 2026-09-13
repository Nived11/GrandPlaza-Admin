"use client";

import { useState, useEffect, useCallback } from "react";
import { getCustomersApi, toggleBlockCustomerApi } from "../api/customerApi";
import { toast } from "sonner";
import { extractErrorMessages } from "@/utils/extractErrorMessages";

export interface Customer {
  id: number;
  employee_id: number | null;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  role: string;
  address: string | null;
  is_active: boolean; // 👈 Status
}

export function useCustomer(searchQuery = "") {
  const [customerList, setCustomerList] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getCustomersApi(page, searchQuery);

      if (data && data.results) {
        setCustomerList(data.results);
        setTotalCount(data.count || 0);
        setHasNextPage(Boolean(data.next));
        setHasPreviousPage(Boolean(data.previous));
      } else if (Array.isArray(data)) {
        setCustomerList(data);
        setTotalCount(data.length);
        setHasNextPage(false);
        setHasPreviousPage(false);
      } else {
        setCustomerList([]);
        setTotalCount(0);
      }
    } catch (err: any) {
      console.error("Error fetching customer list:", err);
      const msg = extractErrorMessages(err);
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  // 🌟 Toggle Block Handler
  const toggleBlockCustomer = async (id: number) => {
    try {
      const res = await toggleBlockCustomerApi(id);
      toast.success(res.message || "Customer status updated");
      // Instant UI update
      setCustomerList(prev => 
        prev.map(c => c.id === id ? { ...c, is_active: !c.is_active } : c)
      );
    } catch (err: any) {
      const msg = extractErrorMessages(err);
      toast.error(msg);
    }
  };

  return {
    customerList,
    loading,
    error,
    page,
    setPage,
    totalCount,
    hasNextPage,
    hasPreviousPage,
    fetchCustomers,
    toggleBlockCustomer, // 👈 Exported
  };
}