"use client";

import { useState, useEffect } from "react";
import { getCustomersApi } from "../api/customerApi";
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
}

export function useCustomer() {
  const [customerList, setCustomerList] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getCustomersApi();

      setCustomerList(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Error fetching customer list:", err);

      const msg = extractErrorMessages(err);

      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return {
    customerList,
    loading,
    error,
    fetchCustomers,
  };
}