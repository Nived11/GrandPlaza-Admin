"use client";

import { useState, useEffect } from "react";
import { 
  getCategoriesApi, 
  createCategoryApi, 
  updateCategoryApi, 
  deleteCategoryApi, 
  CategoryPayload 
} from "../api/categoryApi"; // Adjust this import path based on your folder structure
import { toast } from "sonner";
import { extractErrorMessages } from "@/utils/extractErrorMessages";

export function useCategory() {
  const [categoryList, setCategoryList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Added optional search parameter based on your API docs
  const fetchCategories = async (search?: string) => {
    setLoading(true);
    try {
      const data = await getCategoriesApi(search);
      setCategoryList(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Error fetching category list:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = async (data: CategoryPayload) => {
    setActionLoading(true);
    setError(null);
    try {
      const res = await createCategoryApi(data);
      setCategoryList((prev) => [...prev, res]);
      toast.success("Category created successfully!");
      return true;
    } catch (err: any) {
      const msg = extractErrorMessages(err);
      setError(msg);
      toast.error(msg);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const updateCategory = async (id: number | string, data: Partial<CategoryPayload>) => {
    setActionLoading(true);
    setError(null);
    try {
      const res = await updateCategoryApi(id, data);
      
      // API returns { status: true, message: "...", data: { ... } } for updates
      // So we extract the actual category object from res.data (or fallback to res if API changes)
      const updatedItem = res.data ? res.data : res;

      setCategoryList((prev) => 
        prev.map((item) => (item.id === id ? { ...item, ...updatedItem } : item))
      );
      toast.success(res.message || "Category updated successfully!");
      return true;
    } catch (err: any) {
      const msg = extractErrorMessages(err);
      setError(msg);
      toast.error(msg);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const deleteCategory = async (id: number | string) => {
    setActionLoading(true);
    setError(null);
    try {
      const res = await deleteCategoryApi(id);
      setCategoryList((prev) => prev.filter((item) => item.id !== id));
      toast.success(res.message || "Category deleted successfully!");
      return true;
    } catch (err: any) {
      const msg = extractErrorMessages(err);
      setError(msg);
      toast.error(msg);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  return {
    categoryList,
    loading,
    actionLoading,
    error,
    setError,
    addCategory,
    updateCategory,
    deleteCategory,
    fetchCategories, // Exported this so you can call it manually for searching
    refreshCategories: () => fetchCategories(),
  };
}