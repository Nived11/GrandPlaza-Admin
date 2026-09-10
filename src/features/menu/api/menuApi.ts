import axiosInstance from "@/lib/axios";

export interface VariantPayload {
  size_name: string;
  actual_price: string;
  offer_price?: string;
  is_available: boolean;
}

export interface MenuItemPayload {
  category: string | number;
  section: string;
  name: string;
  description: string;
  dietary_preference: string;
  has_variants: boolean;
  actual_price?: string | null;
  offer_price?: string | null;
  is_available: boolean;
  variants?: VariantPayload[];
  image?: File | null | string;
  // 🌟 banner_image removed entirely
}

const buildFormData = (data: Partial<MenuItemPayload>) => {
  const formData = new FormData();
  
  if (data.category !== undefined) formData.append("category", data.category.toString());
  if (data.section !== undefined) formData.append("section", data.section);
  if (data.name !== undefined) formData.append("name", data.name);
  if (data.description !== undefined) formData.append("description", data.description);
  if (data.dietary_preference !== undefined) formData.append("dietary_preference", data.dietary_preference);
  if (data.has_variants !== undefined) formData.append("has_variants", String(data.has_variants));
  
  if (data.actual_price !== undefined && data.actual_price !== null) formData.append("actual_price", data.actual_price.toString());
  if (data.offer_price !== undefined && data.offer_price !== null) formData.append("offer_price", data.offer_price.toString());
  
  if (data.is_available !== undefined) formData.append("is_available", String(data.is_available));

  if (data.variants) {
    formData.append("variants", JSON.stringify(data.variants));
  }

  if (data.image instanceof File) formData.append("image", data.image);
  // 🌟 banner_image appender removed from here

  return formData;
};

// 🟢 Get Menu Items List
export const getMenuItemsApi = async (params: any = {}) => {
  const response = await axiosInstance.get("/menu/admin/menu-items", { params });
  return response.data;
};

// ➕ Create Menu Item
export const createMenuItemApi = async (data: MenuItemPayload) => {
  const formData = buildFormData(data);
  const response = await axiosInstance.post("/menu/admin/menu-items", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// ✏️ Update Menu Item
export const updateMenuItemApi = async (id: number | string, data: Partial<MenuItemPayload>) => {
  const formData = buildFormData(data);
  const response = await axiosInstance.patch(`/menu/admin/menu-items/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// 🗑️ Delete Menu Item
export const deleteMenuItemApi = async (id: number | string) => {
  const response = await axiosInstance.delete(`/menu/admin/menu-items/${id}`);
  return response.data;
};