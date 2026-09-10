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
  showUnavailable?: boolean; // 🌟 Low stock parameter completely removed
}

export function useMenu(filters: UseMenuFilters = {}) {
  const [items, setItems] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  
  // Pagination States
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  // Loading & Error States
  const [isLoading, setIsLoading] = useState(true); 
  const [fetching, setFetching] = useState(false); 
  const [actionLoading, setActionLoading] = useState(false); 
  const [error, setError] = useState<string | null>(null);

  const fetchMenuItems = async (currentPage = page) => {
    if (items.length === 0) setIsLoading(true);
    setFetching(true);
    setError(null);

    try {
      const params: any = { page: currentPage };
      
      // 🌟 API ഡോക്കുമെൻ്റേഷൻ പോലെ കറക്റ്റ് ആയി മാപ്പ് ചെയ്തു
      if (filters.searchQuery) params.search = filters.searchQuery;
      if (filters.activeSection && filters.activeSection !== "All") params.section = filters.activeSection;
      if (filters.activeCategory && filters.activeCategory !== "All") params.category = filters.activeCategory;
      
      // 🌟 "Disabled Items Toggle: ?available=false" (അല്ലെങ്കിൽ ?available=true)
      // Toggle ഓൺ ആക്കിയാൽ Disabled Items (available=false) വരും. അല്ലെങ്കിൽ നോർമൽ (available=true) വരും.
      params.available = !filters.showUnavailable;

      const data = await getMenuItemsApi(params);
      
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

  useEffect(() => {
    setPage(1);
  }, [filters.activeSection, filters.activeCategory, filters.searchQuery, filters.showUnavailable]);

  useEffect(() => {
    fetchMenuItems(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filters.activeSection, filters.activeCategory, filters.searchQuery, filters.showUnavailable]);


  const addMenuItem = async (data: MenuItemPayload) => {
    setActionLoading(true);
    try {
      await createMenuItemApi(data);
      toast.success("Menu item created successfully!");
      fetchMenuItems(page); 
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
      fetchMenuItems(page); 
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
      fetchMenuItems(page); 
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