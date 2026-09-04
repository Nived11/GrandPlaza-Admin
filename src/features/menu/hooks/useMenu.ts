"use client";

import { useState, useEffect } from "react";
import { 
  getMenuItemsApi, 
  createMenuItemApi, 
  updateMenuItemApi, 
  deleteMenuItemApi,
  MenuItemPayload
} from "../api/menuApi"; 
import { toast } from "sonner";
import { extractErrorMessages } from "@/utils/extractErrorMessages";

interface UseMenuFilters {
  activeSection?: string;
  activeCategory?: string;
  searchQuery?: string;
  isLowStock?: boolean;
  showUnavailable?: boolean;
}

export function useMenu(filters: UseMenuFilters = {}) {
  const [items, setItems] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  
  // Pagination States
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  // Loading & Error States
  const [isLoading, setIsLoading] = useState(true); // Initial load
  const [fetching, setFetching] = useState(false); // Background refetch/pagination
  const [actionLoading, setActionLoading] = useState(false); // Add/Edit/Delete
  const [error, setError] = useState<string | null>(null);

  const fetchMenuItems = async (currentPage = page) => {
    if (items.length === 0) setIsLoading(true);
    setFetching(true);
    setError(null);

    try {
      // Build query params
      const params: any = { page: currentPage };
      
      if (filters.searchQuery) params.search = filters.searchQuery;
      if (filters.activeSection && filters.activeSection !== "All") params.section = filters.activeSection;
      if (filters.activeCategory && filters.activeCategory !== "All") params.category = filters.activeCategory;
      if (filters.isLowStock) params.low_stock = true; // Assuming backend handles this param
      if (filters.showUnavailable) params.is_available = false; // Or whatever backend expects

      const data = await getMenuItemsApi(params);
      
      // API returns paginated structure: { count, next, previous, results }
      setItems(data.results || []);
      setTotalCount(data.count || 0);
      setHasNextPage(!!data.next);
      setHasPreviousPage(!!data.previous);
      
    } catch (err: any) {
      console.error("Error fetching menu items:", err);
      setError("Failed to load menu items. Please check your connection.");
    } finally {
      setIsLoading(false);
      setFetching(false);
    }
  };

  // Re-fetch when filters or page change
  useEffect(() => {
    // Reset to page 1 if filters change (except page change)
    setPage(1);
  }, [filters.activeSection, filters.activeCategory, filters.searchQuery, filters.isLowStock, filters.showUnavailable]);

  // Actually fetch data when page changes
  useEffect(() => {
    fetchMenuItems(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filters.activeSection, filters.activeCategory, filters.searchQuery, filters.isLowStock, filters.showUnavailable]);


  const addMenuItem = async (data: MenuItemPayload) => {
    setActionLoading(true);
    try {
      await createMenuItemApi(data);
      toast.success("Menu item created successfully!");
      fetchMenuItems(page); // Refresh list
      return true;
    } catch (err: any) {
      const msg = extractErrorMessages(err);
      toast.error(msg);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const updateMenuItem = async (id: number | string, data: Partial<MenuItemPayload>) => {
    setActionLoading(true);
    try {
      await updateMenuItemApi(id, data);
      toast.success("Menu item updated successfully!");
      fetchMenuItems(page); // Refresh list
      return true;
    } catch (err: any) {
      const msg = extractErrorMessages(err);
      toast.error(msg);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const deleteMenuItem = async (id: number | string) => {
    setActionLoading(true);
    try {
      const res = await deleteMenuItemApi(id);
      toast.success(res.message || "Menu item deleted successfully!");
      fetchMenuItems(page); // Refresh list
      return true;
    } catch (err: any) {
      const msg = extractErrorMessages(err);
      toast.error(msg);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  return {
    items,
    totalCount,
    isLoading,
    fetching,
    actionLoading,
    error,
    page,
    setPage,
    hasNextPage,
    hasPreviousPage,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    refreshItems: () => fetchMenuItems(page)
  };
}