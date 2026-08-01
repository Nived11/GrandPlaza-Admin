"use client";

import { useState, useEffect } from "react";
import { 
  getDeliveryBoysApi, 
  createDeliveryBoyApi, 
  updateDeliveryBoyApi, 
  deleteDeliveryBoyApi, 
  DeliveryBoyPayload 
} from "../api/deliveryBoy.api";
import { toast } from "sonner";
import { extractErrorMessages } from "@/utils/extractErrorMessages"; // 👈 Connected here

export function useDeliveryBoys() {
  const [deliveryList, setDeliveryList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDeliveryBoys = async () => {
    setLoading(true);
    try {
      const data = await getDeliveryBoysApi();
      setDeliveryList(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Error fetching delivery boys:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveryBoys();
  }, []);

  const addDeliveryBoy = async (data: DeliveryBoyPayload) => {
    setActionLoading(true);
    setError(null);
    try {
      const res = await createDeliveryBoyApi(data);
      setDeliveryList((prev) => [...prev, res]);
      toast.success("Delivery boy created successfully!");
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

  const updateDeliveryBoy = async (id: number | string, data: Partial<DeliveryBoyPayload>) => {
    setActionLoading(true);
    setError(null);
    try {
      const res = await updateDeliveryBoyApi(id, data);
      setDeliveryList((prev) => prev.map((item) => (item.id === id ? { ...item, ...res } : item)));
      toast.success("Delivery boy updated successfully!");
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

  const deleteDeliveryBoy = async (id: number | string) => {
    setActionLoading(true);
    setError(null);
    try {
      await deleteDeliveryBoyApi(id);
      setDeliveryList((prev) => prev.filter((item) => item.id !== id));
      toast.success("Delivery boy deleted successfully!");
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
    deliveryList,
    loading,
    actionLoading,
    error,
    setError,
    addDeliveryBoy,
    updateDeliveryBoy,
    deleteDeliveryBoy,
    refreshDeliveryBoys: fetchDeliveryBoys,
  };
}