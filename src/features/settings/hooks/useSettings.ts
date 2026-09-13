"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getSiteSettingsApi,
  updateSiteSettingsApi,
  getFaqsApi,
  createFaqApi,
  updateFaqApi,
  deleteFaqApi,
  SiteSettings,
  FAQItem,
} from "../api/settingsApi";
import { toast } from "sonner";
import { extractErrorMessages } from "@/utils/extractErrorMessages";

const initialSettingsState: SiteSettings = {
  restaurant_name: "",
  email_address: "",
  phone_number: "",
  physical_address: "",
  address_type: "",
  latitude: 9.9312,
  longitude: 76.2673,
  delivery_radius: 10,
  footer_description: "",
  working_hours_mon_sat: "",
  working_hours_sunday: "",
  opening_time: "10:00:00",
  closing_time: "23:00:00",
  is_manually_open: true,
  is_open: true,
  instagram_url: "",
  facebook_url: "",
  twitter_url: "",
  whatsapp_url: "",
};

export function useSettings() {
  const [settings, setSettings] = useState<SiteSettings>(initialSettingsState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // FAQ states
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [faqsLoading, setFaqsLoading] = useState(true);

  // Fetch Settings
  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSiteSettingsApi();
      if (data) {
        setSettings({
          ...initialSettingsState,
          ...data,
          latitude: data.latitude ?? 9.9312,
          longitude: data.longitude ?? 76.2673,
          delivery_radius: data.delivery_radius ?? 10,
        });
      }
    } catch (err: any) {
      console.error("Error fetching site settings:", err);
      const msg = extractErrorMessages(err);
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch FAQs
  const fetchFaqs = useCallback(async () => {
    setFaqsLoading(true);
    try {
      const data = await getFaqsApi();
      if (Array.isArray(data)) {
        setFaqs(data);
      } else if (data && Array.isArray(data.results)) {
        setFaqs(data.results);
      } else {
        setFaqs([]);
      }
    } catch (err: any) {
      console.error("Error fetching FAQs:", err);
    } finally {
      setFaqsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
    fetchFaqs();
  }, [fetchSettings, fetchFaqs]);

  // Save Settings
  const saveSettings = async (dataToSave: Partial<SiteSettings>) => {
    setSaving(true);
    try {
      const updated = await updateSiteSettingsApi(dataToSave);
      toast.success("Settings updated successfully!");
      setSettings((prev) => ({ ...prev, ...updated }));
      return true;
    } catch (err: any) {
      console.error("Error saving settings:", err);
      const msg = extractErrorMessages(err);
      toast.error(msg);
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Quick Toggle Shop Open
  const toggleShopOpen = async () => {
    const nextState = !settings.is_manually_open;
    try {
      await updateSiteSettingsApi({ is_manually_open: nextState });
      setSettings((prev) => ({
        ...prev,
        is_manually_open: nextState,
        is_open: nextState,
      }));
      toast.success(
        nextState ? "Store manually opened!" : "Store manually marked closed!"
      );
    } catch (err: any) {
      const msg = extractErrorMessages(err);
      toast.error(msg);
    }
  };

  // FAQ Actions
  const addFaq = async (data: { question: string; answer: string; is_active?: boolean }) => {
    try {
      const created = await createFaqApi(data);
      toast.success("FAQ created successfully!");
      setFaqs((prev) => [created, ...prev]);
      return true;
    } catch (err: any) {
      const msg = extractErrorMessages(err);
      toast.error(msg);
      return false;
    }
  };

  const updateFaq = async (
    id: number,
    data: Partial<{ question: string; answer: string; is_active: boolean }>
  ) => {
    try {
      const updated = await updateFaqApi(id, data);
      toast.success("FAQ updated successfully!");
      setFaqs((prev) => prev.map((f) => (f.id === id ? { ...f, ...updated } : f)));
      return true;
    } catch (err: any) {
      const msg = extractErrorMessages(err);
      toast.error(msg);
      return false;
    }
  };

  const deleteFaq = async (id: number) => {
    try {
      await deleteFaqApi(id);
      toast.success("FAQ deleted successfully!");
      setFaqs((prev) => prev.filter((f) => f.id !== id));
      return true;
    } catch (err: any) {
      const msg = extractErrorMessages(err);
      toast.error(msg);
      return false;
    }
  };

  const toggleFaqActive = async (id: number, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    try {
      await updateFaqApi(id, { is_active: nextStatus });
      setFaqs((prev) =>
        prev.map((f) => (f.id === id ? { ...f, is_active: nextStatus } : f))
      );
      toast.success(nextStatus ? "FAQ activated" : "FAQ deactivated");
    } catch (err: any) {
      const msg = extractErrorMessages(err);
      toast.error(msg);
    }
  };

  return {
    settings,
    setSettings,
    loading,
    saving,
    error,
    saveSettings,
    toggleShopOpen,
    faqs,
    faqsLoading,
    addFaq,
    updateFaq,
    deleteFaq,
    toggleFaqActive,
    fetchSettings,
    fetchFaqs,
  };
}
