import axiosInstance from "@/lib/axios";

export interface OfferBanner {
  id: number;
  title: string;
  subtitle: string;
  badge_text: string;
  badgeText?: string;
  image: string;
  imageUrl?: string;
  hide_text_overlay?: boolean;
  hideTextOverlay?: boolean;
  is_active: boolean;
  isActive?: boolean;
  created_at?: string;
  updated_at?: string;
}

// 1. Get all offer banners in library
export const getOfferBannersApi = async (): Promise<OfferBanner[]> => {
  const response = await axiosInstance.get(`/settings/offer-banners?_t=${Date.now()}`, {
    headers: { "Cache-Control": "no-cache" },
  });
  if (Array.isArray(response.data)) {
    return response.data;
  }
  if (response.data && Array.isArray(response.data.results)) {
    return response.data.results;
  }
  return [];
};

// 2. Upload and create new offer banner
export const createOfferBannerApi = async (formData: FormData): Promise<OfferBanner> => {
  const response = await axiosInstance.post("/settings/offer-banners", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// 3. Update existing banner
export const updateOfferBannerApi = async (
  id: number,
  data: FormData | Partial<OfferBanner>
): Promise<OfferBanner> => {
  const isFormData = typeof FormData !== "undefined" && data instanceof FormData;
  const response = await axiosInstance.patch(`/settings/offer-banners/${id}`, data, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : undefined,
  });
  return response.data;
};

// 4. Single-click Activate or Toggle
export const activateOfferBannerApi = async (
  id: number,
  action: "activate" | "toggle" | "deactivate" = "activate"
): Promise<{ message: string; banner: OfferBanner }> => {
  const response = await axiosInstance.post(`/settings/offer-banners/${id}/activate`, { action });
  return response.data;
};

// 5. Delete a banner from library
export const deleteOfferBannerApi = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/settings/offer-banners/${id}`);
};

// 6. Global card active toggle on customer site
export const toggleGlobalOfferCardApi = async (isActive: boolean): Promise<any> => {
  const response = await axiosInstance.patch("/settings/site-settings", {
    is_offer_card_active: isActive,
  });
  return response.data;
};
