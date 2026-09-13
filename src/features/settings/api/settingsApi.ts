import axiosInstance from "@/lib/axios";

export interface SiteSettings {
  id?: number;
  restaurant_name: string;
  email_address: string;
  phone_number: string;
  physical_address: string;
  address_type?: string;
  latitude: number | string;
  longitude: number | string;
  delivery_radius: number | string;
  footer_description: string;
  working_hours_mon_sat: string;
  working_hours_sunday: string;
  opening_time: string | null;
  closing_time: string | null;
  is_manually_open: boolean;
  is_open?: boolean;
  instagram_url: string;
  facebook_url: string;
  twitter_url: string;
  whatsapp_url: string;
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  is_active: boolean;
  created_at?: string;
}

// Site Settings APIs
export const getSiteSettingsApi = async () => {
  const response = await axiosInstance.get("/settings/site-settings");
  return response.data;
};

export const updateSiteSettingsApi = async (data: Partial<SiteSettings>) => {
  const response = await axiosInstance.patch("/settings/site-settings", data);
  return response.data;
};

// FAQ APIs
export const getFaqsApi = async () => {
  const response = await axiosInstance.get("/faq/faqs");
  return response.data;
};

export const createFaqApi = async (data: {
  question: string;
  answer: string;
  is_active?: boolean;
}) => {
  const response = await axiosInstance.post("/faq/faqs", data);
  return response.data;
};

export const updateFaqApi = async (
  id: number,
  data: Partial<{ question: string; answer: string; is_active: boolean }>
) => {
  const response = await axiosInstance.patch(`/faq/faqs/${id}`, data);
  return response.data;
};

export const deleteFaqApi = async (id: number) => {
  const response = await axiosInstance.delete(`/faq/faqs/${id}`);
  return response.data;
};
