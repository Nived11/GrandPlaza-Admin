import axiosInstance from "@/lib/axios";

export const getCustomersApi = async (page = 1, search = "") => {
  const params: Record<string, any> = { page };
  if (search) params.search = search;
  const response = await axiosInstance.get("/accounts/admin/customers", { params });
  return response.data;
};

// 🌟 NEW: Toggle Block API
export const toggleBlockCustomerApi = async (id: number) => {
  const response = await axiosInstance.patch(`/accounts/admin/customers/${id}/toggle-block`);
  return response.data;
};