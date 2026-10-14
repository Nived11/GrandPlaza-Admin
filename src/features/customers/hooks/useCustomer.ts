"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getCustomersApi,
  toggleBlockCustomerApi,
  getCustomerOrdersApi,
} from "../api/customerApi";
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
  is_active: boolean;
  total_orders: number;
  total_spent: number;
  last_order_date: string | null;
  customer_badge?: "VIP" | "REGULAR" | "NEW" | "INACTIVE";
}

export interface CustomerOrderItem {
  id: number;
  item_name: string;
  variant_name?: string;
  quantity: number;
  unit_price: number;
  line_total: number;
}

export interface CustomerOrder {
  id: number;
  total_price: number;
  status: string;
  payment_status: string;
  delivery_address: string;
  special_instructions?: string;
  created_at: string;
  items_count: number;
  items: CustomerOrderItem[];
}

export function useCustomer(searchQuery = "") {
  const [customerList, setCustomerList] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  // 🎯 Filter & Sort States
  const [filterType, setFilterType] = useState<string>("all"); // 'all' | 'top' | 'active' | 'blocked'
  const [sortBy, setSortBy] = useState<string>("most_orders"); // 'most_orders' | 'highest_spent' | 'newest' | 'name'

  // 📦 Customer Orders Modal States
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getCustomersApi(page, searchQuery, filterType, sortBy);

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
  }, [page, searchQuery, filterType, sortBy]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, filterType, sortBy]);

  // 🌟 Toggle Block Handler
  const toggleBlockCustomer = async (id: number) => {
    try {
      const res = await toggleBlockCustomerApi(id);
      toast.success(res.message || "Customer status updated");
      // Instant UI update
      setCustomerList((prev) =>
        prev.map((c) => (c.id === id ? { ...c, is_active: !c.is_active } : c))
      );
    } catch (err: any) {
      const msg = extractErrorMessages(err);
      toast.error(msg);
    }
  };

  // 📜 Open Customer Orders Modal
  const openCustomerOrders = async (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsOrdersModalOpen(true);
    setLoadingOrders(true);
    try {
      const res = await getCustomerOrdersApi(customer.id);
      if (res && res.orders) {
        setCustomerOrders(res.orders);
      } else {
        setCustomerOrders([]);
      }
    } catch (err: any) {
      toast.error(extractErrorMessages(err));
      setCustomerOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  const closeCustomerOrders = () => {
    setIsOrdersModalOpen(false);
    setSelectedCustomer(null);
    setCustomerOrders([]);
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
    filterType,
    setFilterType,
    sortBy,
    setSortBy,
    fetchCustomers,
    toggleBlockCustomer,
    selectedCustomer,
    customerOrders,
    loadingOrders,
    isOrdersModalOpen,
    openCustomerOrders,
    closeCustomerOrders,
  };
}