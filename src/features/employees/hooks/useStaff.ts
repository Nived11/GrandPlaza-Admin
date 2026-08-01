"use client";

import { useState, useEffect } from "react";
import { getStaffsApi, createStaffApi, updateStaffApi, deleteStaffApi, StaffPayload } from "../api/staff.api";
import { toast } from "sonner";
import { extractErrorMessages } from "@/utils/extractErrorMessages"; // 👈 Connected here

export function useStaff() {
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStaffs = async () => {
    setLoading(true);
    try {
      const data = await getStaffsApi();
      setStaffList(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Error fetching staff list:", err);
    } fontFinally: {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchStaffs();
  }, []);

  const addStaff = async (data: StaffPayload) => {
    setActionLoading(true);
    setError(null);
    try {
      const res = await createStaffApi(data);
      setStaffList((prev) => [...prev, res]);
      toast.success("Staff created successfully!");
      return true;
    } catch (err: any) {
      const msg = extractErrorMessages(err); // 👈 Extracted clean error message
      setError(msg);
      toast.error(msg);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const updateStaff = async (id: number | string, data: Partial<StaffPayload>) => {
    setActionLoading(true);
    setError(null);
    try {
      const res = await updateStaffApi(id, data);
      setStaffList((prev) => prev.map((item) => (item.id === id ? { ...item, ...res } : item)));
      toast.success("Staff updated successfully!");
      return true;
    } catch (err: any) {
      const msg = extractErrorMessages(err); // 👈 Extracted clean error message
      setError(msg);
      toast.error(msg);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const deleteStaff = async (id: number | string) => {
    setActionLoading(true);
    setError(null);
    try {
      await deleteStaffApi(id);
      setStaffList((prev) => prev.filter((item) => item.id !== id));
      toast.success("Staff deleted successfully!");
      return true;
    } catch (err: any) {
      const msg = extractErrorMessages(err); // 👈 Extracted clean error message
      setError(msg);
      toast.error(msg);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  return {
    staffList,
    loading,
    actionLoading,
    error,
    setError,
    addStaff,
    updateStaff,
    deleteStaff,
    refreshStaffs: fetchStaffs,
  };
}